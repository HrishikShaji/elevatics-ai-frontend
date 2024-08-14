import { Chat } from "@/types/types";

interface Props {
    query: string;
    conversationId: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchFollowUpResponse({ addMessage, query, conversationId }: Props) {
    const response = await fetch('https://pvanand-general-chat.hf.space/followup-agent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '44d5c2ac18ced6fc25c1e57dcd06fc0b31fb4ad97bf56e67540671a647465df4'
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
        let lastUpdateTime = Date.now();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            assistantResponse += chunk;

            if (Date.now() - lastUpdateTime > 100 || done) {
                addMessage({ role: 'assistant', content: assistantResponse, metadata: null, type: 'followup' });
                lastUpdateTime = Date.now();
            }
        }
    }
}
