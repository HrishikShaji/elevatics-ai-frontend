

"use client";
import { PiGraduationCap, PiRocketLaunchThin } from "react-icons/pi";
import useSuggestions from "@/hooks/useSuggestions";
import { useQuickReport } from "@/contexts/QuickReportContext";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import AnimateHeight from "react-animate-height";
import { useAccount } from "@/contexts/AccountContext";

export default function SearchBar() {
    const { profile } = useAccount()
    const { setPrompt } = useQuickReport()
    const { isLoading, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()
    const router = useRouter()


    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setPrompt(input)
        router.push("/quick-report")
    }

    return (
        <div className="w-[90vw] sm:w-[800px]  bg-white flex-grow-0  rounded-3xl dark:bg-neutral-700 overflow-hidden border-gray-200 border-2 shadow-lg focus:outline-gray-300  flex flex-col ">
            <form onSubmit={handleSubmit} className=" relative  flex items-center justify-center  ">
                <input
                    value={input}
                    onChange={handleChange}
                    placeholder="What's on your mind..."
                    className="   pr-28  bg-white focus:outline-none p-4 w-full"
                />{" "}

                <button
                    className="text-gray-400 hover:bg-gray-300 hover:scale-125 duration-500 absolute glow p-2 group cursor-pointer rounded-full bg-gray-100  right-2 "
                >
                    <PiRocketLaunchThin size={20} className="text-gray-500 group-hover:text-white duration-500" />
                </button>
            </form>
            <AnimateHeight height={isSuccess ? 300 : 0} duration={300}>
                <div className="flex flex-col gap-1 p-5 pt-0   bg-transparent w-full">
                    <span className="text-[#535353] ">Here are some suggestions</span>
                    <div className="  w-full overflow-y-auto max-h-[300px] flex flex-col gap-1">
                        {data.map((recommendation: string, i: number) => (
                            <div
                                onClick={() => handleRecommendation(recommendation)}
                                key={i}
                                className="flex cursor-pointer p-1 items-center text-gray-500 gap-5 bg-transparent "
                            >
                                <h1 className="bg-gray-100 py-1 px-3 hover:font-semibold rounded-xl">
                                    {recommendation}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimateHeight>
        </div>
    );
}
