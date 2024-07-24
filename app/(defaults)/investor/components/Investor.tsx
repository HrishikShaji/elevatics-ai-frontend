
"use client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PiRocketLaunchThin } from "react-icons/pi";
import { useInvestor } from "@/contexts/InvestorContext";

export default function Investor() {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { file, setFile, setFileName } = useInvestor();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFileName(event.target.files[0].name);
            setFile(event.target.files[0]);
        }
    };
    const handleFetchSubmit = async (e: FormEvent) => {
        e.preventDefault()
        router.push("/investor/report");
    };

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col px-10 gap-5 items-center h-full pt-[300px] sm:pt-[200px] w-full">
                <h1 className="text-3xl font-semibold">
                    Investor
                </h1>
                <h1 className="text-[#8282AD] text-center">
                    Investment opportunities with data-driven insights.
                </h1>

                <form onSubmit={handleFetchSubmit} className="flex items-center relative w-[50%]">
                    <div
                        className="rounded-xl cursor-pointer bg-white border-2 pr-28 text-gray-500 shadow-md border-gray-100 focus:outline-gray-300 p-4 w-full"
                        onClick={handleClick}
                    >
                        {file ? file.name : " Browse or Drag and Drop File"}
                    </div>
                    <input
                        type="file"
                        hidden
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="rounded-xl border-2 pr-28 shadow-md border-gray-100 bg-white focus:outline-gray-300 p-4 w-full"
                    />{" "}
                    <button className="text-black absolute right-2">
                        <PiRocketLaunchThin size={30} />
                    </button>
                </form>
            </div>
        </div>
    );
}
