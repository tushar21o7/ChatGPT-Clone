import { NextResponse } from "next/server";
import ChatModel from "@/models/ChatModel";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    const { userId } = await auth();
    try {
        const chats = await ChatModel.find({ user: userId });
        return NextResponse.json({ chats });
    } catch (error) {
        console.error("Error: ", error);
        return new Response("Error while getting chat list", {
            status: 500,
        });
    }
}

export async function POST() {
    const { userId } = await auth();

    await dbConnect();
    try {
        const newChat = await ChatModel.create({
            title: "New Chat",
            user: userId,
        });
        return NextResponse.json({ chatId: newChat._id });
    } catch (error) {
        console.error("Error: ", error);
        return new Response("Error while getting chat list", {
            status: 500,
        });
    }
}
