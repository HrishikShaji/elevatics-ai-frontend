"use client"

import SearchBar from '@/components/SearchBar';
import SignInButton from '@/components/SignInButton';
import { useQuickReport } from '@/contexts/QuickReportContext';
import useSuggestions from '@/hooks/useSuggestions';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';

const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

const Page = () => {

    const [initialClick, setInitialClick] = useState(false)

    const { setPrompt } = useQuickReport()
    const router = useRouter()


    const { isLoading, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setPrompt(input)
        router.push("/quick-report")
    }
    function handleClick() {
        setInitialClick(true);
    }

    function handleRecommendationClick(item: string) {
        setInitialClick(true);
        handleRecommendation(item);
    }

    return <div className="relative flex flex-col px-10 gap-5 items-center h-screen pt-[200px] sm:pt-[200px] w-full">
        <h1 className="text-3xl font-semibold">
            Quick Search
        </h1>
        {!initialClick ? <>
            <h1 className="text-[#8282AD] text-center">
                Unlock over 200 million resources and advanced features for effortless, in-depth research.
            </h1>
            <div className="flex pt-[50px] gap-4 w-[800px]">
                {suggestions.map((item, i) => (

                    <div onClick={() => handleRecommendationClick(item)} key={i} className='cursor-pointer h-[150px] transition duration-300 hover:-translate-y-3 w-full hover:bg-gray-200 hover:text-black rounded-3xl shadow-gray-300 p-5 text-gray-500 pt-10 shadow-3xl'>{item}</div>
                ))}
            </div>
        </> : null}

        <div className={`${initialClick ? "pt-0" : "pt-[120px]"}`}>
            <SearchBar handleClick={handleClick} isSuccess={isSuccess} input={input} handleRecommendation={handleRecommendation} handleSubmit={handleSubmit} handleChange={handleChange} data={data} />
        </div>
        <SignInButton />
    </div>;
};

export default Page;
