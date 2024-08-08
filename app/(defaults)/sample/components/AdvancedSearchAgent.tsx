

"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { HFSPACE_TOKEN, NEWS_ASSISTANT_API_KEY, SEARCH_ASSISTANT_URL, TOPICS_URL } from '@/lib/endpoints';
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
import AutoScrollWrapper from '../../search/components/AutoScrollWrapper';
import { useAccount } from '@/contexts/AccountContext';
import TypedMarkdown from '../../search/components/TypedMarkdown';
import { SiInternetcomputer } from 'react-icons/si';
import Image from 'next/image';
import useFetchTopics from '@/hooks/useFetchTopics';
import IconPlusCircle from '@/components/icon/icon-plus-circle';
import IconMinusCircle from '@/components/icon/icon-minus-circle';
import AnimateHeight from 'react-animate-height';
import Topic from '../../iresearcher/topics/components/Topic';
import { useResearcher } from '@/contexts/ResearcherContext';
import Advanced from '../../datatables/advanced/page';
import AdvancedTopics from './AdvancedTopics';


const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

export default function AdvancedSearchAgent() {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [isTopicSearch, setIsTopicSearch] = useState(true)
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false);
    const controllerRef = useRef<AbortController | null>(null)
    const [disableSuggestions, setDisableSuggestions] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState<AgentModel>("meta-llama/llama-3-70b-instruct")
    const [reportId, setReportId] = useState("");
    const [conversationId, setConversationId] = useState("")
    const { data: topicsData, isLoading } = useFetchTopics();
    const { reset, handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()
    const { profile } = useAccount()

    const { mutate, isSuccess: isReportSaveSuccess, data: savedReport } = useSaveReport();
    console.log(topicsData)
    useEffect(() => {
        const conversationId = Date.now().toString();
        setConversationId(conversationId);
    }, []);


    useEffect(() => {
        if (isReportSaveSuccess && savedReport.id) {
            setReportId(savedReport.id);
        }
    }, [isReportSaveSuccess, savedReport]);

    useEffect(() => {
        if (streamComplete) {
            mutate({
                name: chatHistory[0].content,
                report: JSON.stringify({ chatHistory: chatHistory, conversationId: conversationId }),
                reportId: reportId,
                reportType: "SEARCH"
            });
        }
    }, [streamComplete]);
    const addMessage = ({ role, content, metadata }: Chat) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                updatedChatHistory[updatedChatHistory.length - 1].content = content;
                updatedChatHistory[updatedChatHistory.length - 1].metadata = metadata
                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { role, content, metadata }];
            }
        });
    };

    const generateTopics = async (e: FormEvent) => {

        e.preventDefault();
        setDisableSuggestions(true)
        setInitialSearch(true);
        setStreamComplete(false);
        addMessage({ role: "user", content: input, metadata: null })
        reset();
        console.log(isTopicSearch)

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
            addMessage({ role: "options", content: JSON.stringify(result.topics), metadata: null })
        } catch (error) {
            addMessage({ role: "assistant", content: "Oops.", metadata: null })
        } finally {
            setStreamComplete(true);
        }
    }

    const generateReport = async (inputTopics: string) => {
        console.log(inputTopics)
        addMessage({ role: "user", content: "user clicked continue", metadata: null })
        setIsTopicSearch(false)
        try {
            const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({
                    description: inputTopics,
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
                        addMessage({ role: "assistant", content: markdown, metadata: metadata })
                    }
                }
            }
        } catch (error) {
            addMessage({ role: "assistant", content: "Oops.", metadata: null })
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
                        {chatHistory.map((chat, i) => {

                            return chat.role === "user" ? (
                                <div className='w-full  flex justify-end '>
                                    <div className='  flex items-center pl-2 gap-2 p-1'>
                                        <h1 className='bg-gray-200 py-2 px-4 rounded-3xl '>{chat.content}</h1>
                                        <div className='h-8 w-8 rounded-full bg-blue-500 overflow-hidden'>
                                            {profile?.image ? <Image src={profile.image} alt="profile" height={1000} width={1000} className="h-full w-full object-cover" /> : null}
                                        </div>
                                    </div>
                                </div>
                            ) : chat.role === "options" ?

                                <div className='w-full justify-start'>
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
                                    <div className='w-full justify-start'>
                                        <div className='  flex gap-2 p-1'>
                                            <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                                                <SiInternetcomputer color="white" />
                                            </div>
                                            <div className='flex p-4 rounded-3xl bg-gray-200 flex-col'>
                                                <div>
                                                    <TypedMarkdown text={chat.content} disableTyping={false} />
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
