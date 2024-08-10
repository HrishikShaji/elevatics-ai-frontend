

"use client"
import React, { useCallback, useState, useMemo } from 'react';
import AgentContainer from '@/components/agent/AgentContainer';
import { CoderProvider, useCoder } from '../contexts/CoderContext';
import CoderChats from './CoderChats';
import CoderSearchBar from './CoderSearchBar';

export default function AgentCoder() {

    const { sendMessage, loading, chatHistory } = useCoder()
    return (
        <AgentContainer>
            <CoderChats chatHistory={chatHistory} loading={loading} />
            <CoderSearchBar title="Coder" subTitle='Efficient coding' handleSubmit={sendMessage} />
        </AgentContainer >
    );
}
