
"use client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { InvestorDataResponse } from "@/types/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PiRocketLaunchThin } from "react-icons/pi";
import { useInvestor } from "@/contexts/InvestorContext";

export default function Investor() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingSection, setLoadingSection] = useState("uploading file...")
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { setData, setFileName } = useInvestor();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFileName(event.target.files[0].name);
            setFile(event.target.files[0]);
        }
    };
    const handleFetchSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!file) return null

        const formData = new FormData();
        formData.append("file", file as Blob);
        formData.append("Funding", String(.5));
        try {
            setLoading(true)
            const response = await fetch("https://nithin1905-investor.hf.space/investor", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            console.log(result);
            setData(result as InvestorDataResponse)
            setProgress(50);
            setLoadingSection("Evaluating the deck...")

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            router.push("/investor/report");
        }
    };


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file as Blob);
        formData.append("Funding", String(.5));

        try {
            setLoading(true);
            const response = await axios.post("https://nithin1905-investor.hf.space/investor", formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentage = Math.round((progressEvent.loaded * 25) / progressEvent.total);
                        setProgress(percentage);
                    }
                }
            });

            setProgress(50);
            setLoadingSection("Evaluating the deck...")

            const result = response.data;
            console.log(result);
            setData(result as InvestorDataResponse);
            setProgress(100);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            router.push("/investment/sample");
        }
    };

    const handleClick = () => {
        console.log("clicked");
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
                {loading && (
                    <div className="w-[50%] flex flex-col gap-2">
                        <div className="w-full rounded-3xl h-[10px] bg-gray-300 relative overflow-hidden">
                            <div className="absolute bg-blue-500 h-full " style={{ width: `${progress}%` }}></div>
                        </div>
                        <h1>{loadingSection}</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
