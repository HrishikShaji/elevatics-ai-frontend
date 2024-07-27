"use client"

import { useState, useEffect } from "react"
import { AiOutlineDownload } from "react-icons/ai"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { useInvestor } from "@/contexts/InvestorContext"
import Slider from "@/components/Slider"
import style from "../../../../../styles/markdown.module.css"
import useFetchInvestorData from "@/hooks/useFetchInvestorData"
import useSaveReport from "@/hooks/useSaveReport"
import DownloadInvestorPdfButton from "./DownloadInvestorPdfButton"

export default function InvestorReport() {
    const { fileName, file } = useInvestor()
    const [currentIndex, setCurrentIndex] = useState(0)

    const { mutate, data, isPending, isSuccess } = useFetchInvestorData()
    const { mutate: saveReport } = useSaveReport()
    useEffect(() => {
        if (fileName) {
            const formData = new FormData();
            formData.append("file", file as Blob);
            formData.append("Funding", String(0.5));

            mutate(formData);
        }
    }, [fileName, mutate]);

    useEffect(() => {
        if (isSuccess) {
            saveReport({ reportId: '', name: fileName, report: JSON.stringify(data), reportType: "INVESTOR" })
        }
    }, [isSuccess])

    if (isPending) return <div>Loading...</div>;

    if (!isSuccess || !data) return null;

    const sliderData = Object.entries(data.other_info_results)

    function getQueryData({ questions, answers }: { questions: string[], answers: string[] }) {
        const dataLength = questions.length
        const queryData: string[] = []
        Array.from({ length: dataLength }).forEach((_, i) => {
            queryData.push(questions[i])
            queryData.push(answers[i])
        })

        return queryData
    }


    const items = getQueryData({ questions: data.queries, answers: data.query_results })
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
                <div className="w-full flex justify-end">
                    <DownloadInvestorPdfButton data={data} name={fileName} />
                </div>
            </div>
        </div>
    )
}
