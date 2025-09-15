import { UIMessage } from "ai";

export async function trimMessages(
    messages: UIMessage[],
    model: string
): Promise<UIMessage[]> {
    console.log(model);
    return messages;
}
