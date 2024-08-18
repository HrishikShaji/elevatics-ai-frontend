
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
    h1: ({ node, ...props }) => {
        return <h1 className='text-[30px] leading-[40px] font-[500] pt-0 pr-0 pb-[20px] pl-0' {...props} ></ h1>
    },
    h2: ({ node, ...props }) => {
        return <h2 className='text-[25px] leading-[35px] pt-[15px] pr-0 pb-[5px] pl-0' {...props}></h2>
    },
    h3: ({ node, ...props }) => {

        return <h3 className='text-[20px] leading-[30px] font-[500] pt-[15px] pr-0 pb-[15px] pl-0' {...props}></h3>
    },
    h4: ({ node, ...props }) => {
        return <h4 className='text-[15px] leading-[25px] py-[10px] px-0' {...props}></h4>
    },
    h5: ({ node, ...props }) => {
        return <h5 className='text-[10px] leading-[20px] py-[10px] px-0' {...props}></h5>
    },
    h6: ({ node, ...props }) => {
        return <h6 className='text-[5px] leading-[15px] py-[10px] px-0' {...props}></h6>
    },
    ul: ({ node, ...props }) => {
        return <ul className='' {...props}></ul>
    },
    li: ({ node, ...props }) => {
        return <li className='' {...props}></li>
    },
    strong: ({ node, ...props }) => {
        return <strong className='font-semibold' {...props}></strong>
    },
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
        return <p className='pb-[10px] ' {...props}></p>
    },
    div: ({ node, ...props }) => {
        return null;
    },
    "refrences": ({ node, children, ...props }: ExtraProps) => {
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
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
        >
            {text}
        </ReactMarkdown >
    );
});

export default ChatMarkdownRender;
