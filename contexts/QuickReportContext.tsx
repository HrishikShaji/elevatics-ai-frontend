
"use client";

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    SetStateAction,
    Dispatch,
} from "react";

interface PromptData {
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
}
const PromptContext = createContext<PromptData | undefined>(undefined);

export const useQuickReport = () => {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error("useQuickReport must be used within a QuickReportProvider");
    }
    return context;
};

type QuickReportProviderProps = {
    children: ReactNode;
};

export const QuickReportProvider = ({ children }: QuickReportProviderProps) => {
    const [prompt, setPrompt] = useState("");
    const promptData = {
        prompt,
        setPrompt,
    };

    return (
        <PromptContext.Provider value={promptData}>
            {children}
        </PromptContext.Provider>
    );
};
