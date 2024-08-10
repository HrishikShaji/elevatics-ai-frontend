

"use client"
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import AgentContainer from '@/components/agent/AgentContainer';
import { CoderProvider, useCoder } from '../contexts/CoderContext';
import CoderChats from './CoderChats';
import CoderSearchBar from './CoderSearchBar';

interface AgentCoderProps {
    initialChatHistory: string;
    reportId: string;
}

export default function AgentCoder({ initialChatHistory, reportId }: AgentCoderProps) {

    const { sendMessage, loading, chatHistory, setChatHistory, setReportId, setConverstionId } = useCoder()

    useEffect(() => {
        if (initialChatHistory === "") {
            setChatHistory([])
            setConverstionId("");
            setReportId("")
        } else {
            const parsedData = JSON.parse(initialChatHistory)
            setChatHistory(parsedData.chatHistory)
            setConverstionId(parsedData.conversationId);
            setReportId(reportId)
        }
    }, [initialChatHistory, reportId]);

    return (
        <AgentContainer>
            <CoderChats chatHistory={chatHistory} loading={loading} />
            <CoderSearchBar title="Coder" subTitle='Efficient coding' handleSubmit={sendMessage} />
        </AgentContainer >
    );
}
