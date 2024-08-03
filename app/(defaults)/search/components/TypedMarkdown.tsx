"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import { marked } from 'marked';

const useTyping = (text: string, delay = 10) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return currentText
}


const useTypewriter = (text: string, speed = 50) => {
    const [displayedText, setDisplayedText] = useState('');
    const [position, setPosition] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (position >= text.length) return;

        intervalRef.current = setInterval(() => {
            setDisplayedText((prev) => prev + text[position]);
            setPosition((prev) => prev + 1);
        }, speed);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [text, position, speed]);

    return displayedText;
};

interface TypedMarkdownProps {
    text: string;
}

export default function TypedMarkdown({ text }: TypedMarkdownProps) {
    const displayedText = useTypewriter(text, 1);
    const newContent = useTyping(text, 1)

    const markdownWithCursor = `${newContent} <span class="cursor"></span>`;

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
