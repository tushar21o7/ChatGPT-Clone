"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";

import React from "react";
function Profile() {
    const { user } = useUser();

    return (
        <div className="flex items-center text-sm px-2 py-2 ml-1.5 mr-3 rounded-lg gap-2 hover:bg-[#2f2f2f] cursor-pointer">
            <UserButton />
            <div className="flex flex-col items-start">
                <span className="text-[0.80rem]">{user?.fullName}</span>
                <SignOutButton>
                    <button className="text-[0.80rem] text-gray-400 cursor-pointer">
                        Sign out
                    </button>
                </SignOutButton>
            </div>
        </div>
    );
}

export default Profile;
