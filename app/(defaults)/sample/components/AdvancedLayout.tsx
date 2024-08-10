
"use client"

import React, { ReactNode, useCallback, useState } from 'react';
import { HFSPACE_TOKEN, TOPICS_URL } from '@/lib/endpoints';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentSearchBar from '@/components/agent/AgentSearchBar';
import { Chat, OriginalData, SelectedSubtasks, TransformedData } from '@/types/types';
import AutoScrollWrapper from '../../search/components/AutoScrollWrapper';
import AgentMessageWrapper from './BotMessageWrapper';
import ChatMessages from './ChatMessages';
import AdvancedChat from './AdvancedChat';


interface AdvancedLayoutProps {
    messages: ReactNode;
}

export default function AdvancedSearchAgent({ messages }: AdvancedLayoutProps) {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [topicsLoading, setTopicsLoading] = useState(false);
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
            {messages}
            {}
            <AdvancedChat generateReport={generateReport} loading={topicsLoading} />
            <AgentSearchBar title='Advanced Search' subTitle='advanced' disableSuggestions={chatHistory.length > 0} handleSubmit={generateTopics} />
        </AgentContainer>
    );
}
