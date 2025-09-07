import ChatModel from "@/models/ChatModel";
import { NextResponse } from "next/server";
import { UIMessage, streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import mongoose from "mongoose";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        // return NextResponse.json({
        //     chat: [
        //         {
        //             parts: [
        //                 {
        //                     type: "text",
        //                     text: "Hi, explain about LLMs in a paragraph",
        //                 },
        //             ],
        //             id: "ejGZlbaIzLdepi3h",
        //             role: "user",
        //         },
        //         {
        //             id: "EZwiySV5MjLdFLC6",
        //             role: "assistant",
        //             parts: [
        //                 {
        //                     type: "step-start",
        //                 },
        //                 {
        //                     type: "text",
        //                     text: "Large Language Models (LLMs) are a type of artificial intelligence, specifically deep learning models, trained on vast amounts of text data from the internet, books, and other sources. Their core function is to predict the next most probable word or sequence of words in a given context, based on the patterns, grammar, and knowledge they've learned during training. This capability allows them to understand prompts, generate human-like text, answer questions, summarize information, translate languages, write creative content, and even produce code, making them versatile tools for diverse natural language processing tasks.",
        //                     state: "done",
        //                 },
        //             ],
        //         },
        //         {
        //             parts: [
        //                 {
        //                     type: "text",
        //                     text: "write c++ code to find if a number is even or not",
        //                 },
        //             ],
        //             id: "6TLAHcDNnIE7DKXg",
        //             role: "user",
        //         },
        //         {
        //             id: "cRxMHihQ1GyAE4sm",
        //             role: "assistant",
        //             parts: [
        //                 {
        //                     type: "step-start",
        //                 },
        //                 {
        //                     type: "text",
        //                     text: 'Sure, here\'s a C++ code snippet that determines if a number entered by the user is even or odd.\n\n```cpp\n#include <iostream> // Required for input/output operations (std::cout, std::cin)\n\nint main() {\n    int number; // Declare an integer variable to store the user\'s input\n\n    // Prompt the user to enter a number\n    std::cout << "Enter an integer: ";\n\n    // Read the integer input from the user and store it in \'number\'\n    std::cin >> number;\n\n    // The modulo operator (%) gives the remainder of a division.\n    // If a number divided by 2 has a remainder of 0, it\'s even.\n    // Otherwise (if the remainder is 1 or -1 for negative odd numbers), it\'s odd.\n    if (number % 2 == 0) {\n        std::cout << number << " is an even number." << std::endl;\n    } else {\n        std::cout << number << " is an odd number." << std::endl;\n    }\n\n    return 0; // Indicate successful program execution\n}\n```\n\n**How it works:**\n\n1.  **`#include <iostream>`**: This line includes the `iostream` library, which provides functionalities for input (`std::cin`) and output (`std::cout`).\n2.  **`int main() { ... }`**: This is the main function where program execution begins.\n3.  **`int number;`**: Declares an integer variable named `number` to store the value the user will enter.\n4.  **`std::cout << "Enter an integer: ";`**: Displays a message on the console, asking the user to input a number.\n5.  **`std::cin >> number;`**: Reads the integer value typed by the user from the console and stores it in the `number` variable.\n6.  **`if (number % 2 == 0) { ... } else { ... }`**: This is the core logic:\n    *   **`number % 2`**: This uses the modulo operator (`%`). It calculates the remainder when `number` is divided by `2`.\n    *   **`== 0`**: It checks if the remainder is exactly `0`.\n    *   If the remainder is `0`, it means the number is perfectly divisible by 2, so it\'s **even**.\n    *   If the remainder is not `0` (it will be `1` or `-1` for odd numbers), it means the number is **odd**.\n7.  **`std::cout << ... << std::endl;`**: Prints the appropriate message to the console, indicating whether the entered number is even or odd. `std::endl` adds a newline character and flushes the output buffer.\n8.  **`return 0;`**: Indicates that the program executed successfully.',
        //                     state: "done",
        //                 },
        //             ],
        //         },
        //     ],
        // });

        const chat = await ChatModel.findById(id);
        return NextResponse.json({ messages: chat?.messages });
    } catch (error) {
        console.error("Error: ", error);
        return new Response("Error while getting chat", {
            status: 500,
        });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        const result = streamText({
            model: google("models/gemini-2.5-flash"),
            messages: convertToModelMessages(messages),
        });

        const updatedChat = await ChatModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { $push: { messages: messages[0] } },
            { new: true }
        );

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Something streaming chat completion", error);
        return new Response("Failed to stream chat completion", {
            status: 500,
        });
    }
}
