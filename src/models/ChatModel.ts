import mongoose, { Schema, Document, Model } from "mongoose";

export interface Part {
    type: "text" | "step-start" | "file";
    text?: string;
    providerMetadata?: string;
    state?: string;
    filename?: string;
    mediaType?: string;
    url?: string;
}

export interface Message {
    id: string;
    metadata?: string;
    role: "user" | "assistant";
    parts: Part[];
}

export interface Chat {
    title: string;
    user: string;
    messages: Message[];
}

interface ChatDocument extends Chat, Document {}

const PartSchema = new Schema<Part>(
    {
        type: {
            type: String,
            enum: ["text", "step-start", "file"],
            required: true,
        },
        text: { type: String },
        filename: { type: String },
        mediaType: { type: String },
        url: { type: String },
        providerMetadata: { type: String },
        state: { type: String },
    },
    { _id: false }
);

const MessageSchema = new Schema<Message>(
    {
        id: { type: String, required: true },
        metadata: { type: String },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        parts: { type: [PartSchema] },
    },
    { _id: false }
);

const ChatSchema = new Schema<ChatDocument>(
    {
        title: { type: String, required: true },
        user: { type: String, required: true },
        messages: { type: [MessageSchema], default: [] },
    },
    { timestamps: true }
);

const ChatModel: Model<ChatDocument> =
    mongoose.models.Chat || mongoose.model<ChatDocument>("Chat", ChatSchema);

export default ChatModel;
