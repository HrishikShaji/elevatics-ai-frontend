"use client";

import { useSettings } from '@/contexts/SettingsContext';
import { NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL } from '@/lib/endpoints';
import { AgentModel } from '@/types/types';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import AutoScrollWrapper from './AutoScrollWrapper';
import TypedMarkdown from './TypedMarkdown';
import ReactMarkdown from "react-markdown"


const fetchData = async ({ query, agentModel }: { query: string; agentModel: AgentModel }) => {
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

    if (!response.ok) {
        throw Error("error")
    }

    const data = await response.text();
    return data;
};

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
            setStreamData(prev => `${prev}${chunk}`);
        }
    }
};

export default function SampleStream() {
    const [streamData, setStreamData] = useState('');
    const [query, setQuery] = useState('Technological singularity');
    const { agentModel } = useSettings();
    const [click, setClick] = useState(false);
    const [data, setData] = useState("");

    useEffect(() => {
        fetchData({ query, agentModel }).then((data) => setData(data));
    }, [query, agentModel]);

    useEffect(() => {
        fetchStreamData({ setStreamData, query, agentModel });
    }, [query, agentModel]);

    return (
        <>
            <TypedMarkdown text={streamData} />
            <button onClick={() => setClick(true)}>click</button>
            {click ? <ReactMarkdown>{data}</ReactMarkdown> : null}
        </>
    );
}
