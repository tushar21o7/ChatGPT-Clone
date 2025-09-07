"use client";

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import React from "react";

function Chat() {
    const { id }: { id: string } = useParams();

    const { messages, error, sendMessage, status, stop } = useChat();

    return (
        <div className="flex flex-col justify-center h-[100%] pt-15 pb-5 overflow-hidden">
            <div className="overflow-y-scroll pl-8 scrollbar">
                <div className="flex-1 mx-auto max-w-3xl overflow-hidden items-center pt-10">
                    {error && (
                        <div className="text-red-500 mb-4">{error.message}</div>
                    )}
                    {messages?.map((message) => (
                        <div key={message.id} className="">
                            {message.parts.map((part, index) => {
                                switch (part.type) {
                                    case "text":
                                        return (
                                            <Message
                                                key={index}
                                                text={part.text}
                                                role={message.role}
                                            />
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <ChatInput sendMessage={sendMessage} status={status} stop={stop} />
        </div>
    );
}

export default Chat;
