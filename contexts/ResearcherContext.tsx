
"use client"

import useSaveReport from "@/hooks/useSaveReport";
import { NEW_RESEARCHER_REPORT_URL } from "@/lib/endpoints";
import fetchResearcherReports from "@/lib/fetchResearcherReports";
import { Chat, ChatType, ReportProps, ResearcherTopicsResponse, SelectedSubtasks } from "@/types/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from "react";


type ResearcherProviderProps = {
    children: ReactNode;
};
interface ResearcherData {
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
    selectedSubtasks: SelectedSubtasks;
    setSelectedSubtasks: Dispatch<SetStateAction<SelectedSubtasks>>;
    topics: Topic[];
    setTopics: Dispatch<SetStateAction<Topic[]>>;
    generateReports: () => void;
    reports: Report[];
    streaming: boolean;
    streamingReportParent: string;
    streamingReport: string;
}

type Topic = {
    name: string;
    parentKey: string;
    prompt: string;
}

type Report = {
    name: string;
    parentKey: string;
    content: string;
    chartData: string;
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function fetchReport({ topic, addReport, addReports }: { topic: Topic, addReport: (report: string) => void, addReports: (report: Report) => void }) {
    const response = await fetch(NEW_RESEARCHER_REPORT_URL, {
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
        let chartData = '';
        let isReadingMetadata = false;
        let isReadingChartData = false;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            if (chunk.includes('<json>')) {
                isReadingMetadata = true;
                metadata = '';
            } else if (chunk.includes("<report-chart>")) {
                isReadingChartData = true;
                chartData = "";
            }

            if (isReadingMetadata) {
                metadata += chunk;
                if (chunk.includes('</json>')) {
                    isReadingMetadata = false;
                }
            } else if (isReadingChartData) {
                chartData += chunk;
                if (chunk.includes("</report-chart>")) {
                    isReadingChartData = false;
                }
            } else {
                for (let i = 0; i < chunk.length; i += 10) {
                    const batch = chunk.slice(i, i + 10);
                    markdown += batch;
                    addReport(markdown);
                    await delay(1);
                }
            }
        }
        addReports({ name: topic.name, parentKey: topic.parentKey, content: markdown, chartData: chartData })
    }
}
const ResearcherContext = createContext<ResearcherData | undefined>(undefined);
export const useResearcher = () => {
    const context = useContext(ResearcherContext);
    if (!context) {
        throw new Error("useResearcher must be used within a ResearcherProvider");
    }
    return context;
};
export const ResearchProvider = ({ children }: ResearcherProviderProps) => {
    const [prompt, setPrompt] = useState("");
    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedSubtasks, setSelectedSubtasks] = useState<SelectedSubtasks>({});
    const [streamComplete, setStreamComplete] = useState(false)
    const [streamingReport, setStreamingReport] = useState("")
    const [streamingReportParent, setStreamingReportParent] = useState("")
    const [reports, setReports] = useState<Report[]>([])
    const [streaming, setStreaming] = useState(false)
    const { mutate } = useSaveReport()

    useEffect(() => {
        if (streamComplete) {
            console.log("ran saving")
            mutate({
                name: prompt,
                report: JSON.stringify({ chatHistory: JSON.stringify(reports), conversationId: "" }),
                reportId: "",
                reportType: "FULL"
            });
        }
    }, [streamComplete]);


    function addReport(report: string) {
        setStreamingReport(prev => {
            if (prev !== report) {
                return report;
            }
            return prev;
        });
    }


    function addReports(report: Report) {
        setReports(prev => [...prev, report]);
    }

    async function generateReports() {
        for (const topic of topics) {

            try {
                setStreaming(true)
                setStreamingReport("")
                setStreamingReportParent(topic.parentKey)
                await fetchReport({ topic: topic, addReport: addReport, addReports });
            } catch (error) {
                console.log(error)
            } finally {
                setStreaming(false)
            }
        }
        setStreamComplete(true)
    }


    const researcherData = {
        prompt,
        setPrompt,
        topics,
        setTopics,
        selectedSubtasks,
        setSelectedSubtasks,
        generateReports,
        reports,
        streamingReportParent,
        streaming,
        streamingReport
    };

    return (
        <ResearcherContext.Provider value={researcherData}>
            {children}
        </ResearcherContext.Provider>
    );
};
