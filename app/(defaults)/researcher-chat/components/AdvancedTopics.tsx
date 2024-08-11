
import IconMinusCircle from "@/components/icon/icon-minus-circle";
import IconPlusCircle from "@/components/icon/icon-plus-circle";
import AnimateHeight from "react-animate-height";
import { useState } from "react";
import { SelectedSubtasks } from "@/types/types";
import AdvancedTopic from "./AdvancedTopic";
import { useChat } from "@/contexts/ChatContext";

interface AdvancedTopicsProps {
    content: string;
}

export default function AdvancedTopics({ content }: AdvancedTopicsProps) {
    const [active, setActive] = useState<number | null>(0)
    const [selectedSubtasks, setSelectedSubtasks] = useState<SelectedSubtasks>({});
    const { sendMessage } = useChat()

    function handleSubmit() {
        const stringifiedTasks = JSON.stringify(selectedSubtasks)
        sendMessage({ input: stringifiedTasks, responseType: "iresearcher-reports" })
    }

    return (
        <div className="w-full">
            <h1>Select the topics to be included in the Report</h1>
            <div className="flex">
                <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark w-[50%]">
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
                                    <AdvancedTopic
                                        currentTopic={task}
                                        selectedSubtasks={selectedSubtasks}
                                        setSelectedSubtasks={setSelectedSubtasks}
                                        key={i}
                                    />
                                </div>
                            </AnimateHeight>
                        </div>
                    ))}
                </div>
                <div className=" h-full sm:h-full justify-center items-center flex   text-white pt-5 w-[50%]">
                    <div className="px-3 py-3 bg-black rounded-3xl w-full">

                        <div className="w-full h-[65vh] custom-scrollbar  pt-2 pl-2 pr-4 overflow-y-auto">
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
            <button className="p-2 rounded-md bg-black text-white" onClick={handleSubmit}>continue</button>
        </div>
    )
}
