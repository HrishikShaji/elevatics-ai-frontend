"use client"

import { useResearcher } from "@/contexts/ResearcherContext"
import useFetchTopics from "@/hooks/useFetchTopics"
import { useRouter } from "next/navigation";
import Topic from "./Topic";
import { useState } from "react";


type Subtask = {
    name: string;
    prompt: string;
};

type OriginalData = {
    [key: string]: Subtask[];
};
export type TransformedData = {
    parentKey: string;
    name: string;
    prompt: string;
};
export default function TopicSection() {
    const [openTopic, setOpenTopic] = useState<string | null>(null);
    const { selectedSubtasks, setTopics } = useResearcher();
    const { data, isLoading } = useFetchTopics();
    const router = useRouter()
    console.log(selectedSubtasks)
    console.log(data)

    const transformData = (data: OriginalData): TransformedData[] => {
        const result: TransformedData[] = [];

        for (const parentKey in data) {
            if (data.hasOwnProperty(parentKey)) {
                data[parentKey].forEach(subtask => {
                    result.push({
                        parentKey,
                        name: subtask.name,
                        prompt: subtask.prompt,
                    });
                });
            }
        }

        return result;
    };


    function handleNext() {
        const data = transformData(selectedSubtasks)
        setTopics(data)
        router.push("/iresearcher/topics/report")
    }
    return (
        <div
            className="flex flex-col sm:flex-row h-full sm:gap-5"
        >
            <button onClick={handleNext} className="p-2 rounded-md bg-black text-white">continue</button>
            {isLoading ? (
                <div className="w-full flex justify-center">
                    <div className="w-10 mt-10">
                        loading
                    </div>
                </div>
            ) : <div className="pt-[200px] px-[200px] flex flex-col gap-1">
                {data.map((task, i) => (
                    <Topic
                        currentTopic={task}
                        isOpen={openTopic === task.task}
                        setOpenTopic={setOpenTopic}
                        title={task.task}
                        key={i}
                    />
                ))}
            </div>}

        </div>
    );
}
