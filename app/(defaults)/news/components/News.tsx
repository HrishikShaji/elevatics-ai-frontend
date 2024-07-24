"use client"

import React, { useState, useEffect } from 'react';
import MainContent from './MainContent';

export default function News() {
    const API_ENDPOINT = "https://pvanand-general-chat.hf.space/news-assistant";
    const NEWS_API_KEY = "44d5c2ac18ced6fc25c1e57dcd06fc0b31fb4ad97bf56e67540671a647465df4";

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatIndex, setCurrentChatIndex] = useState(-1);
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
            const marked = window.marked;
            setRenderedReport(marked.parse(markdown));
        } catch (error) {
            console.error('Error parsing markdown:', error);
            setRenderedReport(`<p>${report}</p>`);
        }
    };

    const addToChatHistory = () => {
        setChatHistory([{ query, report }, ...chatHistory]);
        setCurrentChatIndex(0);
    };

    const loadChatItem = (index) => {
        setCurrentChatIndex(index);
        setQuery(chatHistory[index].query);
        setReport(chatHistory[index].report);
        renderMarkdown(chatHistory[index].report);
    };

    return (
        <div className="app-container flex h-screen">

            <MainContent
                sidebarCollapsed={sidebarCollapsed}
                query={query}
                setQuery={setQuery}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                submitForm={submitForm}
                isLoading={isLoading}
                renderedReport={renderedReport}
            />
        </div>
    );
}
