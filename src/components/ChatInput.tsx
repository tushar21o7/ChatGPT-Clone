"use client";
import React, { useRef, useState } from "react";
import { ImArrowUpRight2 } from "react-icons/im";
import { BsPlusLg } from "react-icons/bs";
import { FaSquare } from "react-icons/fa";
import { ChatRequestOptions } from "ai";

type SendMessage = (
    message?: {
        text: string;
        files: FileList | undefined;
        id?: string;
        role?: "system" | "user" | "assistant";
    },
    options?: ChatRequestOptions
) => Promise<void>;

function ChatInput({
    sendMessage,
    status,
    stop,
}: {
    sendMessage: SendMessage;
    status?: string;
    stop?: () => void;
}) {
    const [prompt, setPrompt] = useState("");
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: prompt, files });
        setPrompt("");
        setFiles(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto px-5">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 rounded-full flex items-center px-3 py-2.5 w-full"
            >
                <label htmlFor="file-upload">
                    <BsPlusLg className="text-4xl text-white cursor-pointer hover:bg-white/10 rounded-full p-2" />
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(event) => {
                            if (event.target.files) {
                                setFiles(event.target.files);
                            }
                        }}
                        multiple
                        ref={fileInputRef}
                    />
                </label>

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
                        disabled={!prompt && !files}
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
