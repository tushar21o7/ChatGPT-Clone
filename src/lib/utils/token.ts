import { GoogleGenAI } from "@google/genai";

export async function countTokens(type: string, content: string) {
    const ai = new GoogleGenAI({
        vertexai: true,
        project: "chatgpt_project",
        location: "us-central1",
    });

    const response = await ai.models.countTokens({
        model: "gemini-2.5-flash",
        contents: "What is the highest mountain in Africa?",
    });

    console.log(type, content);

    return response.totalTokens ?? 0;
}
