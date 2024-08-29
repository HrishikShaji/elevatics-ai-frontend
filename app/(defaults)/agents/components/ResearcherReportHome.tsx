"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import ReactMarkdown, { Components, ExtraProps } from "react-markdown"
import style from "@/styles/medium.module.css"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { useResearcher } from "@/contexts/ResearcherContext"
import dynamic from "next/dynamic"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { RefObject } from "@fullcalendar/core/preact"
import newStyle from "@/styles/new-medium.module.css"
import SourcesSection from "@/components/SourcesSection"


const ClientSideChartRender = dynamic(
    () => import('@/components/chat/ChatChartRender'),
    { ssr: false }
);

export default function ResearcherReportHome() {
    const [sliderData, setSliderData] = useState<string[]>([])

    const { generateReports, topics, reports, streamingReportParent, streaming, streamingReport } = useResearcher()

    const [currentParentKey, setCurrentParentKey] = useState("")
    const containerRef = useRef<HTMLDivElement>(null);


    function scrollLeft(ref: RefObject<HTMLDivElement>) {
        if (ref.current) {
            ref.current.scrollBy({
                left: -300,
                behavior: "smooth",
            });
        }
    }

    function scrollRight(ref: RefObject<HTMLDivElement>) {
        if (ref.current) {
            ref.current.scrollBy({
                left: 300,
                behavior: "smooth",
            });
        }
    }
    useEffect(() => {
        let sliderKeys: string[] = [];

        topics.forEach((topic) => {
            if (!sliderKeys.includes(topic.parentKey)) {
                sliderKeys.push(topic.parentKey)
            }
        })
        setSliderData(sliderKeys)
        setCurrentParentKey(sliderKeys[0])
    }, [])

    useEffect(() => {
        generateReports()
    }, [])
    console.log(reports)

    return (
        <div className="flex gap-2 relative justify-center pt-10">
            <div className=" flex absolute top-10 left-6 justify-center">
                <div className=' justify-center flex-col flex gap-2 w-[180px] ' ref={containerRef}>
                    {sliderData.map((item, k) => (<button className={`${item === currentParentKey ? "bg-blue-500 text-white" : "bg-gray-100 text-black"} p-1  px-3 truncate rounded-md  w-full `} onClick={() => setCurrentParentKey(item)}>{item}</button>))}
                </div>
            </div>
            <div className="flex scroll-smooth  flex-col-reverse h-[85vh] overflow-y-auto items-center w-full custom-scrollbar">
                <div className="flex flex-col gap-10">
                    {reports.map((report, i) => (
                        <div style={{ display: currentParentKey === report.parentKey ? "block" : "none" }} className="w-[1000px] p-5 rounded-3xl bg-gray-100" key={i}>
                            <MemoizedMarkdown chartData={report.chartData} content={report.content} />
                            <SourcesSection metadata={report.metadata} />
                        </div>
                    ))}
                    {streaming ?
                        <div style={{ display: currentParentKey === streamingReportParent ? "block" : "none" }} className="w-[1000px] p-5 rounded-3xl bg-gray-100">
                            <MemoizedMarkdown chartData="" content={streamingReport} />
                        </div> : null}
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
        <div className={newStyle.markdown}>
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
                        return <div className="" {...props} />;
                    },
                    "report-chart": ({ node, ...props }: ExtraProps) => {
                        return <div className="" {...props} />;
                    },
                    table: memo(({ node, ...props }) => {
                        const currentTableIndex = tableIndex.current;
                        tableIndex.current += 1;
                        return (
                            <div className="flex flex-col gap-2">
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
