
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
import AutoScrollWrapper from '../../search/components/AutoScrollWrapper';


const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

export default function QuickSearchAgent() {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [streamComplete, setStreamComplete] = useState(false);
    const [initialSearch, setInitialSearch] = useState(false);
    const controllerRef = useRef<AbortController | null>(null)
    const [disableSuggestions, setDisableSuggestions] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState<AgentModel>("meta-llama/llama-3-70b-instruct")
    const [reportId, setReportId] = useState("");
    const [conversationId, setConversationId] = useState("")

    const { reset, handleInputClick, inputClick, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()


    const { mutate, isSuccess: isReportSaveSuccess, data: savedReport } = useSaveReport();

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
    const generateReport = async (e: FormEvent) => {
        e.preventDefault();
        setDisableSuggestions(true)
        setInitialSearch(true);
        setStreamComplete(false);
        addMessage({ role: "user", content: input })
        reset();

        try {
            const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({
                    description: input,
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
                            //                    processMetadata(metadata);
                        }
                    } else {
                        markdown += chunk;
                        addMessage({ role: "assistant", content: markdown })
                    }
                }
            }
        } catch (error) {
            addMessage({ role: "assistant", content: "Oops." })
        } finally {
            setStreamComplete(true);
        }

    };

    const renderMarkdown = (markdown: string) => {
        const reportContent = markdown.match(/<report>([\s\S]*)<\/report>/);

        if (reportContent) {
            addMessage({ role: "assistant", content: reportContent[1] })
        } else {
            addMessage({ role: "assistant", content: markdown })
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
                        {chatHistory.map((chat, i) => (<AgentChats disableTyping={false} key={i} chat={chat} />))}
                    </div>
                </AutoScrollWrapper>
            ) : (
                <AgentIntro suggestions={suggestions} hasClicked={inputClick} handleSuggestionsClick={handleRecommendation} title='Search' subTitle='Faster Efficient Search' />
            )}
            <AgentInputContainer>
                <AgentSearchBar disableSuggestions={disableSuggestions} handleChange={handleChange} data={data} isSuccess={isSuccess} handleSubmit={generateReport} input={input} handleRecommendation={handleRecommendation} handleClick={handleInputClick} />
            </AgentInputContainer>
        </AgentContainer>
    );
}
