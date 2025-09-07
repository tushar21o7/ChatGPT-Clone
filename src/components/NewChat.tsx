"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";

function NewChat() {
    const router = useRouter();
    const { user } = useUser();

    const handleClick = async () => {
        if (!user) {
            window.location.reload();
            return;
        }

        try {
            const resp = await fetch("/api/chats", {
                method: "POST",
            });
            const data = await resp.json();
            router.push(`/chat/${data.chatId}`);
        } catch (error) {
            console.error("Error while creating new chat", error);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="flex items-center text-sm px-2 py-2 ml-1.5 mr-3 rounded-lg gap-2 hover:bg-[#2f2f2f] cursor-pointer"
        >
            <HiOutlinePencilAlt className="text-xl" /> New chat
        </div>
    );
}

export default NewChat;
