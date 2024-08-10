"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import RenderChart from '@/components/RenderChart';
import { useTyping } from '@/hooks/useTyping';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, dracula, oneLight, duotoneLight, gruvboxLight, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface TypedMarkdownProps {
    text: string;
    disableTyping: boolean;
}


const TypedMarkdown = memo(({ disableTyping, text }: TypedMarkdownProps) => {

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
            return <RenderChart scriptContent={children as string} />
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

export default TypedMarkdown;
