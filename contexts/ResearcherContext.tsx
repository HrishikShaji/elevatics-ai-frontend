
"use client"

import { ResearcherTopicsResponse, SelectedSubtasks, Topic } from "@/types/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";


type ResearcherProviderProps = {
    children: ReactNode;
};
interface ResearcherData {
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
    selectedSubtasks: SelectedSubtasks;
    setSelectedSubtasks: Dispatch<SetStateAction<SelectedSubtasks>>;
    topics: Topic[];
    setTopics: Dispatch<SetStateAction<Topic[]>>;

}

const ResearcherContext = createContext<ResearcherData | undefined>(undefined);
export const useResearcher = () => {
    const context = useContext(ResearcherContext);
    if (!context) {
        throw new Error("useResearcher must be used within a ResearcherProvider");
    }
    return context;
};
export const ResearchProvider = ({ children }: ResearcherProviderProps) => {
    const [prompt, setPrompt] = useState("");
    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedSubtasks, setSelectedSubtasks] = useState<SelectedSubtasks>({});

    const researcherData = {
        prompt,
        setPrompt,
        topics,
        setTopics,
        selectedSubtasks,
        setSelectedSubtasks,
    };

    return (
        <ResearcherContext.Provider value={researcherData}>
            {children}
        </ResearcherContext.Provider>
    );
};
