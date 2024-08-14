

import { CODE_INTERPRETER_URL, DOCUMIND_RESPONSE } from "@/lib/endpoints";
import { Chat } from "@/types/types";


interface Props {
    conversationId: string;
    query: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchCodeInterpreterResponse({ addMessage, conversationId, query }: Props) {
    const response = await fetch(CODE_INTERPRETER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ConversationID: conversationId, Query: query })
    })


    if (!response.ok) {
        throw new Error('API request failed');
    }

    const result = await response.json();
    addMessage({ role: 'assistant', content: JSON.stringify(result.response), metadata: null, type: "code-interpreter" });

}
