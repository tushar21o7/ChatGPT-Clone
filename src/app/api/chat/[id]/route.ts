import ChatModel from "@/models/ChatModel";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectDB();
        const chat = await ChatModel.findById(id);
        return NextResponse.json({ messages: chat?.messages });
    } catch (error) {
        console.error("Error: ", error);
        return new Response("Error while getting chat", {
            status: 500,
        });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { title, messageId } = await req.json();

    try {
        await connectDB();
        const chat = await ChatModel.findById(id);
        if (!chat) {
            return NextResponse.json({
                msg: "Chat doesn't exist",
                status: 400,
            });
        }

        if (title) {
            const newChat = await ChatModel.findByIdAndUpdate(
                id,
                { title },
                { new: true }
            );
            return NextResponse.json({ chat: newChat });
        }

        const newMessageArray = [];
        for (let i = 0; i < chat.messages.length; i++) {
            const message = chat.messages[i];
            if (typeof message !== "string" && message.id === messageId) break;
            newMessageArray.push(message);
        }

        await ChatModel.findByIdAndUpdate(id, { messages: newMessageArray });

        return NextResponse.json({ msg: "Updated" });
    } catch (error) {
        console.error("Something streaming chat completion", error);
        return new Response("Failed to stream chat completion", {
            status: 500,
        });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectDB();
        const deletedChat = await ChatModel.findByIdAndDelete(id);
        return NextResponse.json({ deletedChat });
    } catch (error) {
        console.error("Something streaming chat completion", error);
        return new Response("Failed to stream chat completion", {
            status: 500,
        });
    }
}
