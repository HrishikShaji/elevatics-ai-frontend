"use client"

import React, { useCallback, useState } from 'react';
import { HFSPACE_TOKEN, TOPICS_URL } from '@/lib/endpoints';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentSearchBar from '@/components/agent/AgentSearchBar';
import { Chat, OriginalData, SelectedSubtasks, TransformedData } from '@/types/types';
import AutoScrollWrapper from '../../search/components/AutoScrollWrapper';
import { useAccount } from '@/contexts/AccountContext';
import { SiInternetcomputer } from 'react-icons/si';
import Image from 'next/image';
import AdvancedTopics from './AdvancedTopics';
import AdvancedReportContainer from './AdvancedReportContainer';


export default function AdvancedSearchAgent() {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [topicsLoading, setTopicsLoading] = useState(false);
    const { profile } = useAccount()
    console.log("rendered")


    const addMessage = useCallback(({ role, content, metadata, reports }: Chat) => {
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
    }, [chatHistory])



    const addReport = useCallback(({ role, content, metadata, name, parentKey, report, sliderKeys }: any) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                updatedChatHistory[updatedChatHistory.length - 1].content = content;
                updatedChatHistory[updatedChatHistory.length - 1].metadata = metadata;
                updatedChatHistory[updatedChatHistory.length - 1].sliderKeys = sliderKeys;
                const currentReports = updatedChatHistory[updatedChatHistory.length - 1].reports
                if (currentReports) {

                    const reportExist = currentReports.find((report) => report.name === name)
                    if (reportExist) {
                        reportExist.report = report
                        reportExist.metadata = metadata
                    } else {
                        currentReports?.push({ name: name, parentKey: parentKey, report: report, metadata: metadata })
                    }
                }

                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { role, content, metadata, reports: [] }];
            }
        });
    }, [chatHistory]);
    const generateTopics = async (input: string) => {
        setTopicsLoading(true);
        addMessage({ role: "user", content: input, metadata: null, reports: [] })

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
            setTopicsLoading(false);
        }
    }
    const generateReport = async (selectedSubtasks: SelectedSubtasks) => {
        addMessage({ role: "user", content: "user clicked continue", metadata: null, reports: [] });
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
        const topics = transformData(selectedSubtasks);
        const sliderKeys = Object.keys(selectedSubtasks)

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
                            addReport({ role: 'assistant', content: markdown, metadata: metadata, name: topic.name, parentKey: topic.parentKey, report: markdown, sliderKeys: sliderKeys });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                addMessage({ role: "assistant", content: "Failed to generate report.", metadata: null, reports: [] });
            }
        }
    };



    return (
        <AgentContainer>
            {chatHistory.length > 0 ? (
                <AutoScrollWrapper>
                    <div className='w-[1000px] py-5 flex flex-col gap-2 ' >
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
                                    <div className=' w-full flex gap-2 p-1'>
                                        <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                                            <SiInternetcomputer color="white" />
                                        </div>
                                        <div className='flex w-full p-4 rounded-3xl bg-gray-200 flex-col'>
                                            <AdvancedTopics generateReport={generateReport} content={chat.content} />
                                        </div>
                                    </div>
                                </div>
                                : (
                                    <AdvancedReportContainer chat={chat} key={i} />
                                );
                        })}
                        {topicsLoading ?

                            <div className='w-full justify-start'>
                                <div className='  flex gap-2 p-1'>
                                    <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                                        <SiInternetcomputer color="white" />
                                    </div>
                                    <div className='flex p-4 rounded-3xl bg-gray-200 flex-col'>
                                        Loading...
                                    </div>
                                </div>
                            </div>
                            : null}
                    </div>
                </AutoScrollWrapper>
            ) : null}
            <AgentSearchBar title='Advanced Search' subTitle='advanced' disableSuggestions={chatHistory.length > 0} handleSubmit={generateTopics} />
        </AgentContainer>
    );
}
