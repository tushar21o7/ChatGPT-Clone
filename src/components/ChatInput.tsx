"use client";
import React, { useState } from "react";
import { ImArrowUpRight2 } from "react-icons/im";
import { BsPlusLg } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
// import { useChat, useCompletion } from "@ai-sdk/react";
import { FaSquare } from "react-icons/fa";

function ChatInput({
    id,
    sendMessage,
    status,
    stop,
}: {
    id?: string;
    sendMessage?: any;
    status?: string;
    stop?: any;
}) {
    const [prompt, setPrompt] = useState("");
    const router = useRouter();
    const userObj = useUser();

    // const { sendMessage, status, stop } = useChat();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: prompt });
        setPrompt("");
        // router.push(`/chat/${id}`);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 rounded-full flex items-center px-3 py-2.5 w-full"
            >
                <BsPlusLg className="text-4xl text-white cursor-pointer hover:bg-white/10 rounded-full p-2" />

                <input
                    type="text"
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-transparent w-full text-white placeholder:text-gray-400 px-3 outline-none"
                />
                {status === "submitted" || status === "streaming" ? (
                    <button
                        onClick={stop}
                        className="p-2.5 rounded-full text-white bg-white/10 cursor-pointer"
                    >
                        <FaSquare />
                    </button>
                ) : (
                    <button
                        disabled={!prompt}
                        className="p-2.5 rounded-full text-black bg-white disabled:bg-white/30 cursor-pointer"
                    >
                        <ImArrowUpRight2 className="-rotate-45 text-black/80" />
                    </button>
                )}
            </form>
        </div>
    );
}

export default ChatInput;
