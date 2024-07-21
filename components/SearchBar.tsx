

"use client";
import { PiGraduationCap, PiRocketLaunchThin } from "react-icons/pi";
import useSuggestions from "@/hooks/useSuggestions";
import { useQuickReport } from "@/contexts/QuickReportContext";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

export default function SearchBar() {

    const { setPrompt } = useQuickReport()
    const { isLoading, isSuccess, data, handleChange, handleRecommendation, input } = useSuggestions()
    const router = useRouter()


    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setPrompt(input)
        router.push("/quick-report")
    }

    return (
        <div className="w-[60%] bg-white rounded-3xl overflow-hidden border-gray-200 border-2 shadow-lg focus:outline-gray-300  flex flex-col ">
            <form onSubmit={handleSubmit} className="h-[80px] relative  flex items-center justify-center  ">
                <input
                    value={input}
                    onChange={handleChange}
                    placeholder="What's on your mind..."
                    className="  text-xl h-full   pl-5 pr-20 w-full focus:outline-none"
                />{" "}

                <button
                    className="text-gray-400 absolute glow p-2 cursor-pointer rounded-full bg-gray-100  right-5 "
                >
                    <PiRocketLaunchThin size={30} />
                </button>
            </form>
            {isLoading ? (
                <div className="px-5">
                    <div className="w-10">
                        <Spinner />
                    </div>
                </div>
            ) : null}
            {isSuccess && input.length > 0 ? (
                <div className="flex flex-col gap-1 p-5 pt-0   bg-transparent w-full">
                    <span className="text-[#535353] ">Here are some suggestions</span>
                    <div className="  w-full flex flex-col gap-1">
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
            ) : null}
        </div>
    );
}
