"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

interface Chat {
    _id: string;
    title: string;
}

function ChatList() {
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        fetch(`/api/chats`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setChats(data.chats);
            })
            .catch((err) => console.log(err.message));
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-sm text-gray-400 ml-3">Chats</span>
            <div className="flex flex-col">
                {chats &&
                    chats?.map((chat) => (
                        <Link
                            key={chat._id}
                            href={`/chat/${chat._id}`}
                            className="group flex items-center text-sm px-2 py-2 ml-1.5 mr-3 rounded-lg justify-between hover:bg-[#2f2f2f] cursor-pointer"
                        >
                            <span>{chat.title}</span>{" "}
                            <BsThreeDots className="invisible group-hover:visible" />
                        </Link>
                    ))}
            </div>
        </div>
    );
}

export default ChatList;
