import { Chat } from "@/types/types";
import { VPS_RESEARCHER_URL, VPS_RESEARCHER_URL_V2 } from "./endpoints";

interface Props {
    query: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchQuickReport({ query, addMessage }: Props) {
    const response = await fetch(VPS_RESEARCHER_URL_V2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain',
        },
        body: JSON.stringify({
            description: query,
            user_id: "test",
            user_name: "John Doe",
            internet: true,
            output_format: "report_table",
            data_format: "Structured data",
            generate_charts: true,
            output_as_md: true,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

            if (chunk.includes('<json>')) {
                isReadingMetadata = true;
                metadata = '';
            }

            if (isReadingMetadata) {
                metadata += chunk;
                if (chunk.includes('</json>')) {
                    isReadingMetadata = false;
                    addMessage({ role: 'assistant', content: markdown, metadata: metadata, type: "iresearcher-report" });
                }
            } else {
                markdown += chunk;
                addMessage({ role: 'assistant', content: markdown, metadata: metadata, type: "iresearcher-report" });
            }
        }
    }

}
