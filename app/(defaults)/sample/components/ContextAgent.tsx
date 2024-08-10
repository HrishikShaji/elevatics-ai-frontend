
"use client"
import React, { useCallback, useState, useMemo } from 'react';
import { AdvancedContext, AdvancedProvider } from './AdvancedContext';
import ContextChat from './ContextChat';
import ContextSearchBar from './ContextSearchBar';
import AgentContainer from '@/components/agent/AgentContainer';

export default function ContextAgent() {

    return (
        <AgentContainer>
            <AdvancedProvider>
                <ContextChat />
                <ContextSearchBar title='Context Search' subTitle='context search demo' />
            </AdvancedProvider>
        </AgentContainer>
    );
}
