"use client";

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

function ChatPage() {
    const { messages, setMessages, error, sendMessage, status, stop } =
        useChat();
    const endRef = useRef<HTMLDivElement | null>(null);

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
            <div className="overflow-y-scroll scrollbar">
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
                    {error && (
                        <div className="text-red-500 mb-4">{error.message}</div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 pb-2">
                <ChatInput
                    sendMessage={sendMessage}
                    status={status}
                    stop={stop}
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
