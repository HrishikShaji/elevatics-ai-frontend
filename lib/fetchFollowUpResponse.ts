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
        let markdown = '';
        let metadata = '';
        let buffer = '';
        let isReadingResponse = false;
        let isReadingInteract = false;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            while (true) {
                if (isReadingInteract) {
                    const interactEndIndex = buffer.indexOf('</interact>');
                    if (interactEndIndex !== -1) {
                        metadata += buffer.slice(0, interactEndIndex);
                        buffer = buffer.slice(interactEndIndex + 11);
                        isReadingInteract = false;
                    } else {
                        metadata += buffer;
                        buffer = '';
                        break;
                    }
                } else if (isReadingResponse) {
                    const responseEndIndex = buffer.indexOf('</response>');
                    if (responseEndIndex !== -1) {
                        markdown += buffer.slice(0, responseEndIndex);
                        buffer = buffer.slice(responseEndIndex + 11);
                        isReadingResponse = false;
                    } else {
                        markdown += buffer;
                        buffer = '';
                        break;
                    }
                } else {
                    const responseStartIndex = buffer.indexOf('<response>');
                    const interactStartIndex = buffer.indexOf('<interact>');

                    if (responseStartIndex !== -1 && (interactStartIndex === -1 || responseStartIndex < interactStartIndex)) {
                        markdown += buffer.slice(0, responseStartIndex);
                        buffer = buffer.slice(responseStartIndex + 10);
                        isReadingResponse = true;
                    } else if (interactStartIndex !== -1 && (responseStartIndex === -1 || interactStartIndex < responseStartIndex)) {
                        metadata += buffer.slice(0, interactStartIndex);
                        buffer = buffer.slice(interactStartIndex + 10);
                        isReadingInteract = true;
                    } else {
                        markdown += buffer;
                        buffer = '';
                        break;
                    }
                }
            }

            // Update the message with the latest content
            addMessage({ role: 'assistant', content: markdown.trim(), metadata: metadata.trim(), type: "followup" });
        }
    }
}
