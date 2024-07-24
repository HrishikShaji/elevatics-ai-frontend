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

export default function InvestorReport() {
    const { fileName, file } = useInvestor()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(false)

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
            saveReport({ name: fileName, report: JSON.stringify(data), reportType: "INVESTOR" })
        }
    }, [isSuccess])

    if (isPending) return <div>Loading...</div>;

    if (!isSuccess || !data) return null;

    const sliderData = Object.entries(data.other_info_results)
    const values = Object.values(data.other_info_results)

    function getQueryData({ questions, answers }: { questions: string[], answers: string[] }) {
        const dataLength = questions.length
        const queryData: string[] = []
        Array.from({ length: dataLength }).forEach((_, i) => {
            queryData.push(questions[i])
            queryData.push(answers[i])
        })

        return queryData
    }

    async function downloadPdf() {
        try {
            setLoading(true)
            const response = await fetch("https://nithin1905-pdf.hf.space/generate_pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                const name = fileName.replace(".pdf", "")
                a.href = url;

                a.download = `${name}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                const result = await response.json()
                console.log(result)
                console.error("Failed to generate PDF");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const items = getQueryData({ questions: data.queries, answers: data.query_results })
    const joinedQueries = items.join(" ")
    const firstArray: [string, string] = ["Queries", joinedQueries]
    sliderData.unshift(firstArray)

    return (
        <div className="h-full w-full pt-[100px]  flex justify-center items-end">
            <div className="flex flex-col w-[calc(100vw_-_500px)] py-5  gap-5">
                <Slider setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} items={sliderData} />
                <div className="px-2 py-10 rounded-3xl bg-gray-100">
                    <div className=" px-5 h-full ">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className={style.markdown} key={currentIndex}>
                            {sliderData[currentIndex][1]}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <button
                        className="text-sm sm:bg-[#f9f8fb] flex text-gray-500 hover:bg-gray-100 gap-2 rounded-md sm:p-2 items-center justify-center sm:w-[120px]"
                        onClick={downloadPdf}>
                        <AiOutlineDownload size={25} /><span className="hidden sm:block">Download</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
