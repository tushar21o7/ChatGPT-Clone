import React from "react";

function Button({
    text,
    color,
    bg,
}: {
    text: string;
    color: string;
    bg: string;
}) {
    return (
        <button
            className={`bg-${color} text-${bg} px-2.5 py-1.5 rounded-full cursor-pointer`}
        >
            {text}
        </button>
    );
}

export default Button;
