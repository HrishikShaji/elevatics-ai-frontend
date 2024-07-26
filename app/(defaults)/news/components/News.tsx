"use client"

import React, { FormEvent, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '@/contexts/SettingsContext';
import useSaveReport from '@/hooks/useSaveReport';

type NewsItem = {
    query: string;
    report: string;
}

export default function News() {
    const { agentModel } = useSettings();
    const [chatHistory, setChatHistory] = useState<NewsItem[]>([]);
    const [query, setQuery] = useState('');
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [renderedReport, setRenderedReport] = useState('');
    const [streamComplete, setStreamComplete] = useState(false);
    const { mutate } = useSaveReport();

    useEffect(() => {
        if (streamComplete) {
            mutate({ name: query, report: JSON.stringify(report), reportId: "", reportType: 'NEWS' });
            console.log("ran")
        }

    }, [streamComplete, report]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setReport('');
        setRenderedReport('');
        setStreamComplete(false)

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_NEWS_API_ENDPOINT || "", {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'X-API-KEY': process.env.NEXT_PUBLIC_NEWS_API_KEY || "",
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
        <main className="main-content flex-grow p-5 transition-all duration-300">
            <div className="content-wrapper max-w-4xl mx-auto">
                <h1 className="text-center text-gray-700 mb-4">Where knowledge begins</h1>

                <form onSubmit={submitForm} className="flex mb-8">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Ask anything..."
                        required
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-l-md shadow-md"
                    />
                    <button type="submit" disabled={isLoading} className="p-3 bg-blue-600 text-white rounded-r-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Loading...' : 'Search'}
                    </button>
                </form>

                {renderedReport && (
                    <div id="report-container" className="h-[60vh] overflow-y-scroll bg-white border border-gray-300 rounded-md p-6 mt-6 shadow-md">
                        <ReactMarkdown
                            children={renderedReport}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
