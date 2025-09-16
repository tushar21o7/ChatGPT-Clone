"use client";

import React, { useEffect, useState } from "react";
import NewChat from "./NewChat";
import Link from "next/link";
import { SignedIn, useUser } from "@clerk/nextjs";
import Profile from "./Profile";
import ChatList from "./ChatList";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";

function Sidebar() {
    const [open, setOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (window.innerWidth > 640) {
            setOpen(true);
        }
    }, []);

    if (!user) return null;

    return (
        <div className="bg-[#212121]">
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 lg:hidden z-30"
                    onClick={() => setOpen(false)}
                />
            )}
            {open ? (
                <div className="fixed top-0 left-0 z-50 lg:static flex flex-col gap-5 py-3 h-screen bg-[#191919] text-gray-200 w-[60%] lg:max-w-[300px] h-screen overflow-y-auto md:min-w-[15rem]">
                    <div className="flex justify-between px-2">
                        <Link href={"/"} className="w-fit">
                            <Image
                                src={logo}
                                alt={"Logo"}
                                className="p-1 hover:bg-[#2f2f2f] rounded-lg"
                                width={35}
                                height={35}
                            />
                        </Link>
                        <div
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-2 py-1 hover:bg-[#2f2f2f] items-center my-auto"
                        >
                            <RxHamburgerMenu />
                        </div>
                    </div>
                    <NewChat />
                    <SignedIn>
                        <div className="flex flex-col justify-between h-full">
                            <ChatList />
                            <Profile />
                        </div>
                    </SignedIn>
                </div>
            ) : (
                <div onClick={() => setOpen(true)}>
                    <div className="rounded-lg py-1 px-2 ml-1 mt-5 hover:bg-[#2f2f2f] bg-[#212121]">
                        <RxHamburgerMenu />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
