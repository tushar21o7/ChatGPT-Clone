"use client";

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

function ChatPage() {
    const { id }: { id: string } = useParams();
    const { messages, setMessages, error, sendMessage, status, stop } = useChat(
        {
            id,
            transport: new DefaultChatTransport({
                prepareSendMessagesRequest: ({ id, messages }) => {
                    return {
                        body: {
                            chatId: id,
                            messages,
                        },
                    };
                },
            }),
        }
    );

    const handleSave = async (messageId: string, newMessage: string) => {
        const newMessageArray = [];
        for (let i = 0; i < messages.length; i++) {
            const currentMessage = messages[i];
            if (currentMessage.id === messageId) break;
            newMessageArray.push(currentMessage);
        }

        await fetch(`/api/chat/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ messageId }),
        });

        setMessages(newMessageArray);
        sendMessage({ text: newMessage });
    };

    useEffect(() => {
        fetch(`/api/chat/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setMessages(data.messages);
            })
            .catch((err) => console.log(err));
    }, [id, setMessages]);

    return (
        <div className="flex flex-col justify-between h-[100%] pt-15 pb-5 overflow-hidden">
            <div className="overflow-y-scroll pl-8 scrollbar">
                <div className="flex-1 mx-auto max-w-3xl overflow-hidden items-center pt-10">
                    {messages?.map((message) => (
                        <div key={message.id} className="">
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
                                            part.mediaType?.startsWith("image/")
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
                    ))}
                    {error && (
                        <div className="text-red-500 mb-4">{error.message}</div>
                    )}
                </div>
            </div>
            <ChatInput sendMessage={sendMessage} status={status} stop={stop} />
        </div>
    );
}

export default ChatPage;
