import { Chat } from "@/types/types";
import { FOLLOWUP_AGENT_API_KEY, FOLLOWUP_AGENT_URL } from "./endpoints";

interface Props {
    query: string;
    conversationId: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchFollowUpResponse({ addMessage, query, conversationId }: Props) {
    const response = await fetch(FOLLOWUP_AGENT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': FOLLOWUP_AGENT_API_KEY
        },
        body: JSON.stringify({
            query: query,
            model_id: 'openai/gpt-4o-mini',
            conversation_id: conversationId,
            user_id: 'string'
        })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            assistantResponse += chunk;

            addMessage({ role: 'assistant', content: assistantResponse, metadata: null, type: "followup" });
        }
    }
}
