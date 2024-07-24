"use client"

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useSettings } from '@/contexts/SettingsContext';
import useSaveReport from '@/hooks/useSaveReport';

const API_ENDPOINT = "https://pvanand-general-chat.hf.space/news-assistant";
const NEWS_API_KEY = "44d5c2ac18ced6fc25c1e57dcd06fc0b31fb4ad97bf56e67540671a647465df4";

export default function News() {
    const { agentModel } = useSettings()
    const [chatHistory, setChatHistory] = useState([]);
    const [query, setQuery] = useState('');
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [renderedReport, setRenderedReport] = useState('');
    const [streamComplete, setStreamComplete] = useState(false)
    const { mutate } = useSaveReport()

    useEffect(() => {
        if (streamComplete) {
            mutate({ name: query, report: JSON.stringify(report), reportId: "", reportType: 'NEWS' })
        }
    }, [streamComplete, report])

    const submitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setReport('');
        setRenderedReport('');

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'X-API-KEY': NEWS_API_KEY,
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

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let chunks = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                chunks += chunk;
                setReport((prev) => prev + chunk);
                renderMarkdown(chunks);
            }

            addToChatHistory(chunks);
        } catch (error) {
            console.error('Error:', error);
            setReport('An error occurred while fetching the report.');
            renderMarkdown('An error occurred while fetching the report.');
        } finally {
            setIsLoading(false);
            setStreamComplete(true)
        }
    };

    const renderMarkdown = (markdown) => {
        try {
            setRenderedReport(marked.parse(markdown));
        } catch (error) {
            console.error('Error parsing markdown:', error);
            setRenderedReport(`<p>${markdown}</p>`);
        }
    };

    const addToChatHistory = (finalReport) => {
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
                    <div id="report-container" className="h-[60vh] overflow-y-scroll bg-white border border-gray-300 rounded-md p-6 mt-6 shadow-md" dangerouslySetInnerHTML={{ __html: renderedReport }}></div>
                )}
            </div>
        </main>
    );
}
