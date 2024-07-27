
"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import Slider from "@/components/Slider"
import style from "../../../../../styles/markdown.module.css"

interface SavedInvestorReportProps {
    name: string;
    report: string;
}

export default function SavedInvestorReport({ name, report }: SavedInvestorReportProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const parsedData = JSON.parse(report)
    const sliderData = Object.entries(parsedData.other_info_results)

    function getQueryData({ questions, answers }: { questions: string[], answers: string[] }) {
        const dataLength = questions.length
        const queryData: string[] = []
        Array.from({ length: dataLength }).forEach((_, i) => {
            queryData.push(questions[i])
            queryData.push(answers[i])
        })

        return queryData
    }


    const items = getQueryData({ questions: parsedData.queries, answers: parsedData.query_results })
    const joinedQueries = items.join(" ")
    const firstArray: [string, string] = ["Queries", joinedQueries]
    sliderData.unshift(firstArray)

    return (
        <div className="h-full w-full pt-[10px] flex-col  flex justify-center items-end">
            <Slider setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} items={sliderData} />
            <div className="flex flex-col w-[calc(100vw_-_500px)] py-5  gap-5">
                <div className="px-2 py-10 rounded-3xl bg-gray-100">
                    <div className=" px-5 h-full ">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className={style.markdown} key={currentIndex}>
                            {sliderData[currentIndex][1] as string}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
}
