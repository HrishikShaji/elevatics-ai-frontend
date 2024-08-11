import { DOCUMIND_RESPONSE } from "@/lib/endpoints";
import { Chat } from "@/types/types";

interface Props {
    conversationId: string;
    query: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchDocumentResponse({ addMessage, conversationId, query }: Props) {
    const response = await fetch(DOCUMIND_RESPONSE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ConversationID: conversationId, Query: query })
    })


    if (!response.ok) {
        throw new Error('API request failed');
    }

    if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let markdown = '';
        let metadata = '';
        let isReadingMetadata = false;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            if (chunk.includes('<REFRENCES>')) {
                isReadingMetadata = true;
                metadata = '';
            }

            if (isReadingMetadata) {
                console.log("reading metadata")
                metadata += chunk;
                addMessage({ role: 'assistant', content: markdown, metadata: metadata });
                if (chunk.includes('</REFRENCES>')) {
                    isReadingMetadata = false;
                }
            } else {
                markdown += chunk;
                console.log(markdown)
                addMessage({ role: 'assistant', content: markdown, metadata: metadata });
            }
        }
    }

}
