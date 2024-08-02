
"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import styles from "../../../../styles/cursor.module.css"
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import useTypingEffect from '@/hooks/useTypingEffect';


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
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
                span: ({ node, ...props }) => {
                    return <span {...props} className={styles.cursor} ></span>
                },
            }}
        >
            {text}
        </ReactMarkdown>
    );
}
