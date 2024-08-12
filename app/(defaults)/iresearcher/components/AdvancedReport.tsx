"use client"
import SourcesModal from "@/components/SourcesModal";
import ChatMarkdownRender from "@/components/chat/ChatMarkdownRender";
import { useResearcher } from "@/contexts/ResearcherContext";
import { Chat, OriginalData, ReportProps, TransformedData } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

type Report = {
    content: string;
    metadate: string;
    parentKey: string;
    name: string;
}

export default function AdvancedReport() {
    const [reports, setReports] = useState<Report[]>([]);
    const { selectedSubtasks } = useResearcher();

    useEffect(() => {
        async function fetchData() {
            const input = JSON.stringify(selectedSubtasks);
            const parsedSelectedSubtasks = JSON.parse(input);

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

            const topics = transformData(parsedSelectedSubtasks);

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
                            setReports((prevReports) => {
                                const updatedReports = [...prevReports];
                                let lastReport = updatedReports.find(report => report.name === topic.name);

                                if (!lastReport) {
                                    lastReport = { content: markdown, metadate: metadata, parentKey: topic.parentKey, name: topic.name };
                                    updatedReports.push(lastReport);
                                } else {
                                    lastReport.content = markdown;
                                    lastReport.metadate = metadata;
                                    lastReport.parentKey = topic.parentKey;
                                }

                                return updatedReports;
                            });
                        }
                    }
                }
            }
        }

        fetchData();
    }, [selectedSubtasks]);

    console.log(reports);

    return (
        <>
            {reports.length > 0 ? (
                <>
                    <div className="flex flex-col gap-10 max-h-[70vh] overflow-y-scroll custom-scrollbar">
                        {reports.map((report, j) => (
                            <div key={j}>
                                <ChatMarkdownRender text={report.content} disableTyping={false} />
                                <SourcesModal metadata={report.metadate} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-end pt-2"></div>
                </>
            ) : (
                "loading"
            )}
        </>
    );
}
