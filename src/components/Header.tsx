import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import React from "react";
import { FiChevronDown } from "react-icons/fi";

function Header() {
    return (
        <div className=" flex items-center justify-between m-2.5 h-10  absolute w-full top-0 left-0 pl-2 pr-12">
            <div className="flex items-center gap-1 hover:bg-[#2f2f2f]  font-semibold tracking-wide px-3 py-2 rounded-lg duration-300">
                ChatGPT <FiChevronDown />
            </div>

            <div className="flex gap-3">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="bg-white text-black px-2.5 py-1.5 rounded-full cursor-pointer">
                            Log in
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="px-2.5 py-1.5 rounded-full border cursor-pointer">
                            Sign up for free
                        </button>
                    </SignUpButton>
                </SignedOut>
            </div>
        </div>
    );
}

export default Header;
