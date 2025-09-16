/* eslint-disable @typescript-eslint/no-explicit-any */

import { UIMessage, streamText, convertToModelMessages, generateId } from "ai";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/dbConnect";
import ChatModel from "@/models/ChatModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { createMem0 } from "@mem0/vercel-ai-provider";
import { uploadFileToCloudinary } from "@/lib/utils/file-upload";

const mem0 = createMem0({
    provider: "google",
});

export async function POST(req: Request) {
    try {
        const { messages, chatId }: { messages: UIMessage[]; chatId?: string } =
            await req.json();
        const { userId } = await auth();

        if (userId) {
            console.log("user", userId);
            await connectDB();
            if (!chatId) {
                const newChat = await ChatModel.create({
                    title: "New chat",
                    user: userId,
                });
                return NextResponse.json({ chatId: newChat._id });
            } else {
                const chatExists = await ChatModel.findById(chatId);
                if (!chatExists) {
                    await ChatModel.create({
                        _id: chatId,
                        title: "New chat",
                        user: userId,
                    });
                }
            }
        }

        const modelName = "models/gemini-2.5-flash";
        // const trimmedMessages = await trimMessages(messages);
        const trimmedMessages = messages;

        // const model = userId
        //     ? mem0(modelName, { user_id: userId })
        //     : google(modelName);

        const model = google(modelName);

        const result = streamText({
            model,
            system: "You are a helpful assistant. Always format your answers in Markdown for readability. Use headings (##), bullet lists, numbered steps, and fenced code blocks (```) for code examples.",
            messages: convertToModelMessages(trimmedMessages),
        });

        return result.toUIMessageStreamResponse({
            originalMessages: trimmedMessages,
            generateMessageId: () => generateId(),
            onFinish: async ({ messages, responseMessage }) => {
                if (userId && chatId) {
                    const newMessages: any = messages;
                    if (
                        newMessages[newMessages.length - 2].parts[0].type ===
                        "file"
                    ) {
                        const { url } = await uploadFileToCloudinary(
                            newMessages[newMessages.length - 2].parts[0].url
                        );
                        newMessages[newMessages.length - 2].parts[0].url = url;
                    }

                    await ChatModel.findByIdAndUpdate(
                        new mongoose.Types.ObjectId(chatId),
                        {
                            $push: {
                                messages: {
                                    $each: [
                                        newMessages[newMessages.length - 2],
                                        responseMessage,
                                    ],
                                },
                            },
                        },
                        { new: true }
                    );
                }
            },
        });
    } catch (error) {
        console.error("Something streaming chat completion", error);
        return new Response("Failed to stream chat completion", {
            status: 500,
        });
    }
}

export async function GET() {
    const { userId } = await auth();
    try {
        await connectDB();
        const chats = await ChatModel.find({ user: userId });
        return NextResponse.json({ chats });
    } catch (error) {
        console.error("Error: ", error);
        return new Response("Error while getting chat list", {
            status: 500,
        });
    }
}
