import { AgentModel, Chat } from "@/types/types";
import { NEWS_ASSISTANT_API_KEY, NEWS_ASSISTANT_URL } from "./endpoints";

interface Props {
    query: string;
    model: AgentModel;
    addMessage: (chat: Chat) => void;
}

export default async function fetchNewsResponse({ query, model, addMessage }: Props) {
    const response = await fetch(NEWS_ASSISTANT_URL, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'X-API-KEY': NEWS_ASSISTANT_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            model_id: model
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let chunks = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            chunks += chunk;
            addMessage({ type: "news", content: chunks, metadata: null, role: "assistant" })
        }

    }

}
