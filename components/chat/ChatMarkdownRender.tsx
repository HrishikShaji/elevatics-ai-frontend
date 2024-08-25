
"use client";

import React, { memo } from 'react';
import ReactMarkdown, { Components, ExtraProps } from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from "@/styles/markdown.module.css"
import dynamic from 'next/dynamic';
import { extractSystemStyles } from '@mantine/core';
import DocumentReferences from './DocumentSources';
import style from "@/styles/medium.module.css"
import newStyle from "@/styles/new-medium.module.css"


const ClientSideChartRender = dynamic(
    () => import('./ChatChartRender'),
    { ssr: false }
);

const extractText = (node: any): string => {
    if (node.type === "text") {
        return node.value;
    }
    if (node.children && node.children.length > 0) {
        return node.children.map((child: any) => extractText(child)).join("");
    }
    return "";
};

interface ChatMarkdownRenderProps {
    text: string;
    disableTyping: boolean;
}
const components: Components = {
    code: memo(({ node, className, children, ...props }) => {
        return <SyntaxHighlighter
            useInlineStyles={true}
            customStyle={{ padding: "3px 10px 3px 10px", borderRadius: '10px', width: "fit" }}
            style={materialLight}
            language="tsx"
            PreTag="fragment"
        >{String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
    }),
    script: memo(({ node, src, children }) => {
        if (src === "https://cdn.plot.ly/plotly-latest.min.js") {
            return null;
        }
        return <ClientSideChartRender scriptContent={children as string} />
    }),
    table: ({ node, ...props }) => {
        return <table className='border-collapse bg-none border-b-[1px] border-gray-300 pb-[10px] mb-[20px]' {...props}></table>
    },
    thead: ({ node, ...props }) => {
        return <thead className='bg-none' {...props}></thead>
    },
    td: ({ node, ...props }) => {
        return <td className='text-left p-[10px] border-b-[1px] border-gray-300' {...props}></td>
    },
    th: ({ node, ...props }) => {
        return <th className='text-left bg-gray-200 p-[10px] border-b-[1px] border-gray-300'  {...props}></th>
    },
    tr: ({ node, ...props }) => {
        return <tr className="bg-none"  {...props}></tr>
    },
    span: ({ node, ...props }) => {
        if (props.className === "cursor") {
            return <span {...props} className={styles.cursor}></span>;
        }
        return <span {...props}></span>;
    },
    pre: ({ node, ...props }) => {
        return <pre className='p-2 mb-4 rounded-xl bg-white' {...props} />
    },
    p: ({ node, ...props }) => {
        if (props.children?.toString().includes('{"response":')) {
            return <div>i got the clarification</div>
        }
        return <p {...props}></p>
    },
    div: ({ node, ...props }) => {
        return null;
    },
    "refrences": ({ node, ...props }: ExtraProps) => {
        console.log("these are children", node?.children)
        if (node?.children) {
            const metadata = extractText(node.children)
            return <DocumentReferences metadata={metadata} />
        }
        return null
    },
    "report-metadata": ({ node, ...props }: ExtraProps) => {
        console.log(node?.children)
        return null;
    },
    "report": ({ node, ...props }: ExtraProps) => {
        return null;
    },
    "status": ({ node, ...props }: ExtraProps) => {
        return null;
    },
} as Components;

const ChatMarkdownRender = memo(({ disableTyping, text }: ChatMarkdownRenderProps) => {

    return (
        <div
            className={newStyle.markdown}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
            >
                {text}
            </ReactMarkdown >
        </div>
    );
});

export default ChatMarkdownRender;
