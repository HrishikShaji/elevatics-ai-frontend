"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { HFSPACE_TOKEN, NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL, TOPICS_URL } from '@/lib/endpoints';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentInputContainer from '@/components/agent/AgentInputContainer';
import AgentIntro from '@/components/agent/AgentIntro';
import AgentSearchBar from '@/components/agent/AgentSearchBar';
import useSuggestions from '@/hooks/useSuggestions';
import { AgentModel, Chat, OriginalData, SingleReport, TransformedData } from '@/types/types';
import AgentLeftOptions from '@/components/agent/AgentLeftOptions';
import AgentRightOptions from '@/components/agent/AgentRightOptions';
import AgentSelect from '@/components/agent/AgentSelect';
import AutoScrollWrapper from '../../search/components/AutoScrollWrapper';
import { useAccount } from '@/contexts/AccountContext';
import TypedMarkdown from '../../search/components/TypedMarkdown';
import { SiInternetcomputer } from 'react-icons/si';
import Image from 'next/image';
import { useResearcher } from '@/contexts/ResearcherContext';
import AdvancedTopics from './AdvancedTopics';

const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

export default function AdvancedSearchAgent() {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false);
    const controllerRef = useRef<AbortController | null>(null)
    const [disableSuggestions, setDisableSuggestions] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState<AgentModel>("meta-llama/llama-3-70b-instruct")
    const { reset, handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()
    const { profile } = useAccount()
    const { selectedSubtasks } = useResearcher()

    const addMessage = ({ role, content, metadata, reports }: Chat) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                updatedChatHistory[updatedChatHistory.length - 1].content = content;
                updatedChatHistory[updatedChatHistory.length - 1].metadata = metadata;
                updatedChatHistory[updatedChatHistory.length - 1].reports = reports;
                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { role, content, metadata, reports }];
            }
        });
    };

    const generateTopics = async (e: FormEvent) => {
        e.preventDefault();
        setDisableSuggestions(true)
        setInitialSearch(true);
        setStreamComplete(false);
        addMessage({ role: "user", content: input, metadata: null, reports: [] })
        reset();

        try {
            const headers = {
                Authorization: HFSPACE_TOKEN,
                "Content-Type": "application/json",
            };
            const response = await fetch(
                TOPICS_URL,
                {
                    method: "POST",
                    cache: "no-store",
                    headers: headers,
                    body: JSON.stringify({
                        user_input: input,
                        num_topics: 5,
                        num_subtopics: 3
                    }),
                },
            );

            if (!response.ok) {
                throw new Error("Error fetching topics");
            }

            const result = await response.json()
            addMessage({ role: "options", content: JSON.stringify(result.topics), metadata: null, reports: [] })
        } catch (error) {
            addMessage({ role: "assistant", content: "Oops.", metadata: null, reports: [] })
        } finally {
            setStreamComplete(true);
        }
    }

    const generateReport = async (inputTopics: string) => {
        addMessage({ role: "user", content: "user clicked continue", metadata: null, reports: [] });
        const topics = transformData(selectedSubtasks);

        for (const topic of topics) {
            try {
                const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain'
                    },
                    body: JSON.stringify({
                        description: topic.prompt,
                        user_id: "test",
                        user_name: "John Doe",
                        internet: true,
                        output_format: "report_table",
                        data_format: "Structured data",
                        generate_charts: true,
                        output_as_md: true
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                if (response.body) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let markdown = '';
                    let metadata = '';
                    let isReadingMetadata = false;

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });

                        if (chunk.includes('<report-metadata>')) {
                            isReadingMetadata = true;
                            metadata = '';
                        }

                        if (isReadingMetadata) {
                            metadata += chunk;
                            if (chunk.includes('</report-metadata>')) {
                                isReadingMetadata = false;
                            }
                        } else {
                            markdown += chunk;
                            addMessage({ role: 'assistant', content: markdown, metadata: null, reports: [{ name: topic.name, parentKey: topic.parentKey, report: markdown }] });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                addMessage({ role: "assistant", content: "Failed to generate report.", metadata: null, reports: [] });
            }
        }
    };

    const transformData = (data: OriginalData): TransformedData[] => {
        const result: TransformedData[] = [];

        for (const parentKey in data) {
            if (data.hasOwnProperty(parentKey)) {
                data[parentKey].forEach(subtask => {
                    result.push({
                        parentKey,
                        name: subtask.name,
                        prompt: subtask.prompt,
                    });
                });
            }
        }

        return result;
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
                        {chatHistory.map((chat, i) => {

                            return chat.role === "user" ? (
                                <div key={i} className='w-full  flex justify-end '>
                                    <div className='  flex items-center pl-2 gap-2 p-1'>
                                        <h1 className='bg-gray-200 py-2 px-4 rounded-3xl '>{chat.content}</h1>
                                        <div className='h-8 w-8 rounded-full bg-blue-500 overflow-hidden'>
                                            {profile?.image ? <Image src={profile.image} alt="profile" height={1000} width={1000} className="h-full w-full object-cover" /> : null}
                                        </div>
                                    </div>
                                </div>
                            ) : chat.role === "options" ?

                                <div key={i} className='w-full justify-start'>
                                    <div className='  flex gap-2 p-1'>
                                        <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                                            <SiInternetcomputer color="white" />
                                        </div>
                                        <div className='flex p-4 rounded-3xl bg-gray-200 flex-col'>
                                            <AdvancedTopics generateReport={generateReport} content={chat.content} />
                                        </div>
                                    </div>
                                </div>
                                : (
                                    <div key={i} className='w-full justify-start'>
                                        <div className='  flex gap-2 p-1'>
                                            <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                                                <SiInternetcomputer color="white" />
                                            </div>
                                            <div className='flex p-4 rounded-3xl bg-gray-200 flex-col'>
                                                <div className='flex flex-col gap-10'>
                                                    {chat.reports?.map((report, j) => (
                                                        <div key={j} className='bg-gray-100'>
                                                            <TypedMarkdown text={report.report} disableTyping={false} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                        })}
                    </div>
                </AutoScrollWrapper>
            ) : (
                <AgentIntro suggestions={suggestions} hasClicked={inputClick} handleSuggestionsClick={handleRecommendation} title='Search' subTitle='Faster Efficient Search' />
            )}
            <AgentInputContainer>
                <AgentSearchBar disableSuggestions={disableSuggestions} handleChange={handleChange} data={data} isSuccess={isSuccess} handleSubmit={generateTopics} input={input} handleRecommendation={handleRecommendation} handleClick={handleInputClick} />
            </AgentInputContainer>
        </AgentContainer>
    );
}
