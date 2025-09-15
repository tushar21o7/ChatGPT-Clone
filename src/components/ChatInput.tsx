"use client";
import React, { RefObject, useRef, useState } from "react";
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
    endRef,
}: {
    sendMessage: SendMessage;
    status?: string;
    stop?: () => void;
    endRef?: RefObject<HTMLDivElement | null>;
}) {
    const [prompt, setPrompt] = useState("");
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTimeout(
            () => endRef?.current?.scrollIntoView({ behavior: "smooth" }),
            1000
        );
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
                {!files?.length ? (
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
                ) : (
                    <div
                        className="text-4xl text-white cursor-pointer hover:bg-white/10 rounded-full p-2"
                        title={files[0].name}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                    </div>
                )}

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
