


"use client";
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { useSettings } from "@/contexts/SettingsContext";
import useSaveReport from "@/hooks/useSaveReport";
import { CODING_ASSISTANT_API_KEY, CODING_ASSISTANT_URL, DOCUMIND_RESPONSE } from "@/lib/endpoints";
import { Chat } from "@/types/types";
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
import fetchDocumentResponse from '../lib/fetchDocumentResponse';

interface DocumentData {
    sendMessage: ({ input, agent }: { input: string, agent: string }) => void;
    chatHistory: Chat[];
    loading: boolean;
    setConversationId: Dispatch<SetStateAction<string>>;
    setChatHistory: Dispatch<SetStateAction<Chat[]>>;
    setReportId: Dispatch<SetStateAction<string>>;
    conversationId: string;
}

export const DocumentContext = createContext<DocumentData | undefined>(undefined);

export const useDocument = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error("useDocument must be used within a DocumentProvider");
    }
    return context;
};

type DocumentProviderProps = {
    children: ReactNode;
};

export const DocumentProvider = ({ children }: DocumentProviderProps) => {

    const { agentModel } = useSettings();
    const [conversationId, setConversationId] = useState("");
    const [userId, setUserId] = useState("");
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(false)
    const [reportId, setReportId] = useState("")
    const [streamComplete, setStreamComplete] = useState(false)

    const { mutate, isSuccess, data } = useSaveReport();
    useEffect(() => {
        if (isSuccess && data.id) {
            setReportId(data.id);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (streamComplete) {
            console.log("ran saving")
            mutate({
                name: chatHistory[0].content,
                report: JSON.stringify({ chatHistory: chatHistory, conversationId: conversationId }),
                reportId: reportId,
                reportType: "CODE"
            });
        }
    }, [streamComplete]);

    useEffect(() => {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        const conversationID = uuidv4();
        setConversationId(conversationID)
        setUserId(userId);
    }, []);

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

    const sendMessage = async ({ input, agent }: { input: string, agent: string }) => {
        addMessage({ role: 'user', content: input, metadata: null });
        setLoading(true)
        setStreamComplete(false)
        try {
            await fetchDocumentResponse({ addMessage: addMessage, query: input, conversationId: conversationId })
        } catch (error) {
            console.error('Error:', error);
            addMessage({ role: 'assistant', content: 'Sorry, an error occurred while processing your request.', metadata: null });
        } finally {
            setLoading(false)
            setStreamComplete(true)
        }
    };

    const documentData: DocumentData = {
        chatHistory,
        loading,
        sendMessage,
        setChatHistory,
        setConversationId,
        setReportId,
        conversationId
    }
    return (
        <DocumentContext.Provider value={documentData}>{children}</DocumentContext.Provider>
    );
};
