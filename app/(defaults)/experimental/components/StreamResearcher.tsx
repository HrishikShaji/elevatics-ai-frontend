"use client"

import { useEffect, useState } from "react"
import { landformTopics } from "../lib/sampleData"
import ReactMarkdown, { Components, ExtraProps } from "react-markdown"
import style from "@/styles/medium.module.css"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

type Topic = {
    isCompleted: boolean;
    name: string;
    parentKey: string;
    prompt: string;
}

type Report = {
    name: string;
    parentKey: string;
    content: string;
}

async function fetchReport({ topic, addReport, addReports }: { topic: Topic, addReport: (report: string) => void, addReports: (report: Report) => void }) {
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

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            markdown += chunk;
            addReport(markdown);
        }

        addReports({ name: topic.name, parentKey: topic.parentKey, content: markdown })
    }
}

const components: Components = {
    "json": ({ node, ...props }: ExtraProps) => {
        return null;
    },
    "report-metadata": ({ node, ...props }: ExtraProps) => {
        return null;
    },
} as Components;
export default function StreamResearcher() {
    const [topics, setTopics] = useState<Topic[]>([])
    const [streamingReport, setStreamingReport] = useState("")
    const [reports, setReports] = useState<Report[]>([])
    const [streaming, setStreaming] = useState(false)
    console.log("these are reports", reports)
    useEffect(() => {
        const modifiedTopics = landformTopics.map(topic => ({ ...topic, isCompleted: false }));
        setTopics(modifiedTopics);
    }, [])

    function addReport(report: string) {
        setStreamingReport(prev => prev + report);
    }

    function addReports(report: Report) {
        setReports(prev => [...prev, report]);
    }

    async function generateReports() {
        await fetchReport({ topic: topics[0], addReport, addReports });
    }

    return (
        <div className="flex flex-col gap-10 p-10">
            <button className="p-2 bg-black text-white" onClick={generateReports} disabled={streaming}>
                Generate
            </button>
            <div className="flex flex-col gap-5 h-[70vh] overflow-y-scroll">
                {reports.map((report, i) => (
                    <div className="w-[1000px] p-5 rounded-3xl bg-gray-100" key={i}>
                        <div className={style.markdown}>
                            <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {report.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div className="w-[1000px] p-5 rounded-3xl bg-gray-100">
                    <div className={style.markdown}>
                        <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {streamingReport}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
