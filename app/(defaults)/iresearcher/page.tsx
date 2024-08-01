"use client"
import { FormEvent, useState } from "react";
import SearchBar from "./components/SearchBar";
import { useResearcher } from "@/contexts/ResearcherContext";
import { useRouter } from "next/navigation";
import useSuggestions from "@/hooks/useSuggestions";

const suggestions = ["How to setup a pizza business", "Suggest me university for higher studies abroad", "Explain process of home remodeling", "Market sentiments on investment in AI"]

export default function Page() {
    const [initialClick, setInitialClick] = useState(false)

    const { setPrompt } = useResearcher()
    const router = useRouter()


    const { isLoading, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setPrompt(input)
        router.push("/iresearcher/topics")
    }
    function handleClick() {
        setInitialClick(true);
    }

    function handleRecommendationClick(item: string) {
        setInitialClick(true);
        handleRecommendation(item);
    }

    return <div className="relative flex flex-col px-10 gap-5 items-center h-full pt-[200px] sm:pt-[200px] w-full">
        <h1 className="text-3xl font-semibold">
            iResearcher
        </h1>
        {!initialClick ? <>
            <h1 className="text-[#8282AD] text-center">
                Gain comprehensive insights and make informed decisions with Researcher's powerful tools
            </h1>
            <div className="flex pt-[50px] flex-grow-0 gap-4 w-[800px]">
                {suggestions.map((item, i) => (

                    <div key={i} onClick={() => handleRecommendationClick(item)} className='cursor-pointer h-[150px] transition duration-300 hover:-translate-y-3 w-full hover:bg-gray-200 hover:text-black rounded-3xl shadow-gray-300 p-5 text-gray-500 pt-10 shadow-3xl'>{item}</div>
                ))}
            </div>
        </> : null}

        <div className={`${initialClick ? "pt-0" : "pt-[120px]"}`}>
            <SearchBar handleClick={handleClick} isSuccess={isSuccess} input={input} handleRecommendation={handleRecommendation} handleSubmit={handleSubmit} handleChange={handleChange} data={data} />
        </div>
    </div>;

}
