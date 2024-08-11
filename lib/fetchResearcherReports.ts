import { OriginalData, ReportProps, TransformedData } from "@/types/types";

interface Props {
    query: string;
    addReports: (props: ReportProps) => void;
}

export default async function fetchResearcherReports({ query, addReports }: Props) {
    const selectedSubtasks = JSON.parse(query)

    const transformData = (data: OriginalData): TransformedData[] => {
        const result: TransformedData[] = [];

        for (const parentKey in data) {
            if (data.hasOwnProperty(parentKey)) {
                data[parentKey].forEach((subtask) => {
                    result.push({
                        parentKey,
                        name: subtask.name,
                        prompt: subtask.prompt,
                    });
                });
            }
        }

        return result;
    };

    const topics = transformData(selectedSubtasks);
    const sliderKeys = Object.keys(selectedSubtasks);

    for (const topic of topics) {
        const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
            },
            body: JSON.stringify({
                description: topic.prompt,
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
                    addReports({ type: "iresearcher-reports", role: 'assistant', content: markdown, metadata: metadata, name: topic.name, parentKey: topic.parentKey, report: markdown, sliderKeys: sliderKeys });
                }
            }
        }
    }
}
