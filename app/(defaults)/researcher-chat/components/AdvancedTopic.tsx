
import { ResearcherTopicsResponse, SelectedSubtasks } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

interface AdvancedTopicProps {
    currentTopic: ResearcherTopicsResponse;
    selectedSubtasks: SelectedSubtasks;
    setSelectedSubtasks: Dispatch<SetStateAction<SelectedSubtasks>>;
}

export default function AdvancedTopic({
    currentTopic,
    selectedSubtasks,
    setSelectedSubtasks
}: AdvancedTopicProps) {

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
    );
}
