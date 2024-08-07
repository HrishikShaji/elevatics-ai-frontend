"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import RenderChart from '@/components/RenderChart';
import { useTyping } from '@/hooks/useTyping';


interface TypedMarkdownProps {
    text: string;
    disableTyping: boolean;
}


const TypedMarkdown = ({ disableTyping, text }: TypedMarkdownProps) => {

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
                script: ({ node, ...props }) => {
                    if (props.src === "https://cdn.plot.ly/plotly-latest.min.js") {
                        return <div>removed cdn</div>;
                    }
                    if (props.children) {
                        return <RenderChart scriptContent={props.children as string} />
                    }
                },
                div: ({ node, ...props }) => {
                    return <div>got div</div>;
                }
            }}
        >
            {text}
        </ReactMarkdown>
    );
};

export default TypedMarkdown;
