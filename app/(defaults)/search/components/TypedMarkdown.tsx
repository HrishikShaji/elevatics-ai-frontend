"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import RenderChart from '@/components/RenderChart';

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

    return currentText;
}

interface TypedMarkdownProps {
    text: string;
    disableTyping: boolean;
}


export default function TypedMarkdown({ disableTyping, text }: TypedMarkdownProps) {
    const newContent = useTyping(text, 1);
    const markdownWithCursor = `${newContent} <span class="cursor"></span>`;
    const renderContent = disableTyping ? text : markdownWithCursor;

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
                        const regex = /Plotly\.newPlot\('.*', data, layout\);/;
                        if (regex.test(props.children as string)) {
                            const scriptContent = (props.children as string).replace(/Plotly\.newPlot\(.*\);/, '');
                            return <RenderChart scriptContent={scriptContent} />;
                        }
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
}
