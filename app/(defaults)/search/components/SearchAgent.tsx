
"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PiRocketLaunchThin } from 'react-icons/pi';
import { useSettings } from '@/contexts/SettingsContext';
import { NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL } from '@/lib/endpoints';

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [initialSearch, setInitialSearch] = useState(false)

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [renderedReport]);


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
        <div style={{ gap: initialSearch ? "0px" : "20px", paddingTop: initialSearch ? "0px" : "200px" }} className="h-[(100vh_-_40px)] items-center w-full flex flex-col">
            {initialSearch ? (

                <div ref={scrollContainerRef} id="chat-container" style={{ scrollbarGutter: "stable" }} className="custom-scrollbar  flex w-full justify-center  max-h-[80vh] overflow-y-auto  ">
                    <div className='max-w-[800px] h-full flex flex-col gap-4 py-10'>
                        {renderedReport && (
                            <div className='w-[800px] bg-gray-200 rounded-3xl p-10 h-full'>
                                <ReactMarkdown
                                    children={renderedReport}
                                />
                            </div>
                        )}

                    </div>
                </div>
            ) : (
                <>

                    <h1 className="text-3xl font-semibold">
                        Search
                    </h1>
                    <h1 className="text-[#8282AD] text-center">
                        Faster Effiecient Search.
                    </h1>
                </>
            )}
            <div className="w-[800px]  bg-white flex-grow-0  rounded-3xl dark:bg-neutral-700 overflow-hidden border-gray-200 border-2 shadow-lg focus:outline-gray-300  flex flex-col mt-4">
                <form onSubmit={submitForm} className=" relative  flex items-center justify-center  ">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What's on your mind..."
                        className="   pr-28  bg-white focus:outline-none p-4 w-full"
                    />{" "}

                    <button
                        type='submit'
                        className="text-gray-400 hover:bg-gray-300 hover:scale-125 duration-500 absolute glow p-2 group cursor-pointer rounded-full bg-gray-100  right-2 "
                    >
                        <PiRocketLaunchThin size={20} className="text-gray-500 group-hover:text-white duration-500" />
                    </button>
                </form>
            </div>
        </div>
    );
}
