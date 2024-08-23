"use client"

import debounce from "lodash.debounce";
import { memo, useCallback, useEffect, useState } from "react"
import { landformTopics } from "../lib/sampleData"
import ReactMarkdown, { Components, ExtraProps } from "react-markdown"
import style from "@/styles/medium.module.css"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import dynamic from "next/dynamic";
import { LATEST_RESEARCHER_REPORT_URL, NEW_RESEARCHER_REPORT_URL } from "@/lib/endpoints";

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
const ClientSideChartRender = dynamic(
    () => import('@/components/chat/ChatChartRender'),
    { ssr: false }
);
function delay(ms) {
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
        addReports({ name: topic.name, parentKey: topic.parentKey, content: markdown })
    }
}

export default function StreamResearcher() {
    const [topics, setTopics] = useState<Topic[]>([])
    const [streamingReport, setStreamingReport] = useState("")
    const [streamingReportParent, setStreamingReportParent] = useState("")
    const [reports, setReports] = useState<Report[]>([])
    const [streaming, setStreaming] = useState(false)
    const [sliderData, setSliderData] = useState<string[]>([])
    const [currentParent, setCurrentParent] = useState("")

    useEffect(() => {
        const modifiedTopics = landformTopics.map(topic => ({ ...topic, isCompleted: false }));
        setTopics(modifiedTopics);
        let sliderKeys: string[] = [];

        modifiedTopics.forEach((topic) => {
            if (!sliderKeys.includes(topic.parentKey)) {
                sliderKeys.push(topic.parentKey)
            }
        })
        setSliderData(sliderKeys)
        setCurrentParent(sliderKeys[0])
    }, [])

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
    }

    return (
        <div className="flex flex-col gap-5 py-10">
            <div className="flex justify-center">
                <button className="px-2 py-1 rounded-md bg-neutral-700 text-white" onClick={generateReports} disabled={streaming}>
                    Generate
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                    <div className="flex w-[1000px] justify-center gap-2 p-1 rounded-md bg-neutral-900 overflow-x-hidden">
                        {sliderData.map((parent, i) => (
                            <button onClick={() => setCurrentParent(parent)} key={i} className="py-1 px-2 min-w-[300px] rounded-md bg-neutral-700 text-white">{parent}</button>
                        ))}
                    </div>
                </div>
                <div className="flex scroll-smooth  flex-col-reverse h-[70vh] overflow-y-auto items-center w-full custom-scrollbar">
                    <div className="flex flex-col gap-10">
                        {reports.map((report, i) => (
                            <div style={{ display: currentParent === report.parentKey ? "block" : "none" }} className="w-[1000px] p-5 rounded-3xl bg-gray-100" key={i}>
                                <div className={style.markdown}>
                                    <MemoizedMarkdown content={report.content} />
                                </div>
                            </div>
                        ))}
                        {streaming ?
                            <div style={{ display: currentParent === streamingReportParent ? "block" : "none" }} className="w-[1000px] p-5 rounded-3xl ">
                                <div className={style.markdown}>
                                    <MemoizedMarkdown content={streamingReport} />
                                </div>
                            </div> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

const components: Components = {
    "status": ({ node, ...props }: ExtraProps) => {
        return null;
    },
    "json": ({ node, ...props }: ExtraProps) => {
        return null;
    },
    "report-metadata": ({ node, ...props }: ExtraProps) => {
        return null;
    },
    "report": ({ node, ...props }: ExtraProps) => {
        return <div className="bg-yellow-500" {...props} />
    },
    "report-chart": ({ node, ...props }: ExtraProps) => {
        return <div className="bg-green-500" {...props} />
    },
    table: ({ node, ...props }) => {
        return <div className="bg-red-500">got table</div>
    },
    script: memo(({ node, src, children }) => {
        if (src === "https://cdn.plot.ly/plotly-latest.min.js") {
            return null;
        }
        return <ClientSideChartRender scriptContent={children as string} />
    }),
    div: ({ node, ...props }) => {
        return null;
    },
} as Components;
const MemoizedMarkdown = memo(({ content }: { content: string }) => (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
    </ReactMarkdown>
));
