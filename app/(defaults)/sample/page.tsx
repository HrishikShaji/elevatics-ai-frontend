"use client"

import fetchSampleReport from "@/lib/fetchSampleReport"
import { useState } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

interface CustomComponentProps {
    node: any;
    [key: string]: any;
}

const components: Components = {
    "report-metadata": ({ node, ...props }: CustomComponentProps) => {
        console.log("this is metadata", props.children);
        return <div className="w-full bg-blue-500 h-20">got metadata</div>;
    },
} as Components & { "report-metadata": React.FC<CustomComponentProps> };
export default function Page() {
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleGenerate() {
        try {
            setLoading(true)
            const result = await fetchSampleReport()
            setResponse(result)
            console.log(result)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return <div className="h-screen w-full justify-center items-center">
        <button onClick={handleGenerate}>{loading ? "Generating..." : "Generate"}</button>
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={components}
        >
            {response}
        </ReactMarkdown>
    </div>
}
