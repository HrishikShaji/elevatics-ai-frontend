

import { CODE_INTERPRETER_URL, DOCUMIND_RESPONSE } from "@/lib/endpoints";
import { Chat } from "@/types/types";

type InterpreterResponseType = {
    content: string;
    type: "text" | "plotly" | "HTML"
}

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
    console.log("this is the response", result)
    addMessage({ role: 'assistant', content: JSON.stringify(result.response), metadata: null, type: "code-interpreter" });

}
