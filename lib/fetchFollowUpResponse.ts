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
        let responseContent = '';
        let metadata = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            assistantResponse += chunk;

            // Extract content inside the <response> tag in real-time
            const responseMatch = assistantResponse.match(/<response>(.*?)<\/response>/);
            if (responseMatch) {
                responseContent = responseMatch[1];
            }

            // Extract the JSON object
            const jsonMatch = assistantResponse.match(/{.*}/);
            if (jsonMatch) {
                metadata = JSON.parse(jsonMatch[0]);
            }

            // If responseContent is updated, render it in real-time
            addMessage({
                role: 'assistant',
                content: responseContent,
                metadata: metadata ? metadata : null,
                type: "followup"
            });
        }
    }
}
