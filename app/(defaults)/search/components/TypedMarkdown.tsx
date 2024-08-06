"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";
import RenderChart from "@/components/RenderChart";

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

const ChartContainer = ({ scriptContent }: { scriptContent: string }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [chartLayout, setChartLayout] = useState<any>(null);

    useEffect(() => {
        console.log(scriptContent)
        function extractObject(variableName: string, str: string) {
            const regex = new RegExp(`var ${variableName} = (.*?);`, 's');
            const match = regex.exec(str);
            if (match && match[1]) {
                const jsonString = match[1]
                    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
                    .replace(/'/g, '"')
                    .replace(/,\s*}/g, '}')
                    .replace(/,\s*]/g, ']');
                return JSON.parse(jsonString);
            }
            return null;
        }

        const parsedData = extractObject('data', scriptContent);
        const parsedLayout = extractObject('layout', scriptContent);
        console.log("parsed", parsedData, parsedLayout)
        setChartLayout(parsedLayout)
        setChartData(parsedData)

    }, []);

    if (!chartData || !chartLayout) return null;

    return <RenderChart data={chartData} layout={chartLayout} />;
};

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
                            return <ChartContainer scriptContent={scriptContent} />;
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
