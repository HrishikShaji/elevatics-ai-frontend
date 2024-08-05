
"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL } from '@/lib/endpoints';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentInputContainer from '@/components/agent/AgentInputContainer';
import AgentIntro from '@/components/agent/AgentIntro';
import AgentSearchBar from '@/components/agent/AgentSearchBar';
import useSuggestions from '@/hooks/useSuggestions';
import { AgentModel, Chat } from '@/types/types';
import AgentChats from '@/components/agent/AgentChats';
import AgentLeftOptions from '@/components/agent/AgentLeftOptions';
import AgentRightOptions from '@/components/agent/AgentRightOptions';
import AgentSelect from '@/components/agent/AgentSelect';
import useSaveReport from '@/hooks/useSaveReport';
import AutoScrollWrapper from '@/app/(defaults)/search/components/AutoScrollWrapper';


const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

interface SavedSearchProps {
    history: string;
    id: string;
}
export default function SavedSearch({ history, id }: SavedSearchProps) {
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [prevHistory, setPrevHistory] = useState<Chat[]>([]);
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false);
    const controllerRef = useRef<AbortController | null>(null)
    const [disableSuggestions, setDisableSuggestions] = useState(true)
    const [selectedAgent, setSelectedAgent] = useState<AgentModel>("meta-llama/llama-3-70b-instruct")
    const [reportId, setReportId] = useState("");
    const [conversationId, setConversationId] = useState("")
    const [disableTyping, setDisableTyping] = useState(true)

    const { reset, handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()


    const { mutate, isSuccess: isReportSaveSuccess, data: savedReport } = useSaveReport();

    useEffect(() => {
        const parsedData = JSON.parse(history)
        setPrevHistory(parsedData.chatHistory);
        setConversationId(parsedData.conversationId);
        setReportId(id)
        setInitialSearch(true)
    }, [history, id]);


    useEffect(() => {
        if (isReportSaveSuccess && savedReport.id) {
            setReportId(savedReport.id);
        }
    }, [isReportSaveSuccess, savedReport]);

    useEffect(() => {
        if (streamComplete) {
            mutate({
                name: prevHistory[0].content,
                report: JSON.stringify({ chatHistory: [...prevHistory, ...chatHistory], conversationId: conversationId }),
                reportId: reportId,
                reportType: "SEARCH"
            });
        }
    }, [streamComplete, reportId, chatHistory, conversationId]);
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
        setDisableTyping(false)
        setDisableSuggestions(true)
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
                    model_id: selectedAgent
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
            <AgentLeftOptions><AgentSelect selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} /></AgentLeftOptions>
            <AgentRightOptions>
                <div>options</div>
                {!streamComplete ?
                    <button onClick={handleCancel}>Cancel</button> : null}
            </AgentRightOptions>

            {initialSearch ? (
                <AutoScrollWrapper>
                    <div className='w-[800px] p-5 flex flex-col gap-2 ' >
                        {prevHistory.map((chat, i) => (<AgentChats disableTyping={true} key={i} chat={chat} />))}
                        {chatHistory.map((chat, i) => (<AgentChats disableTyping={false} key={i} chat={chat} />))}
                    </div>
                </AutoScrollWrapper>
            ) : (
                <AgentIntro suggestions={suggestions} hasClicked={inputClick} handleSuggestionsClick={handleRecommendation} title='Search' subTitle='Faster Efficient Search' />
            )}
            <AgentInputContainer>
                <AgentSearchBar disableSuggestions={disableSuggestions} handleChange={handleChange} data={data} isSuccess={isSuccess} handleSubmit={submitForm} input={input} handleRecommendation={handleRecommendation} handleClick={handleInputClick} />
            </AgentInputContainer>
        </AgentContainer>
    );
}
