import IconMinusCircle from "@/components/icon/icon-minus-circle";
import IconPlusCircle from "@/components/icon/icon-plus-circle";
import AnimateHeight from "react-animate-height";
import Topic from "../../iresearcher/topics/components/Topic";
import { useState } from "react";

interface AdvancedTopicsProps {
    content: string;
    generateReport: (value: string) => void;
}

export default function AdvancedTopics({ content, generateReport }: AdvancedTopicsProps) {
    const [active, setActive] = useState<number | null>(0)
    const [openTopic, setOpenTopic] = useState<string | null>(null);
    return (
        <div>
            <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark">
                {JSON.parse(content)?.map((task, i) => (

                    <div key={i}>
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
            <button className="p-2 rounded-md bg-black text-white" onClick={() => generateReport("singularity")}>continue</button>
        </div>
    )
}
