import { SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

async function Profile() {
    const userObj = await currentUser();

    return (
        <div className="flex items-center text-sm px-2 py-2 ml-1.5 mr-3 rounded-lg gap-2 hover:bg-[#2f2f2f] cursor-pointer">
            <UserButton />
            <div className="flex flex-col items-start">
                <span className="text-[0.80rem]">
                    {userObj?.firstName} {userObj?.lastName}
                </span>
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
