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
        <div className="flex flex-col gap-5 py-10">
            <div className="flex flex-col gap-2">
                <div className="w-full flex justify-center">
                    <div className="flex py-1 pb-3 justify-between w-[1000px] overflow-hiiden">
                        <button
                            onClick={() => scrollLeft(containerRef)}
                            className=" size-10 flex  items-center justify-center  hover:text-black  hover:bg-gray-300 rounded-full"
                        >
                            <IoIosArrowBack size={25} />
                        </button>
                        <div className='w-[800px] justify-center  flex gap-4 overflow-hidden' ref={containerRef}>
                            {sliderData.map((item, k) => (<button className='p-1 text-nowrap px-3 rounded-md bg-gray-100 min-w-[300px] text-black' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
                        </div>
                        <button
                            onClick={() => scrollRight(containerRef)}
                            className=" size-10 flex items-center justify-center  hover:text-black  hover:bg-gray-300 rounded-full"
                        >
                            <IoIosArrowForward size={25} />
                        </button>
                    </div>
                </div>
                <div className="flex scroll-smooth  flex-col-reverse h-[70vh] overflow-y-auto items-center w-full custom-scrollbar">
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
