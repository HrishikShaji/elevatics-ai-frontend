"use client";


//@ts-ignore
import Plot from "react-plotly.js";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from "../../../../styles/cursor.module.css";

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



interface TypedMarkdownProps {
    text: string;
    disableTyping: boolean;
}

export default function TypedMarkdown({ disableTyping, text }: TypedMarkdownProps) {
    const newContent = useTyping(text, 1)
    console.log(disableTyping)
    const markdownWithCursor = `${newContent} <span class="cursor"></span>`;

    const renderContent = disableTyping ? text : markdownWithCursor
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
                        return <div>removed cdn</div>
                    }
                    if (props.children) {
                        const regex = /Plotly\.newPlot\('.*', data, layout\);/;

                        if (regex.test(props.children as string)) {
                            console.log('The line exists in the string.');
                            const modifiedString = (props.children as string).replace(/Plotly\.newPlot\(.*\);/, '')
                            const cleanedScriptContent = modifiedString.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

                            const dataMatch = cleanedScriptContent.match(/var data = ([\s\S]*?);/);
                            const layoutMatch = cleanedScriptContent.match(/var layout = ([\s\S]*?);/);

                            if (dataMatch && layoutMatch) {
                                try {
                                    const data = new Function(`return ${dataMatch[1]}`)();
                                    const layout = new Function(`return ${layoutMatch[1]}`)();
                                    console.log("data:", data)
                                    console.log("layout:", layout)
                                    if (data && layout) {
                                        return <Plot className="rounded-3xl" data={data} layout={{ title: layout.title, width: "100%" }} />
                                    } else {
                                        return null
                                    }

                                } catch (error) {
                                    console.error('Error parsing chart data:', error);
                                    return null;
                                }
                            } else {
                                return null;
                            }
                        } else {
                            console.log('The line does not exist in the string.');
                        }
                    }
                },
                div: ({ node, ...props }) => {
                    return <div>got div</div>
                }
            }}
        >
            {renderContent}
        </ReactMarkdown>
    );
}
