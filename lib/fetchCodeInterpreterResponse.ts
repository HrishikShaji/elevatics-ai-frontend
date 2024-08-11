

import { CODE_INTERPRETER_URL, DOCUMIND_RESPONSE } from "@/lib/endpoints";
import { Chat } from "@/types/types";

interface Props {
    history: { content: string; role: string }[];
    query: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchCodeInterpreterResponse({ addMessage, history, query }: Props) {
    console.log("history", history)
    const response = await fetch(CODE_INTERPRETER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: history })
    })


    if (!response.ok) {
        throw new Error('API request failed');
    }

    const result = await response.json();
    console.log(result)
    //             addMessage({ role: 'assistant', content: markdown, metadata: metadata });

}
