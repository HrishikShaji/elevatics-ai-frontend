import { AgentModel, Chat } from "@/types/types";
import { CODING_ASSISTANT_API_KEY, CODING_ASSISTANT_URL } from "./endpoints";

interface Props {
    query: string;
    model: AgentModel;
    conversationId: string;
    userId: string;
    addMessage: (chat: Chat) => void;
}

export default async function({ addMessage, query, model, conversationId, userId }: Props) {
    const response = await fetch(CODING_ASSISTANT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': CODING_ASSISTANT_API_KEY || "",
        },
        body: JSON.stringify({
            user_query: query,
            model_id: model,
            conversation_id: conversationId,
            user_id: userId,
        }),
    });

    if (!response.ok) {
        throw new Error('API request failed');
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
                addMessage({ role: 'assistant', content: assistantResponse, metadata: null, type: "coder" });
                lastUpdateTime = Date.now();
            }
        }
    }

}
