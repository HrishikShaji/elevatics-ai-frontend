
import { Chat } from "@/types/types";
import { LATEST_RESEARCHER_REPORT_URL, NEW_RESEARCHER_REPORT_URL } from "./endpoints";

interface Props {
    addMessage: (value: string) => void
}

export default async function fetchSampleReport({ addMessage }: Props) {
    const response = await fetch(NEW_RESEARCHER_REPORT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain',
        },
        body: JSON.stringify({
            description: "singularity",
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

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            markdown += chunk;
            console.log(markdown)
            addMessage(markdown);
        }
    }



}
