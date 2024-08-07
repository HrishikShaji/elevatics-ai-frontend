"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import RenderChart from '@/components/RenderChart';
import { useTyping } from '@/hooks/useTyping';
import Image from 'next/image';


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
                script: image,
                div: ({ node, ...props }) => {
                    return <div>got div</div>;
                }
            }}
        >
            {text}
        </ReactMarkdown>
    );
};
const image = memo(
    (
        props: any) => {
        return <Image alt="" height={1000} width={1000} className="h-[300px] w-[400px" src={`https://images.unsplash.com/photo-1487088678257-3a541e6e3922?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VidGxlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D`} />
            ;
    }
);
export default TypedMarkdown;
