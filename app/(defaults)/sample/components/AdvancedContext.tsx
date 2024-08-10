
"use client";

import { AgentModel, Chat, ReportOptions, TopicsLimit } from "@/types/types";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
    useCallback,
} from "react";


type ReportProps = {
    role: "assistant" | "user" | "options";
    content: string;
    metadata: string;
    name: string;
    parentKey: string;
    report: string;
    sliderKeys: string[]
}

interface AdvancedData {
    addReport: (props: ReportProps) => void;
    addMessage: (props: Chat) => void;
    chatHistory: Chat[]
    topicsLoading: boolean;
    setTopicsLoading: Dispatch<SetStateAction<boolean>>;
}

export const AdvancedContext = createContext<AdvancedData | undefined>(undefined);

export const useAdvanced = () => {
    const context = useContext(AdvancedContext);
    if (!context) {
        throw new Error("useAdvanced must be used within a AdvancedProvider");
    }
    return context;
};

type AdvancedProviderProps = {
    children: ReactNode;
};

export const AdvancedProvider = ({ children }: AdvancedProviderProps) => {

    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [topicsLoading, setTopicsLoading] = useState(false);
    console.log("rendered")
    const addMessage = useCallback(({ role, content, metadata, reports }: Chat) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                const lastMessage = updatedChatHistory[updatedChatHistory.length - 1];

                if (lastMessage.content !== content || lastMessage.metadata !== metadata || lastMessage.reports !== reports) {
                    lastMessage.content = content;
                    lastMessage.metadata = metadata;
                    lastMessage.reports = reports;
                }

                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { role, content, metadata, reports }];
            }
        });
    }, []);

    const addReport = useCallback(({ role, content, metadata, name, parentKey, report, sliderKeys }: any) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                const lastMessage = updatedChatHistory[updatedChatHistory.length - 1];

                if (lastMessage.content !== content || lastMessage.metadata !== metadata || lastMessage.sliderKeys !== sliderKeys) {
                    lastMessage.content = content;
                    lastMessage.metadata = metadata;
                    lastMessage.sliderKeys = sliderKeys;

                    const currentReports = lastMessage.reports;
                    if (currentReports) {
                        const reportExist = currentReports.find((r) => r.name === name);
                        if (reportExist) {
                            reportExist.report = report;
                            reportExist.metadata = metadata;
                        } else {
                            currentReports.push({ name: name, parentKey: parentKey, report: report, metadata: metadata });
                        }
                    }
                }

                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { role, content, metadata, reports: [] }];
            }
        });
    }, []);

    const advancedData: AdvancedData = {
        addMessage,
        addReport,
        chatHistory,
        topicsLoading,
        setTopicsLoading
    }
    return (
        <AdvancedContext.Provider value={advancedData}>{children}</AdvancedContext.Provider>
    );
};
