
"use client";

import React, { memo } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from "@/styles/markdown.module.css"
import dynamic from 'next/dynamic';

const ClientSideChartRender = dynamic(
    () => import('./ChatChartRender'),
    { ssr: false }
);

interface ChatMarkdownRenderProps {
    text: string;
    disableTyping: boolean;
}


const ChatMarkdownRender = memo(({ disableTyping, text }: ChatMarkdownRenderProps) => {

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                span: ({ node, ...props }) => {
                    if (props.className === "cursor") {
                        return <span {...props} className={styles.cursor}></span>;
                    }
                    return <span {...props}></span>;
                },
                code: code,
                script: script,
                p: ({ node, ...props }) => {
                    if (props.children?.toString().includes('{"response":')) {
                        console.log("from markdown", props.children)
                        return <div>i got the clarification</div>
                    }
                    return <p {...props}></p>
                },
                div: ({ node, ...props }) => {
                    return null;
                }
            }}
        >
            {text}
        </ReactMarkdown>
    );
});

interface ScriptProps {
    src?: string;
    children?: React.ReactNode;
}
const script = memo(
    //@ts-ignore
    ({ src, children }: ScriptProps) => {
        if (src === "https://cdn.plot.ly/plotly-latest.min.js") {
            return null;
        }
        if (children) {
            return <ClientSideChartRender scriptContent={children as string} />
        }
    }
);

const code = memo(({ node, className, children, ...props }: any) => {
    return <SyntaxHighlighter
        useInlineStyles={true}
        customStyle={{ width: "100%", padding: "20px", borderRadius: "24px" }}
        style={materialLight}
        language="tsx"
        PreTag="div"
    >{String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
})

export default ChatMarkdownRender;
