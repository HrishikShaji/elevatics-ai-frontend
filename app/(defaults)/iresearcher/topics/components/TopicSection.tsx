"use client"

import { useResearcher } from "@/contexts/ResearcherContext"
import useFetchTopics from "@/hooks/useFetchTopics"
import { useRouter } from "next/navigation";
import Topic from "./Topic";
import { useState } from "react";
import IconMinusCircle from "@/components/icon/icon-minus-circle";
import IconPlusCircle from "@/components/icon/icon-plus-circle";
import AnimateHeight from "react-animate-height";
import { Loader } from "@/components/Loader";
import { topicLoadingSteps } from "@/lib/loadingStatements";


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
    const { prompt, selectedSubtasks, setTopics } = useResearcher();
    const { data, isLoading } = useFetchTopics();
    const [active, setActive] = useState<number | null>(0)
    const router = useRouter()

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

    if (isLoading) return <Loader steps={topicLoadingSteps} />
    return (
        <div
            className="flex flex-col  h-full sm:gap-5"
        >
            <div className="flex">

                <div className="sm:w-[50%] w-full h-full  sm:h-full overflow-y-hidden px-28 pt-32">
                    <div className="w-full justify-between flex relative items-center">
                        <div>
                            <h1 className="text-xl sm:text-3xl font-semibold w-full">
                                {prompt}
                            </h1>
                            <h1 className="text-[#39393A] w-full">
                                Select the components to be included in the final report:
                            </h1>
                        </div>
                    </div>
                    <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark">
                        {data?.map((task, i) => (

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
                    <button
                        onClick={handleNext}
                        className="rounded-md p-2 absolute bottom-20 flex-grow-0 "
                    >
                        Continue
                    </button>
                </div>
                <div className="w-full sm:w-[50%] h-full sm:h-full justify-center items-center flex p-10 px-28 text-white pt-24">
                    <div className="px-3 py-10 bg-black rounded-3xl w-full">

                        <div className="w-full h-[65vh] custom-scrollbar  pt-8 px-10 pr-20 overflow-y-auto">
                            {Object.entries(selectedSubtasks).map(([key, value], i) => (
                                <div key={i} className=" w-full">
                                    <div
                                        key={i}
                                        className="border-b-2 py-2  text-xl border-gray-700 w-full"
                                    >
                                        {value.length !== 0 ? key : null}
                                    </div>
                                    {value.map((item, j) => (
                                        <div key={j} className="ml-5 py-1 pt-4">
                                            <h1>{item.name}</h1>
                                            <p className="text-sm text-gray-400">{item.prompt}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
