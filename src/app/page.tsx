"use client";

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { DefaultChatTransport } from "ai";
import mongoose from "mongoose";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

function ChatPage() {
    const { id }: { id: string } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [chatId, setChatId] = useState(id ?? new mongoose.Types.ObjectId());
    const endRef = useRef<HTMLDivElement | null>(null);

    const { messages, setMessages, error, sendMessage, status, stop } = useChat(
        {
            id: "my-chat",
            transport: new DefaultChatTransport({
                prepareSendMessagesRequest: ({ id, messages }) => {
                    return {
                        body: { chatId, messages },
                    };
                },
            }),
            onFinish: () => {
                if (user?.id && id !== chatId) router.push(`/chat/${chatId}`);
            },
        }
    );

    const handleSave = (messageId: string, newMessage: string) => {
        const newMessageArray = [];
        for (let i = 0; i < messages.length; i++) {
            const currentMessage = messages[i];
            if (currentMessage.id === messageId) break;
            newMessageArray.push(currentMessage);
        }

        setMessages(newMessageArray);
        sendMessage({ text: newMessage });
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div
            className={`flex flex-col ${
                messages.length
                    ? "justify-between"
                    : "justify-between sm:justify-center sm:gap-8"
            }  h-[100%] pt-15 overflow-hidden`}
        >
            {!messages.length && <div></div>}
            <div
                className={`overflow-y-scroll scrollbar ${
                    messages.length && "pb-[80px]"
                }`}
            >
                <div className="px-5 flex-1 mx-auto max-w-3xl overflow-hidden items-center pt-10">
                    {messages.length ? (
                        messages?.map((message) => (
                            <div key={message.id}>
                                {message.parts.map((part, index) => {
                                    switch (part.type) {
                                        case "text":
                                            return (
                                                <Message
                                                    key={index}
                                                    messageId={message.id}
                                                    text={part.text}
                                                    role={message.role}
                                                    handleSave={handleSave}
                                                />
                                            );
                                        case "file":
                                            if (
                                                part.mediaType?.startsWith(
                                                    "image/"
                                                )
                                            ) {
                                                return (
                                                    <div
                                                        key={`${message.id}-${index}`}
                                                        className="flex justify-end"
                                                    >
                                                        <Image
                                                            src={part.url}
                                                            alt={
                                                                part.filename ??
                                                                `attachment-${index}`
                                                            }
                                                            width={200}
                                                            height={200}
                                                            className="mr-0"
                                                        />
                                                    </div>
                                                );
                                            }
                                            if (
                                                part.mediaType?.startsWith(
                                                    "application/pdf"
                                                )
                                            ) {
                                                return (
                                                    <div
                                                        key={`${message.id}-${index}`}
                                                        className="flex justify-end"
                                                    >
                                                        <iframe
                                                            src={part.url}
                                                            width="500"
                                                            height="600"
                                                            title={
                                                                part.filename ??
                                                                `attachment-${index}`
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-3xl whitespace-pre-wrap">
                            ChatGPT
                        </div>
                    )}
                    {(status === "submitted" || status === "streaming") && (
                        <div className="animate-pulse bg-white h-3 w-3 rounded-full"></div>
                    )}
                    {error && (
                        <div className="text-red-500 mb-4">{error.message}</div>
                    )}
                    <div ref={endRef}></div>
                </div>
            </div>
            <div className="flex flex-col gap-2 pb-2">
                <ChatInput
                    sendMessage={sendMessage}
                    status={status}
                    stop={stop}
                    endRef={endRef}
                />
                <span
                    className={`${
                        !messages.length && "md:hidden"
                    } mx-5 text-center text-xs`}
                >
                    ChatGPT can make mistakes. Check important info. See{" "}
                    <u>Cookie Preferences</u>
                </span>
            </div>
        </div>
    );
}

export default ChatPage;
