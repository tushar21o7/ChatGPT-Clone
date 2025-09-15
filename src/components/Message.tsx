import React, { useState } from "react";
import { MarkdownResponse } from "./MarkdownResponse";
import { PiCopyThin } from "react-icons/pi";
import { GrFormEdit } from "react-icons/gr";
import { FiCheck } from "react-icons/fi";

function Message({
    text,
    messageId,
    role,
    handleSave,
}: {
    text: string;
    messageId: string;
    role: "user" | "assistant" | "system";
    handleSave: (messageId: string, newMessage: string) => void;
}) {
    const [hover, setHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {role === "user" ? (
                <>
                    {isEditing ? (
                        <div className="w-full bg-white/10 rounded-3xl">
                            <textarea
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                className="bg-transparent w-full border-none focus:outline-none overflow-hidden resize-none focus:ring-0 focus-visible:ring-0 mt-3 mx-3"
                            ></textarea>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setHover(false);
                                    }}
                                    className="bg-black text-white px-2.5 py-1.5 rounded-full cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        handleSave(messageId, newText)
                                    }
                                    className="px-2.5 py-1.5 rounded-full bg-white text-black cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            <div
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                className="max-w-[70%]"
                            >
                                <div className="whitespace-pre-wrap bg-[#323232D9] px-4 py-1.5 data-[multiline]:py-3 rounded-[18px]">
                                    {text}
                                </div>
                                <span className="flex justify-end gap-2 text-3xl text-bold mr-2 h-[40px] mt-2">
                                    {hover && (
                                        <>
                                            {!copied ? (
                                                <PiCopyThin
                                                    onClick={handleCopy}
                                                    className="rounded-lg p-1 hover:bg-[#2f2f2f] cursor-pointer"
                                                />
                                            ) : (
                                                <FiCheck
                                                    onClick={handleCopy}
                                                    className="rounded-lg p-1 hover:bg-[#2f2f2f] cursor-pointer"
                                                />
                                            )}{" "}
                                            <GrFormEdit
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                                className="rounded-lg p-1 hover:bg-[#2f2f2f] cursor-pointer"
                                            />
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <MarkdownResponse
                    content={text}
                    handleCopy={handleCopy}
                    copied={copied}
                />
            )}
        </>
    );
}

export default Message;
