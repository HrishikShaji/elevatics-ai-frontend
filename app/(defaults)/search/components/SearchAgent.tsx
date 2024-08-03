"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL } from '@/lib/endpoints';
import TypedMarkdown from './TypedMarkdown';
import AutoScrollWrapper from './AutoScrollWrapper';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentOptionsContainer from '@/components/agent/AgentOptionsContainer';
import AgentInputContainer from '@/components/agent/AgentInputContainer';
import AgentIntro from '@/components/agent/AgentIntro';
import AgentSearchBar from '@/components/agent/AgentSearchBar';
import useSuggestions from '@/hooks/useSuggestions';


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

    const { handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()


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
                    query: input,
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
                <AgentIntro suggestions={suggestions} hasClicked={inputClick} handleSuggestionsClick={handleRecommendation} title='Search' subTitle='Faster Efficient Search' />
            )
            }
            <AgentInputContainer>
                <AgentSearchBar handleChange={handleChange} data={data} isSuccess={isSuccess} handleSubmit={submitForm} input={input} handleRecommendation={handleRecommendation} handleClick={handleInputClick} />
            </AgentInputContainer>
        </AgentContainer >
    );
}
