"use client"

import React, { FormEvent, useRef, useState } from 'react';
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
import { Chat } from '@/types/types';
import AgentChats from '@/components/agent/AgentChats';


const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

export default function SearchAgent() {
    const { agentModel } = useSettings();
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false);
    const controllerRef = useRef<AbortController | null>(null)

    const { reset, handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()

    const addMessage = ({ role, content }: { role: "user" | "assistant", content: string }) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                updatedChatHistory[updatedChatHistory.length - 1].content = content;
                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { role, content }];
            }
        });
    };
    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setInitialSearch(true);
        setStreamComplete(false);
        addMessage({ role: "user", content: input })
        reset();

        const controller = new AbortController();
        controllerRef.current = controller;

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
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantResponse = '';
                let lastUpdateTime = Date.now();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    assistantResponse += chunk;

                    if (Date.now() - lastUpdateTime > 100 || done) {
                        addMessage({ role: 'assistant', content: assistantResponse });
                        lastUpdateTime = Date.now();
                    }
                }
            }
        } catch (error) {
            addMessage({ role: "assistant", content: "Oops." })
        } finally {
            setStreamComplete(true);
        }
    };

    const handleCancel = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
    };

    return (
        <AgentContainer>
            <AgentOptionsContainer>
                <div>options</div>
                <div>options</div>
                {!streamComplete ?
                    <button onClick={handleCancel}>Cancel</button> : null}
            </AgentOptionsContainer>

            {initialSearch ? (
                <AutoScrollWrapper>
                    <div className='w-[800px] p-5 flex flex-col gap-2 ' >
                        {chatHistory.map((chat, i) => (<AgentChats key={i} chat={chat} />))}
                    </div>
                </AutoScrollWrapper>
            ) : (
                <AgentIntro suggestions={suggestions} hasClicked={inputClick} handleSuggestionsClick={handleRecommendation} title='Search' subTitle='Faster Efficient Search' />
            )}
            <AgentInputContainer>
                <AgentSearchBar handleChange={handleChange} data={data} isSuccess={isSuccess} handleSubmit={submitForm} input={input} handleRecommendation={handleRecommendation} handleClick={handleInputClick} />
            </AgentInputContainer>
        </AgentContainer>
    );
}
