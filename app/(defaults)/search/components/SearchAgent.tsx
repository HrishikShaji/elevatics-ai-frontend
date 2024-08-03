"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PiRocketLaunchThin } from 'react-icons/pi';
import { useSettings } from '@/contexts/SettingsContext';
import { NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL } from '@/lib/endpoints';
import TypedMarkdown from './TypedMarkdown';
import AutoScrollWrapper from './AutoScrollWrapper';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentOptionsContainer from '@/components/agent/AgentOptionsContainer';
import AgentInputContainer from '@/components/agent/AgentInputContainer';


const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]
type NewsItem = {
    query: string;
    report: string;
}

export default function SearchAgent() {
    const { agentModel } = useSettings();
    const [chatHistory, setChatHistory] = useState<NewsItem[]>([]);
    const [query, setQuery] = useState('');
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [renderedReport, setRenderedReport] = useState('');
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false)
    const [inputClick, setInputClick] = useState(false)

    function handleInputClick() {
        setInputClick(true)
    }

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setInitialSearch(true);
        setIsLoading(true);
        setReport('');
        setRenderedReport('');
        setStreamComplete(false)

        try {
            const response = await fetch(SEARCH_ASSISTANT_URL, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'X-API-KEY': NEWS_ASSISTANT_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    model_id: agentModel
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let chunks = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    chunks += chunk;
                    setReport((prev) => prev + chunk);
                    setRenderedReport(chunks);
                }

                addToChatHistory(chunks);
            }
        } catch (error) {
            console.error('Error:', error);
            setReport('An error occurred while fetching the report.');
            setRenderedReport('An error occurred while fetching the report.');
        } finally {
            setIsLoading(false);
            setStreamComplete(true);
        }
    };

    const addToChatHistory = (finalReport: string) => {
        setChatHistory([{ query, report: finalReport }, ...chatHistory]);
    };

    return (
        <AgentContainer>
            <AgentOptionsContainer><div>options</div> <div>options</div></AgentOptionsContainer>

            {initialSearch ? (
                <AutoScrollWrapper>
                    {renderedReport ?
                        <div className='w-[800px] p-5  rounded-3xl bg-gray-200' >
                            <TypedMarkdown text={renderedReport} />
                        </div>
                        : null}
                </AutoScrollWrapper>
            ) : (
                <div className='flex flex-col w-full pt-[200px]  items-center justify-center gap-5'>
                    <h1 className="text-3xl font-semibold">
                        Search
                    </h1>
                    <h1 className="text-[#8282AD] text-center">
                        Faster Efficient Search.
                    </h1>
                    {!inputClick
                        ?
                        < div className="flex  gap-4 w-[800px] pb-[120px]">
                            {suggestions.map((item, i) => (
                                <div key={i} className='cursor-pointer h-[150px] transition duration-300 hover:-translate-y-3 w-full hover:bg-gray-200 hover:text-black rounded-3xl shadow-gray-300 p-5 text-gray-500 pt-10 shadow-3xl'>{item}</div>
                            ))}
                        </div>
                        : null}
                </div>
            )
            }
            <AgentInputContainer>

                <div className="w-[800px]  bg-white   rounded-3xl dark:bg-neutral-700 overflow-hidden border-gray-200 border-2 shadow-lg focus:outline-gray-300  flex flex-col ">
                    <form onSubmit={submitForm} className="relative flex items-center justify-center">
                        <input
                            onClick={handleInputClick}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What's on your mind..."
                            className="pr-28 bg-white focus:outline-none p-4 w-full"
                        />{" "}
                        <button
                            type='submit'
                            className="text-gray-400 hover:bg-gray-300 hover:scale-125 duration-500 absolute glow p-2 group cursor-pointer rounded-full bg-gray-100 right-2"
                        >
                            <PiRocketLaunchThin size={20} className="text-gray-500 group-hover:text-white duration-500" />
                        </button>
                    </form>
                </div>
            </AgentInputContainer>
        </AgentContainer >
    );
}
