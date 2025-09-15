import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { PiCopyThin } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";

interface MarkdownResponseProps {
    content: string;
    handleCopy: () => void;
    copied: boolean;
}

export const MarkdownResponse: React.FC<MarkdownResponseProps> = ({
    content,
    handleCopy,
    copied,
}) => {
    return (
        <article className="prose markdown mb-[60px]">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");

                        return match ? (
                            <div className="relative my-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
                                <div className="flex justify-between items-center px-3 py-2.5 bg-[#1d1f21] text-xs text-gray-300">
                                    <span className="font-mono">
                                        {match[1] || "text"}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="text-gray-400 hover:text-white transition cursor-pointer"
                                    >
                                        {copied ? "✅ Copied" : "📋 Copy code"}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
            {copied ? (
                <FiCheck
                    onClick={handleCopy}
                    className="rounded-lg p-1 hover:bg-[#2f2f2f] cursor-pointer text-3xl"
                />
            ) : (
                <PiCopyThin
                    onClick={handleCopy}
                    className="rounded-lg p-1 hover:bg-[#2f2f2f] cursor-pointer text-3xl"
                />
            )}
        </article>
    );
};
