
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
                    return <li className='flex flex-col gap-[10px] pl-[15px] pb-[10px]' {...props}></li>
                },

                strong: ({ node, ...props }) => {
                    return <strong className='font-semibold' {...props}></strong>
                },
                table: ({ node, ...props }) => {
                    return <table className='border-collapse' {...props}></table>
                },
                td: ({ node, ...props }) => {
                    return <td className='text-left p-[10px] border-collapse' style={{ borderBottom: '10px black' }} {...props}></td>
                },
                th: ({ node, ...props }) => {
                    return <th className='text-left p-[10px] border-collapse' style={{ borderBottom: "10px black" }} {...props}></th>
                },
                tr: ({ node, ...props }) => {
                    return <tr className='border-collapse' style={{ borderBottom: '10px black' }} {...props}></tr>
                },
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
                        return <div>i got the clarification</div>
                    }
                    return <p className='pb-[10px] ' {...props}></p>
                },
                div: ({ node, ...props }) => {
                    return null;
                }
            }}
        >
            {text}
        </ReactMarkdown >
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
