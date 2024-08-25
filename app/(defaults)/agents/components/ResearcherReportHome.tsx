"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import ReactMarkdown, { Components, ExtraProps } from "react-markdown"
import style from "@/styles/medium.module.css"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { useResearcher } from "@/contexts/ResearcherContext"
import dynamic from "next/dynamic"

const ClientSideChartRender = dynamic(
    () => import('@/components/chat/ChatChartRender'),
    { ssr: false }
);

export default function ResearcherReportHome() {
    const [sliderData, setSliderData] = useState<string[]>([])
    const [currentParent, setCurrentParent] = useState("")
    const { topics, reports, streamingReportParent, streaming, streamingReport } = useResearcher()

    useEffect(() => {
        let sliderKeys: string[] = [];

        topics.forEach((topic) => {
            if (!sliderKeys.includes(topic.parentKey)) {
                sliderKeys.push(topic.parentKey)
            }
        })
        setSliderData(sliderKeys)
        setCurrentParent(sliderKeys[0])
    }, [])

    return (
        <div className="flex flex-col gap-5 py-10">
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
                                <MemoizedMarkdown chartData={report.chartData} content={report.content} />
                            </div>
                        ))}
                        {streaming ?
                            <div style={{ display: currentParent === streamingReportParent ? "block" : "none" }} className="w-[1000px] p-5 rounded-3xl ">
                                <MemoizedMarkdown chartData="" content={streamingReport} />
                            </div> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}



const MemoizedMarkdown = memo(({ content, chartData }: { content: string, chartData: string }) => {
    const tableIndex = useRef(0)
    useEffect(() => {

    }, [])
    return (
        <div className={style.markdown}>
            <ReactMarkdown
                components={{
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
                        return <div className="bg-yellow-500" {...props} />;
                    },
                    "report-chart": ({ node, ...props }: ExtraProps) => {
                        return <div className="bg-green-500" {...props} />;
                    },
                    table: memo(({ node, ...props }) => {
                        const currentTableIndex = tableIndex.current;
                        tableIndex.current += 1;
                        return (
                            <div className="flex flex-col gap-2">
                                <h1 className="bg-red-500 text-white w-full text-center text-2xl">{currentTableIndex}</h1>
                                <table id="999" {...props} />
                            </div>
                        );
                    }),
                    script: memo(({ node, src, children }) => {
                        if (src === "https://cdn.plot.ly/plotly-latest.min.js") {
                            return null;
                        }
                        return (
                            <div className="flex flex-col gap-2">
                                <button
                                    className="bg-black text-white px-2 py-1 rounded-md"
                                    onClick={() => console.log(chartData)}
                                >
                                    Show Chart
                                </button>
                                <ClientSideChartRender scriptContent={children as string} />
                            </div>
                        );
                    }),
                    div: ({ node, ...props }) => {
                        return null;
                    },
                } as Components}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});
