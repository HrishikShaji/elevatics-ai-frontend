"use client";
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { useSettings } from "@/contexts/SettingsContext";
import useSaveReport from "@/hooks/useSaveReport";
import { Chat, ChatType, ReportProps } from "@/types/types";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
    SetStateAction,
    Dispatch,
} from "react";
import fetchQuickReport from '@/lib/fetchQuickReport';
import fetchCodeInterpreterResponse from '@/lib/fetchCodeInterpreterResponse';
import fetchSearchResponse from '@/lib/fetchSearchResponse';
import fetchNewsResponse from '@/lib/fetchNewsResponse';
import fetchCoderResponse from '@/lib/fetchCoderResponse';
import fetchDocumentResponse from '@/lib/fetchDocumentResponse';
import { ReportType } from '@prisma/client';
import fetchResearcherReports from '@/lib/fetchResearcherReports';
import fetchResearcherTopics from '@/lib/fetchResearcherTopics';

interface ChatData {
    sendMessage: ({ input, responseType }: { input: string, responseType: ChatType }) => void;
    chatHistory: Chat[];
    loading: boolean;
    setConversationId: Dispatch<SetStateAction<string>>;
    setChatHistory: Dispatch<SetStateAction<Chat[]>>;
    setReportId: Dispatch<SetStateAction<string>>;
    conversationId: string;
}

export const ChatContext = createContext<ChatData | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

type ChatProviderProps = {
    children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {

    const { agentModel } = useSettings();
    const [conversationId, setConversationId] = useState("");
    const [userId, setUserId] = useState("");
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(false)
    const [reportId, setReportId] = useState("")
    const [streamComplete, setStreamComplete] = useState(false)
    const [currentReportType, setCurrentReportType] = useState<ReportType | null>(null)

    const { mutate, isSuccess, data } = useSaveReport();
    useEffect(() => {
        if (isSuccess && data.id) {
            setReportId(data.id);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (streamComplete && currentReportType !== null) {
            console.log("ran saving")
            mutate({
                name: chatHistory[0].content,
                report: JSON.stringify({ chatHistory: chatHistory, conversationId: conversationId }),
                reportId: reportId,
                reportType: currentReportType
            });
        }
    }, [streamComplete]);

    useEffect(() => {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        const conversationID = uuidv4();
        setConversationId(conversationID)
        setUserId(userId);
    }, []);

    const addMessage = useCallback(({ role, content, metadata, reports, type }: Chat) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                const lastMessage = updatedChatHistory[updatedChatHistory.length - 1];

                if (lastMessage.content !== content || lastMessage.metadata !== metadata || lastMessage.reports !== reports) {
                    lastMessage.content = content;
                    lastMessage.metadata = metadata;
                    lastMessage.reports = reports;
                    lastMessage.type = type;
                }

                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { type, role, content, metadata, reports }];
            }
        });
    }, []);

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
        addMessage({ role: 'user', content: input, metadata: null, type: "text" });
        setLoading(true)
        setStreamComplete(false)

        const history: { role: string; content: string }[] = chatHistory.map((chat) => { return { role: chat.role, content: chat.content } })
        const latestHistory = [...history, { role: "user", content: input }]

        try {
            if (responseType === "iresearcher-report") {
                setCurrentReportType("QUICK")
                await fetchQuickReport({ query: input, addMessage: addMessage })
            }

            if (responseType === "code-interpreter") {
                setCurrentReportType("INTERPRETER")
                await fetchCodeInterpreterResponse({ addMessage: addMessage, history: latestHistory, query: input })
            }

            if (responseType === "search") {
                setCurrentReportType("SEARCH")
                await fetchSearchResponse({ addMessage: addMessage, query: input, model: agentModel })
            }

            if (responseType === "news") {
                setCurrentReportType("NEWS")
                await fetchNewsResponse({ addMessage: addMessage, query: input, model: agentModel })
            }

            if (responseType === "coder") {
                setCurrentReportType("CODE")
                await fetchCoderResponse({ addMessage: addMessage, query: input, model: agentModel, userId: userId, conversationId: conversationId })
            }

            if (responseType === "document") {
                setCurrentReportType("DOCUMENT")
                await fetchDocumentResponse({ addMessage: addMessage, query: input, conversationId: conversationId })
            }

            if (responseType === "iresearcher-topics") {
                setCurrentReportType("RESEARCHERCHAT")
                await fetchResearcherTopics({ addMessage: addMessage, query: input })
            }

            if (responseType === "iresearcher-reports") {
                setCurrentReportType("RESEARCHERCHAT")
                await fetchResearcherReports({ addReports: addReports, query: input })
            }

        } catch (error) {
            console.error('Error:', error);
            addMessage({ role: 'assistant', content: 'Sorry, an error occurred while processing your request.', metadata: null, type: 'text' });
        } finally {
            setLoading(false)
            setStreamComplete(true)
        }
    };

    const chatData: ChatData = {
        chatHistory,
        loading,
        sendMessage,
        setChatHistory,
        setConversationId,
        setReportId,
        conversationId
    }
    return (
        <ChatContext.Provider value={chatData}>{children}</ChatContext.Provider>
    );
};
