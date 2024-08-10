

"use client";

import { useSettings } from "@/contexts/SettingsContext";
import useSaveReport from "@/hooks/useSaveReport";
import { CODING_ASSISTANT_API_KEY, CODING_ASSISTANT_URL } from "@/lib/endpoints";
import { Chat } from "@/types/types";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
} from "react";

interface CoderData {
    sendMessage: (input: string) => void;
    chatHistory: Chat[]
    loading: boolean;
}

export const CoderContext = createContext<CoderData | undefined>(undefined);

export const useCoder = () => {
    const context = useContext(CoderContext);
    if (!context) {
        throw new Error("useCoder must be used within a CoderProvider");
    }
    return context;
};

type CoderProviderProps = {
    children: ReactNode;
};

export const CoderProvider = ({ children }: CoderProviderProps) => {

    const { agentModel } = useSettings();
    const [conversationId, setConverstionId] = useState("");
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
        const conversationId = Date.now().toString();
        setUserId(userId);
        setConverstionId(conversationId);
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

    const sendMessage = async (input: string) => {
        addMessage({ role: 'user', content: input, metadata: null });
        setLoading(true)
        setStreamComplete(false)
        try {
            const response = await fetch(CODING_ASSISTANT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': CODING_ASSISTANT_API_KEY || "",
                },
                body: JSON.stringify({
                    user_query: input,
                    model_id: agentModel,
                    conversation_id: conversationId,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantResponse = '';
                let lastUpdateTime = Date.now();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    assistantResponse += chunk;

                    if (Date.now() - lastUpdateTime > 100 || done) {
                        addMessage({ role: 'assistant', content: assistantResponse, metadata: null });
                        lastUpdateTime = Date.now();
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage({ role: 'assistant', content: 'Sorry, an error occurred while processing your request.', metadata: null });
        } finally {
            setLoading(false)
            setStreamComplete(true)
        }
    };

    const coderData: CoderData = {
        chatHistory,
        loading,
        sendMessage
    }
    return (
        <CoderContext.Provider value={coderData}>{children}</CoderContext.Provider>
    );
};
