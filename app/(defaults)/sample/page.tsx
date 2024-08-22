"use client"

import fetchSampleReport from "@/lib/fetchSampleReport"
import { useState } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import style from "@/styles/medium.module.css"

interface CustomComponentProps {
    node: any;
    [key: string]: any;
}
const extractText = (node: any): string => {
    if (!node) return "";

    // If the node is text, return its value.
    if (node.type === "text") {
        return node.value;
    }

    // If the node has children, recursively extract text from all children.
    if (Array.isArray(node.children)) {
        return node.children.map(extractText).join("");
    }

    // If it's a node with a single child (e.g., an element wrapping text), process it.
    if (node.children && node.children.length === 1) {
        return extractText(node.children[0]);
    }

    // Otherwise, return an empty string (or handle other node types if needed).
    return "";
};
const components: Components = {
    "json": ({ node, ...props }: CustomComponentProps) => {
        console.log(node.children)
        const value = extractText(node)
        const match = value.match(/\[\[\[(.*?)\]\]\]/);

        if (match) {
            const contentInsideBrackets = match[1];
            console.log(contentInsideBrackets);
        } else {
            console.log('No match found');
        }
        console.log("this is text", value)
        return <div className="bg-gray-400" {...props} />
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
    const [report, setReport] = useState("")

    function addMessage(value: string) {
        setReport(value)
    }

    async function handleGenerate() {
        try {
            setLoading(true)
            const result = await fetchSampleReport({ addMessage })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return <div className="h-screen p-20  w-full justify-center items-center">
        <button onClick={handleGenerate}>{loading ? "Generating..." : "Generate"}</button>
        <div className="flex flex-col gap-5">

            <ReactMarkdown
                className={style.markdown}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {report}
            </ReactMarkdown>
        </div>
    </div>
}
