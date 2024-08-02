"use client";

import { useSettings } from '@/contexts/SettingsContext';
import { NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL } from '@/lib/endpoints';
import { AgentModel } from '@/types/types';
import React, { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import ReactMarkdown from "react-markdown";
import styles from "../../../../styles/cursor.module.css"
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import AutoScrollWrapper from './AutoScrollWrapper';
import useResizeObserver from '@/hooks/useResizeObserver';

const fetchStreamData = async ({ setStreamData, query, agentModel }: { setStreamData: Dispatch<SetStateAction<string>>; query: string; agentModel: AgentModel }) => {
    const response = await fetch(SEARCH_ASSISTANT_URL, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'X-API-KEY': NEWS_ASSISTANT_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            model_id: agentModel,
        }),
    });
    if (response.body) {

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let streamData = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            streamData += chunk;
            setStreamData(streamData);
        }
    }
};

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

export default function SampleStream() {
    const [streamData, setStreamData] = useState('');
    const displayedText = useTypewriter(streamData, 1);
    const [query, setQuery] = useState('Technological singularity');
    const { agentModel } = useSettings();

    useEffect(() => {
        fetchStreamData({ setStreamData, query, agentModel });
    }, [query, agentModel]);
    const onResize = useCallback((target: HTMLDivElement) => {
        console.log(target.clientHeight)
    }, []);

    const ref = useResizeObserver(onResize);

    const markdownContent = `${displayedText}<span></span>`;
    return (
        <AutoScrollWrapper>
            <div ref={ref} className='w-[800px] bg-gray-100 rounded-3xl p-5'>
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                    components={{
                        span: ({ node, ...props }) => {
                            return <span {...props} className={styles.cursor} ></span>
                        },
                    }}
                >
                    {markdownContent}
                </ReactMarkdown>
            </div>
        </AutoScrollWrapper>
    );
}
