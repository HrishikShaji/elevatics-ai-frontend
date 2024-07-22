"use client"

import { useResearcher } from "@/contexts/ResearcherContext"
import useFetchTopics from "@/hooks/useFetchTopics"
import { useRouter } from "next/navigation";
import Topic from "./Topic";
import { useState } from "react";
import IconMinusCircle from "@/components/icon/icon-minus-circle";
import IconPlusCircle from "@/components/icon/icon-plus-circle";
import AnimateHeight from "react-animate-height";


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
    const [active, setActive] = useState(0)
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
            className="flex flex-col  h-full sm:gap-5"
        >
            <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark">
                {isLoading ? "loading" : data.map((task, i) => (

                    <div>
                        <div
                            className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
            ${active === i + 1 ? 'bg-primary-light !text-primary dark:bg-[#1B2E4B]' : ''}`}
                            onClick={() => setActive(active === i + 1 ? null : i + 1)}
                        >
                            <span>{task.task}</span>
                            {active !== i + 1 ? (
                                <span className="shrink-0">
                                    <IconPlusCircle duotone={false} />
                                </span>
                            ) : (
                                <span className="shrink-0">
                                    <IconMinusCircle fill={true} />
                                </span>
                            )}
                        </div>
                        <AnimateHeight duration={300} height={active === i + 1 ? 'auto' : 0}>
                            <div className="px-1 py-3 font-semibold text-white-dark">
                                <Topic
                                    currentTopic={task}
                                    isOpen={openTopic === task.task}
                                    setOpenTopic={setOpenTopic}
                                    title={task.task}
                                    key={i}
                                />
                            </div>
                        </AnimateHeight>
                    </div>
                ))}
            </div>
            <button onClick={handleNext} className="p-2 rounded-md bg-black text-white">continue</button>

        </div>
    );
}
