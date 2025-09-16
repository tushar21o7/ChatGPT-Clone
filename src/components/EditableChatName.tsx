"use client";

import React, { useEffect, useRef, useState } from "react";

interface Chat {
    _id: string;
    title: string;
}

function EditableChatName({
    id,
    value,
    setIsEditing,
    activeChatMenuId,
    setActiveChatMenuId,
    chats,
    setChats,
}: {
    id: string;
    value: string;
    setIsEditing: (val: boolean) => void;
    activeChatMenuId: string | null;
    setActiveChatMenuId: (val: string | null) => void;
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
}) {
    const [chatName, setChatName] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        fetch(`/api/chat/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ title: chatName }),
        })
            .then(() => {
                setIsEditing(false);
                setActiveChatMenuId(null);
                const newChats = chats;
                for (let i = 0; i < newChats.length; i++)
                    if (newChats[i]._id === activeChatMenuId)
                        newChats[i].title = chatName;
                setChats(newChats);
            })
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
