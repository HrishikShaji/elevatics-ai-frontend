import { Chat } from "@/types/types";

interface Props {
    query: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchQuickReport({ query, addMessage }: Props) {
    const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
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

            if (chunk.includes('<report-metadata>')) {
                isReadingMetadata = true;
                metadata = '';
            }

            if (isReadingMetadata) {
                metadata += chunk;
                if (chunk.includes('</report-metadata>')) {
                    isReadingMetadata = false;
                }
            } else {
                markdown += chunk;
                addMessage({ role: 'assistant', content: markdown, metadata: metadata, type: "iresearcher-report" });
            }
        }
    }

}
