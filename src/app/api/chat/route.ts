import { UIMessage, streamText, convertToModelMessages, generateId } from "ai";
import { google } from "@ai-sdk/google";
import { trimMessages } from "@/lib/utils/trim";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/dbConnect";
import ChatModel from "@/models/ChatModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const { messages, chatId }: { messages: UIMessage[]; chatId?: string } =
            await req.json();
        const { userId } = await auth();

        if (userId) {
            await connectDB();
            if (!chatId) {
                const newChat = await ChatModel.create({
                    title: "New chat",
                    user: userId,
                });
                return NextResponse.json({ chatId: newChat._id });
            }
        }

        const modelName = "models/gemini-2.5-flash";
        const trimmedMessages = await trimMessages(messages, modelName);

        const result = streamText({
            model: google(modelName),
            system: "You are a helpful assistant. Always format your answers in Markdown for readability. Use headings (##), bullet lists, numbered steps, and fenced code blocks (```) for code examples.",
            messages: convertToModelMessages(trimmedMessages),
        });

        return result.toUIMessageStreamResponse({
            originalMessages: trimmedMessages,
            generateMessageId: () => generateId(),
            onFinish: async ({ messages, responseMessage }) => {
                if (chatId) {
                    await ChatModel.findByIdAndUpdate(
                        new mongoose.Types.ObjectId(chatId),
                        {
                            $push: {
                                messages: {
                                    $each: [
                                        messages[messages.length - 2],
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
