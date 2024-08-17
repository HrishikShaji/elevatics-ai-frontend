"use client"

import SourcesSection from "@/components/SourcesSection"
import fetchSampleReport from "@/lib/fetchSampleReport"
import { useState } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

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
    code: ({ node, children, ...props }) => {
        const codeContent = String(children).trim()
        const stringified = JSON.stringify(codeContent)
        const metadataMatch = stringified.match(/all-text-with-urls: (.+)/);
        if (metadataMatch) {
            try {

                console.log(metadataMatch[1])
                JSON.parse(metadataMatch[1])
            } catch (error) {
                console.log(error)
            }
        }
        return <code className="bg-gray-400">{codeContent}</code>
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
