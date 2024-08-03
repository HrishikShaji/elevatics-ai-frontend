"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import { marked } from 'marked';

const useTypewriter = (text: string, speed = 50) => {
    const [displayedText, setDisplayedText] = useState('');
    const [position, setPosition] = useState(0);

    useEffect(() => {
        if (position >= text.length) return;

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text[position]);
            setPosition((prev) => prev + 1);
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, position, speed]);

    return displayedText;
};

interface TypedMarkdownProps {
    text: string;
}

export default function TypedMarkdown({ text }: TypedMarkdownProps) {
    const displayedText = useTypewriter(text, 10);

    const markdownWithCursor = `${displayedText} <span class="cursor"></span>`;

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                span: ({ node, ...props }) => {
                    console.log(node, props)
                    if (props.className === "cursor") {
                        return <span {...props} className={styles.cursor}></span>;
                    }
                    return <span {...props}></span>;
                },
            }}
        >
            {markdownWithCursor}
        </ReactMarkdown>
    );
}
