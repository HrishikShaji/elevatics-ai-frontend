"use client";

import { AgentModel, ReportOptions, TopicsLimit } from "@/types/types";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";


interface SettingsData {
    reportOptions: ReportOptions;
    setReportOptions: Dispatch<SetStateAction<ReportOptions>>
    topicsLimit: TopicsLimit;
    setTopicsLimit: Dispatch<SetStateAction<TopicsLimit>>;
    agentModel: AgentModel;
    setAgentModel: Dispatch<SetStateAction<AgentModel>>;
}

export const SettingsContext = createContext<SettingsData | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};

type SettingsProviderProps = {
    children: ReactNode;
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const [reportOptions, setReportOptions] = useState<ReportOptions>({
        outputFormat: "report_table",
        internet: true,
        dataFormat: "Structured data",
        generate_charts: true
    })
    const [agentModel, setAgentModel] = useState<AgentModel>("meta-llama/llama-3-70b-instruct")
    const [topicsLimit, setTopicsLimit] = useState<TopicsLimit>({ topics: 5, subTopics: 3 })

    const settingsData: SettingsData = {
        reportOptions,
        setReportOptions,
        topicsLimit,
        setTopicsLimit,
        setAgentModel,
        agentModel
    };

    return (
        <SettingsContext.Provider value={settingsData}>{children}</SettingsContext.Provider>
    );
};
