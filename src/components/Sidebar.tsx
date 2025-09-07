import React from "react";
import NewChat from "./NewChat";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import Profile from "./Profile";
import ChatList from "./ChatList";
import logo from "@/app/assets/logo.png";
import Image from "next/image";

function Sidebar() {
    return (
        <div className="flex flex-col gap-5 py-3 h-screen">
            <Link href={"/"} className="w-fit">
                <Image
                    src={logo}
                    alt={"Logo"}
                    className="px-3.5"
                    width={55}
                    height={55}
                />
            </Link>
            <NewChat />
            <SignedIn>
                <div className="flex flex-col justify-between h-full">
                    <ChatList />
                    <Profile />
                </div>
            </SignedIn>
        </div>
    );
}

export default Sidebar;
