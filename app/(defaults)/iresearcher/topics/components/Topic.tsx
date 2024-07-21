
import { Dispatch, SetStateAction } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { ResearcherTopicsResponse } from "@/types/types";
import { useResearcher } from "@/contexts/ResearcherContext";

interface TopicProps {
    title: string;
    isOpen: boolean;
    currentTopic: ResearcherTopicsResponse;
    setOpenTopic: Dispatch<SetStateAction<string | null>>;
}

export default function Topic({
    title,
    isOpen,
    setOpenTopic,
    currentTopic
}: TopicProps) {
    const { selectedSubtasks, setSelectedSubtasks } = useResearcher();

    const handleCheckboxChange = (task: string, subtask: { name: string, prompt: string }) => {
        setSelectedSubtasks((prev) => {
            const currentSubtasks = prev[task] || [];
            const subtaskExists = currentSubtasks.some(item => item.name === subtask.name);

            if (subtaskExists) {
                return {
                    ...prev,
                    [task]: currentSubtasks.filter((item) => item.name !== subtask.name),
                };
            } else {
                return {
                    ...prev,
                    [task]: [...currentSubtasks, subtask],
                };
            }
        });
    };

    return (
        <div className="w-full bg-white py-1 border-b-2 border-gray-200 flex flex-col">
            <div className="flex justify-between items-center w-full">
                <h1>{title}</h1>
                {isOpen ? (
                    <button onClick={() => setOpenTopic(null)} className="">
                        <CiCircleMinus size={30} />
                    </button>
                ) : (
                    <button onClick={() => setOpenTopic(title)} className="">
                        <CiCirclePlus size={30} />
                    </button>
                )}
            </div>
            {isOpen ? (
                <div>
                    {currentTopic.subtasks.map((subtask, i) => (
                        <div key={i} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={
                                    selectedSubtasks[currentTopic.task]?.some(item => item.name === subtask.name) || false
                                }
                                onChange={() => handleCheckboxChange(currentTopic.task, { name: subtask.name, prompt: subtask.prompt })}
                            />
                            <label className="ml-2">{subtask.name}</label>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
