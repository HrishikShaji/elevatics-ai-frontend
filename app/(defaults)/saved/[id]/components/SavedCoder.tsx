
"use client"

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettings } from '@/contexts/SettingsContext';
import useSaveReport from '@/hooks/useSaveReport';

type Chat = {
    content: string;
    role: "assistant" | "user";
}

interface SavedCoderProps {
    history: string;
    id: string;
}

const SavedCoder = ({ history, id }: SavedCoderProps) => {
    const [userQuery, setUserQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const { agentModel } = useSettings();
    const [conversationId, setConverstionId] = useState("");
    const [userId, setUserId] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const apiKey = process.env.NEXT_PUBLIC_CODER_API_KEY;
    const [streamComplete, setStreamComplete] = useState(false);
    const [reportId, setReportId] = useState("");

    const { mutate, isSuccess, data } = useSaveReport();

    useEffect(() => {
        const parsedData = JSON.parse(history)
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        setUserId(userId);
        setChatHistory(parsedData.chatHistory)
        setConverstionId(parsedData.conversationId);
        setReportId(id)
    }, [history, id]);

    const displayMessages = () => {
        // Scroll to the bottom of the chat container
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (isSuccess && data.id) {
            setReportId(data.id);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (streamComplete) {
            mutate({
                name: chatHistory[0].content,
                report: JSON.stringify({ chatHistory: chatHistory, conversationId: conversationId }),
                reportId: reportId,
                reportType: "CODE"
            });
        }
    }, [streamComplete, reportId, chatHistory, conversationId]);

    useEffect(() => {
        displayMessages();
    }, [chatHistory]);

    const addMessage = ({ role, content }: { role: "user" | "assistant", content: string }) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                // Update the last assistant message if it's a continuation
                const updatedChatHistory = [...prevChatHistory];
                updatedChatHistory[updatedChatHistory.length - 1].content = content;
                return updatedChatHistory;
            } else {
                // Add a new message to the history
                return [...prevChatHistory, { role, content }];
            }
        });
    };

    const sendMessage = async () => {
        if (!userQuery.trim()) return;

        setStreamComplete(false);
        addMessage({ role: 'user', content: userQuery });
        setUserQuery('');

        try {
            const response = await fetch('https://pvanand-general-chat.hf.space/coding-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey || "",
                },
                body: JSON.stringify({
                    user_query: userQuery,
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

                    // Update the message every 100ms or when the stream is complete
                    if (Date.now() - lastUpdateTime > 100 || done) {
                        addMessage({ role: 'assistant', content: assistantResponse });
                        lastUpdateTime = Date.now();
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage({ role: 'assistant', content: 'Sorry, an error occurred while processing your request.' });
        } finally {
            setStreamComplete(true);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="container mx-auto p-4 flex-grow flex flex-col max-w-3xl">
                <div ref={chatContainerRef} id="chat-container" className="flex-grow max-h-[70vh] overflow-y-auto mb-4 space-y-4">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-gray-800' : 'bg-gray-700'}`}>
                            <span className="font-bold text-sm mb-2 inline-block">{message.role === 'user' ? 'You' : 'Assistant'}</span>
                            <div className="markdown-content text-gray-300">
                                <ReactMarkdown
                                    children={message.content}
                                    components={{
                                        code({ node, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return match ? (
                                                <SyntaxHighlighter
                                                    style={dracula}
                                                    language={match[1]}
                                                    PreTag="div"
                                                >{String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        id="user-input"
                        type="text"
                        placeholder="Ask a coding question..."
                        className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded text-white"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavedCoder;
