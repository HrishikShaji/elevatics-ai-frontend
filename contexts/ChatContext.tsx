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
import uploadDocuments from '@/lib/uploadDocuments';
import fetchCareerRepsonse from '@/lib/fetchCareerResponse';
import fetchFollowUpResponse from '@/lib/fetchFollowUpResponse';
import { useAccount } from './AccountContext';

interface ChatData {
    sendMessage: ({ input, responseType }: { input: string, responseType: ChatType }) => void;
    uploadFile: (responseType: ChatType) => void;
    chatHistory: Chat[];
    loading: boolean;
    setConversationId: Dispatch<SetStateAction<string>>;
    setChatHistory: Dispatch<SetStateAction<Chat[]>>;
    setReportId: Dispatch<SetStateAction<string>>;
    conversationId: string;
    selectedFiles: File[];
    setSelectedFiles: Dispatch<SetStateAction<File[]>>;
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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false)
    const { currentFingerPrint, profile, incrementNonLoggedInUsage, updateQueryLimit } = useAccount()

    console.log("current usage", currentFingerPrint?.usage, "user id", profile?.id)

    const { mutate, isSuccess, data } = useSaveReport();
    useEffect(() => {
        if (isSuccess && data.id) {
            setReportId(data.id);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (streamComplete && currentReportType !== null && profile?.id) {
            console.log("ran saving")
            mutate({
                name: chatHistory[0].content,
                report: JSON.stringify({ chatHistory: chatHistory, conversationId: conversationId }),
                reportId: reportId,
                reportType: currentReportType
            });
        }
    }, [streamComplete, profile?.id]);

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


    const uploadFile = async (responseType: ChatType) => {

        if (responseType === "career") {
            addMessage({ role: 'user', content: "uploaded resume", metadata: null, type: "career" });
            addMessage({ role: 'assistant', content: "resume specs", metadata: null, type: "career-question" });
        }

        try {
            if (responseType === "document") {
                await uploadDocuments({ conversationId: conversationId, selectedFiles: selectedFiles })
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage({ role: 'assistant', content: 'Sorry, an error occurred while processing your request.', metadata: null, type: 'text' });
        } finally {

            if (responseType === "document") {
                addMessage({ role: 'user', content: "uploaded documind", metadata: null, type: "document" });
            }
        }
    }

    const sendMessage = async ({ input, responseType }: { input: string, responseType: ChatType }) => {
        setLoading(true)
        setStreamComplete(false)
        if (!profile?.id) {
            incrementNonLoggedInUsage()
        } else {
            updateQueryLimit()
        }

        if (responseType === "career") {
            addMessage({ role: 'assistant', content: "resume specs", metadata: null, type: "career-question" });
        }


        try {
            if (responseType === "iresearcher-report") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("QUICK")
                await fetchQuickReport({ query: input, addMessage: addMessage })
            }

            if (responseType === "code-interpreter") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("INTERPRETER")
                await fetchCodeInterpreterResponse({ addMessage: addMessage, conversationId: conversationId, query: input })
            }

            if (responseType === "search") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("SEARCH")
                await fetchSearchResponse({ addMessage: addMessage, query: input, model: agentModel })
            }

            if (responseType === "news") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("NEWS")
                await fetchNewsResponse({ addMessage: addMessage, query: input, model: agentModel })
            }

            if (responseType === "coder") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("CODE")
                await fetchCoderResponse({ addMessage: addMessage, query: input, model: agentModel, userId: userId, conversationId: conversationId })
            }

            if (responseType === "document") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("DOCUMENT")
                await fetchDocumentResponse({ addMessage: addMessage, query: input, conversationId: conversationId })
            }

            if (responseType === "iresearcher-topics") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                setCurrentReportType("RESEARCHERCHAT")
                await fetchResearcherTopics({ addMessage: addMessage, query: input })
            }

            if (responseType === "iresearcher-reports") {
                setCurrentReportType("RESEARCHERCHAT")
                await fetchResearcherReports({ addReports: addReports, query: input })
            }

            if (responseType === "career-answer") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                const parsedInput = JSON.parse(input)
                await fetchCareerRepsonse({ addMessage: addMessage, resume: selectedFiles[0] ? selectedFiles[0] : null, jobDescription: parsedInput.jobDescription, jobDescriptionUrl: parsedInput.jobDescriptionUrl, resumeText: parsedInput.resumeText })
            }

            if (responseType === "followup") {
                addMessage({ role: 'user', content: input, metadata: null, type: "text" });
                await fetchFollowUpResponse({ addMessage: addMessage, conversationId: conversationId, query: input })
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
        conversationId,
        selectedFiles,
        setSelectedFiles,
        uploadFile
    }
    return (
        <ChatContext.Provider value={chatData}>{children}</ChatContext.Provider>
    );
};
