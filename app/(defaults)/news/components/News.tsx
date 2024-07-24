"use client"

import React, { useState, useEffect } from 'react';
import MainContent from './MainContent';
import { marked } from 'marked';

export default function News() {
    const API_ENDPOINT = "https://pvanand-general-chat.hf.space/news-assistant";
    const NEWS_API_KEY = "44d5c2ac18ced6fc25c1e57dcd06fc0b31fb4ad97bf56e67540671a647465df4";

    const [chatHistory, setChatHistory] = useState([]);
    const [query, setQuery] = useState('');
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('meta-llama/llama-3-70b-instruct');
    const [renderedReport, setRenderedReport] = useState('');

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
                    model_id: selectedModel
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

            addToChatHistory();
        } catch (error) {
            console.error('Error:', error);
            setReport('An error occurred while fetching the report.');
        } finally {
            setIsLoading(false);
            renderMarkdown(report);
        }
    };

    const renderMarkdown = (markdown) => {
        try {
            setRenderedReport(marked.parse(markdown));
        } catch (error) {
            console.error('Error parsing markdown:', error);
            setRenderedReport(`<p>${report}</p>`);
        }
    };

    const addToChatHistory = () => {
        setChatHistory([{ query, report }, ...chatHistory]);
    };

    const models = [
        "meta-llama/llama-3-70b-instruct",
        "anthropic/claude-3.5-sonnet",
        "deepseek/deepseek-coder",
        "anthropic/claude-3-haiku",
        "openai/gpt-3.5-turbo-instruct",
        "qwen/qwen-72b-chat",
        "google/gemma-2-27b-it"
    ];

    return (
        <main className={`main-content flex-grow p-5 transition-all duration-300 `}>
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

                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full mb-4 p-2 border border-gray-300 rounded-md bg-gray-50">
                    {models.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </select>


                {renderedReport && (
                    <div id="report-container" className="h-[60vh] overflow-y-scroll bg-white border border-gray-300 rounded-md p-6 mt-6 shadow-md" dangerouslySetInnerHTML={{ __html: renderedReport }}></div>
                )}
            </div>
        </main>

    )
}
