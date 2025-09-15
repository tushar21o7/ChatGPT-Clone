"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import EditableChatName from "./EditableChatName";
import { useParams, useRouter } from "next/navigation";

interface Chat {
    _id: string;
    title: string;
}

function ChatList() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeChatMenuId, setActiveChatMenuId] = useState<string | null>(
        null
    );
    const params = useParams();
    const router = useRouter();

    const handleDelete = async (chatId: string) => {
        fetch(`/api/chat/${chatId}`, { method: "DELETE" })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const newChatList = chats.filter((chat) => chat._id !== chatId);
                setChats(newChatList);
                setActiveChatMenuId(null);
                if (params.id === chatId) {
                    router.push("/");
                }
            })
            .catch((err) => console.log("Cannot delete: ", err));
    };

    useEffect(() => {
        fetch(`/api/chat`)
            .then((res) => res.json())
            .then((data) => {
                setChats(data.chats);
            })
            .catch((err) => console.log(err.message));
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-sm text-gray-400 ml-3">Chats</span>
            {chats &&
                chats?.map((chat) => (
                    <div key={chat._id} className="flex flex-col">
                        {!isEditing ? (
                            <Link
                                key={chat._id}
                                href={`/chat/${chat._id}`}
                                className="group flex items-center text-sm px-2 py-2 ml-1.5 mr-3 rounded-lg justify-between hover:bg-[#2f2f2f] cursor-pointer"
                            >
                                <span>{chat.title}</span>{" "}
                                <BsThreeDots
                                    className="invisible group-hover:visible"
                                    onClick={() =>
                                        setActiveChatMenuId(chat._id)
                                    }
                                />
                                {activeChatMenuId === chat._id && (
                                    <div className="absolute left-[200px] mt-2 w-fit origin-top-right bg-gray-500 rounded-xl shadow-lg z-50 flex flex-col gap-2 px-5 py-3">
                                        <button>Share</button>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Rename
                                        </button>
                                        <button>Archive</button>
                                        <button
                                            onClick={() =>
                                                handleDelete(chat._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <EditableChatName
                                key={chat._id}
                                id={chat._id}
                                value={chat.title}
                                setIsEditing={() => setIsEditing}
                            />
                        )}
                    </div>
                ))}
        </div>
    );
}

export default ChatList;
