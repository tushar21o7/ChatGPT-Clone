/* eslint-disable @typescript-eslint/no-explicit-any */

import { countTokens } from "./token";

export async function trimMessages(messages: any) {
    const maxTokens = 900000;
    let totalTokens = 0;
    const trimmedMessages = [];

    for (let i = messages.length - 1; i >= 0; i--) {
        let currentTokens = 0;
        const { parts } = messages[i];
        for (let j = 0; j < parts.length; j++) {
            if (parts[i].type === "text") {
                currentTokens += await countTokens("text", parts[i]?.text);
            } else if (parts[i].type === "file") {
                currentTokens += await countTokens("file", parts[i]?.url);
            }
        }

        if (totalTokens + currentTokens <= maxTokens) {
            trimmedMessages.unshift(messages[i]);
            totalTokens += currentTokens;
        }
    }

    return trimmedMessages;
}
