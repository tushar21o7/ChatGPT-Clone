import {
    ClerkLoaded,
    SignInButton,
    SignUpButton,
    SignedOut,
    SignedIn,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import logo from "@/app/assets/logo.png";

function Header() {
    return (
        <div className="flex items-center justify-between px-2.5 pt-4 absolute w-full top-0 left-0">
            <SignedIn>
                <div className="flex items-center gap-1 hover:bg-[#2f2f2f]  font-semibold tracking-wide px-3 py-2 rounded-lg duration-300">
                    ChatGPT <FiChevronDown />
                </div>
            </SignedIn>
            <SignedOut>
                <Link href={"/"} className="w-fit">
                    <Image
                        src={logo}
                        alt={"Logo"}
                        className="p-1 w-full rounded-lg hover:bg-[#2f2f2f]"
                        width={30}
                        height={30}
                    />
                </Link>
            </SignedOut>

            <div className="flex gap-3">
                <ClerkLoaded>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-white text-black px-2.5 py-1.5 rounded-full cursor-pointer">
                                Log in
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="hidden sm:inline-flex px-2.5 py-1.5 rounded-full border border-gray-500 cursor-pointer">
                                Sign up for free
                            </button>
                        </SignUpButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </div>
    );
}

export default Header;
