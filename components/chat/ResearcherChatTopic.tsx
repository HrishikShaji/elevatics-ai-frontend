
import { ResearcherTopicsResponse, SelectedSubtasks } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

interface ResearcherChatTopicProps {
    currentTopic: ResearcherTopicsResponse;
    selectedSubtasks: SelectedSubtasks;
    setSelectedSubtasks: Dispatch<SetStateAction<SelectedSubtasks>>;
}

export default function ResearcherChatTopic({
    currentTopic,
    selectedSubtasks,
    setSelectedSubtasks
}: ResearcherChatTopicProps) {

    const handleCheckboxChange = (task: string, subtask: { name: string, prompt: string }) => {
        setSelectedSubtasks((prev) => {
            const currentSubtasks = prev[task] || [];
            const subtaskExists = currentSubtasks.some(item => item.name === subtask.name);

            let updatedSubtasks;
            if (subtaskExists) {
                updatedSubtasks = {
                    ...prev,
                    [task]: currentSubtasks.filter((item) => item.name !== subtask.name),
                };
            } else {
                updatedSubtasks = {
                    ...prev,
                    [task]: [...currentSubtasks, subtask],
                };
            }

            if (updatedSubtasks[task].length === 0) {
                const { [task]: _, ...rest } = updatedSubtasks;
                return rest;
            }

            return updatedSubtasks;
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
