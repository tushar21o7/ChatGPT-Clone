"use client";

import React, { useEffect, useRef, useState } from "react";

function EditableChatName({
    id,
    value,
    setIsEditing,
}: {
    id: string;
    value: string;
    setIsEditing: (val: boolean) => void;
}) {
    const [chatName, setChatName] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        fetch(`/api/chat/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ title: chatName }),
        })
            .then(() => setIsEditing(false))
            .catch((err) => console.log("Cannot edit name", err));
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <input
            type="text"
            ref={inputRef}
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
            }}
            className="group flex items-center text-sm px-2 py-2 ml-1.5 mr-3 rounded-lg justify-between hover:bg-[#2f2f2f] cursor-pointer"
        />
    );
}

export default EditableChatName;
