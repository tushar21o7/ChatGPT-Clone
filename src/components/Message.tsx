import React from "react";

function Message({
    text,
    role,
}: {
    text: string;
    role: "user" | "assistant" | "system";
}) {
    return (
        <>
            {role === "user" ? (
                <div className="flex justify-end">
                    <div className="whitespace-pre-wrap bg-[#323232D9] px-4 py-1.5 data-[multiline]:py-3 rounded-[18px] w-max left-0 mb-[40px]">
                        {text}
                    </div>
                </div>
            ) : (
                <div className="flex justify-start">
                    <div className="whitespace-pre-wrap mb-[50px]">{text}</div>
                </div>
            )}
        </>
    );
}

export default Message;
