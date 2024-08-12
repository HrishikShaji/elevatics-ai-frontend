
"use client"

import useSaveReport from "@/hooks/useSaveReport";
import fetchResearcherReports from "@/lib/fetchResearcherReports";
import { Chat, ChatType, ReportProps, ResearcherTopicsResponse, SelectedSubtasks, Topic } from "@/types/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from "react";


type ResearcherProviderProps = {
    children: ReactNode;
};
interface ResearcherData {
    sendMessage: ({ input, responseType }: { input: string, responseType: ChatType }) => void;
    prompt: string;
    chatHistory: Chat[];
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
    const [loading, setLoading] = useState(false)
    const [chatHistory, setChatHistory] = useState<Chat[]>([])
    const [streamComplete, setStreamComplete] = useState(false)
    const { mutate } = useSaveReport()

    useEffect(() => {
        if (streamComplete) {
            console.log("ran saving")
            mutate({
                name: prompt,
                report: JSON.stringify({ chatHistory: chatHistory, conversationId: "" }),
                reportId: "",
                reportType: "FULL"
            });
        }
    }, [streamComplete]);
    const addReports = useCallback(({ type, role, content, metadata, name, parentKey, report, sliderKeys }: ReportProps) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                const lastMessage = updatedChatHistory[updatedChatHistory.length - 1];

                if (lastMessage.content !== content || lastMessage.metadata !== metadata || lastMessage.sliderKeys !== sliderKeys) {
                    lastMessage.content = content;
                    lastMessage.metadata = metadata;
                    lastMessage.sliderKeys = sliderKeys;
                    lastMessage.type = type;

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
                return [...prevChatHistory, { type, role, content, metadata, reports: [] }];
            }
        });
    }, []);
    const sendMessage = async ({ input, responseType }: { input: string, responseType: ChatType }) => {
        setLoading(true)
        setStreamComplete(false)

        try {
            if (responseType === "iresearcher-reports") {
                await fetchResearcherReports({ addReports: addReports, query: input })
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setStreamComplete(true)
            setLoading(false)
        }
    };
    const researcherData = {
        prompt,
        setPrompt,
        topics,
        setTopics,
        selectedSubtasks,
        setSelectedSubtasks,
        sendMessage,
        chatHistory
    };

    return (
        <ResearcherContext.Provider value={researcherData}>
            {children}
        </ResearcherContext.Provider>
    );
};
