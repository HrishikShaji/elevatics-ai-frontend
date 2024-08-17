
import IconMinusCircle from "@/components/icon/icon-minus-circle";
import IconPlusCircle from "@/components/icon/icon-plus-circle";
import AnimateHeight from "react-animate-height";
import { useState } from "react";
import { SelectedSubtasks } from "@/types/types";
import { useChat } from "@/contexts/ChatContext";
import ResearcherChatTopic from "./ResearcherChatTopic";

interface ResearcherChatTopicsProps {
    content: string;
}

export default function ResearcherChatTopics({ content }: ResearcherChatTopicsProps) {
    const [active, setActive] = useState<number | null>(0)
    const [selectedSubtasks, setSelectedSubtasks] = useState<SelectedSubtasks>({});
    const { sendMessage } = useChat()

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        const stringifiedTasks = JSON.stringify(selectedSubtasks)
        sendMessage({ input: stringifiedTasks, responseType: "iresearcher-reports" })
    }
    console.log(selectedSubtasks)
    return (
        <div className="w-full flex flex-col gap-5 ">
            <h1>Select the topics to be included in the Report</h1>
            <div className="divide-y divide-white-light   dark:divide-dark w-full">
                {JSON.parse(content)?.map((task: any, i: number) => (

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
                                <ResearcherChatTopic
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
            <div className="flex flex-col gap-3" >
                {Object.entries(selectedSubtasks).map(([key, value], i) => {
                    if (value.length === 0) return null
                    return (
                        <div key={i} className=" w-full flex flex-col gap-3">
                            <h1 className="py-1 border-b-2 border-black ">{key}</h1>
                            <div className="flex flex-wrap gap-3">
                                {value.map((item, j) => (
                                    <div key={j} className=" bg-black text-white rounded-3xl py-1 px-2">
                                        <h1>{item.name}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>)
                })}
            </div>
            <div className="w-full">
                <button type="button" className="p-2 rounded-md bg-black text-white" onClick={handleSubmit}>continue</button>
            </div>
        </div>
    )
}
