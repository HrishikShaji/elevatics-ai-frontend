

"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import Slider from "@/components/Slider"
import style from "@/styles/markdown.module.css"

interface SavedInvestorReportHomeProps {
    name: string;
    report: string;
}

export default function SavedInvestorReportHome({ name, report }: SavedInvestorReportHomeProps) {
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
        <div className=" h-[(100vh_-_40px)]  w-full   ">
            <div className="w-full flex py-2 justify-center">
                <div className="w-[800px]">
                    <Slider setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} items={sliderData} />
                </div>
            </div>
            <div className="w-full flex justify-center custom-scrollbar overflow-y-auto max-h-[80vh]">
                <div className="flex flex-col w-[800px]   ">
                    <div className="px-2 py-10 rounded-3xl bg-gray-100">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className={style.markdown} key={currentIndex}>
                            {sliderData[currentIndex][1] as string}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
}
