"use client"

import SourcesSection from "@/components/SourcesSection"
import fetchSampleReport from "@/lib/fetchSampleReport"
import { useState } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { sampleReport } from "./sampleReport"
import { renderToStaticMarkup } from "react-dom/server"
import { metadata } from "@/app/layout"

interface CustomComponentProps {
    node: any;
    [key: string]: any;
}
const extractText = (node: any): string => {
    if (node.type === "text") {
        return node.value;
    }
    if (node.children && node.children.length > 0) {
        return node.children.map((child: any) => extractText(child)).join("");
    }
    return "";
};
const components: Components = {
    "report-metadata": ({ node, ...props }: CustomComponentProps) => {
        const allTexts = extractText(node)
        const metadataMatch = allTexts.match(/all-text-with-urls: (.+)/);
        if (metadataMatch) {
            console.log(metadataMatch)
        }
        return <div />;
    },
    "report": ({ node, ...props }: CustomComponentProps) => {
        return <div className="w-full bg-blue-500 " {...props} />;
    },
    "status": ({ node, ...props }: CustomComponentProps) => {
        return <div className="w-full bg-green-500 " {...props} />;
    },
} as Components;
export default function Page() {
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState<string>(false)

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
