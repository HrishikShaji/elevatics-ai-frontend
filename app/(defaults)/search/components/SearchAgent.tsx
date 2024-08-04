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

type Chat = {
    content: string;
    role: "assistant" | "user";
}

const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

export default function SearchAgent() {
    const { agentModel } = useSettings();
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [renderedReport, setRenderedReport] = useState('');
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false)

    const { reset, handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()


    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setInitialSearch(true);
        setIsLoading(true);
        setReport('');
        setQuery(input);
        reset();
        setStreamComplete(false)
        setChatHistory(prev => [...prev, { role: "user", content: input }])

        try {
            console.log("query:", query, "input:", input)
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
                    setIsLoading(false);
                }

                setChatHistory(prev => [...prev, { role: "assistant", content: chunks }])
            }
        } catch (error) {
            setRenderedReport('An error occurred while fetching the report.');
        } finally {
            setStreamComplete(true);
        }
    };


    return (
        <AgentContainer>
            <AgentOptionsContainer><div>options</div><h1>{isLoading ? "loading..." : "done"}</h1> <div>options</div></AgentOptionsContainer>

            {initialSearch ? (
                <AutoScrollWrapper>

                    {!isLoading ?
                        <div className='w-[800px] p-5 flex flex-col gap-2 bg-gray-200' >
                            {chatHistory.map((chat, i) => (
                                <TypedMarkdown text={chat.content} key={i} />
                            )
                            )}
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
