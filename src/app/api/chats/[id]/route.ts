import ChatModel from "@/models/ChatModel";
import { UIMessage, streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import mongoose from "mongoose";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        const result = streamText({
            model: google("models/gemini-2.5-flash"),
            messages: convertToModelMessages(messages),
        });

        await ChatModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { $push: { messages: messages[0] } },
            { new: true }
        );

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Something streaming chat completion", error);
        return new Response("Failed to stream chat completion", {
            status: 500,
        });
    }
}
