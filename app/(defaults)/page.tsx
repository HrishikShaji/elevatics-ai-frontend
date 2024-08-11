"use client"

import AgentsContainer from '@/components/AgentsContainer';
import SearchBar from '@/components/SearchBar';
import SignInButton from '@/components/SignInButton';
import AgentContainer from '@/components/agent/AgentContainer';
import AgentInputContainer from '@/components/agent/AgentInputContainer';
import AgentSearchBar from '@/components/agent/AgentSearchBar';
import ChatWindow from '@/components/chat/ChatWindow';
import { ChatContext, ChatProvider } from '@/contexts/ChatContext';
import { useQuickReport } from '@/contexts/QuickReportContext';
import useSuggestions from '@/hooks/useSuggestions';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { AiFillAmazonCircle } from 'react-icons/ai';

const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]


const agents = [
    { title: "", url: "/" },
]

const Page = () => {
    const [disableSuggestions, setDisableSuggestions] = useState(false)
    const [inputClick, setInputClick] = useState(false)
    const [initialClick, setInitialClick] = useState(false)
    const [input, setInput] = useState("")
    const { setPrompt } = useQuickReport()
    const router = useRouter()


    const { isLoading, isSuccess, data, mutate } = useSuggestions(input)
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setPrompt(input)
        router.push("/quick-report")
    }
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }, [])

    const handleReset = useCallback(() => {
        setInput("")
    }, [])

    const handleInputClick = useCallback(() => {
        setInputClick(true)
    }, [])

    const handleRecommendationClick = useCallback((recommendation: string) => {
        setInput(recommendation)
        handleInputClick()
        mutate(recommendation)
    }, [])



    return (
        <ChatProvider>
            <ChatWindow title='Quick Search' subTitle='Efficient Quick Search' responseType='iresearcher-report' initialChatHistory='' reportId='' disable={false} />
        </ChatProvider>
    )
};

export default Page;
