
"use client"

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, dracula, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettings } from '@/contexts/SettingsContext';
import useSaveReport from '@/hooks/useSaveReport';
import { PiRocketLaunchThin } from 'react-icons/pi';

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

    console.log(conversationId)
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

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault()
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
        <div className="h-[(100vh_-_40px)] flex flex-col">
            <div className="container mx-auto  flex-grow flex flex-col items-center w-full ">
                <div ref={chatContainerRef} id="chat-container" style={{ scrollbarGutter: "stable" }} className="custom-scrollbar  flex w-full justify-center min-h-[40vh] max-h-[80vh] overflow-y-auto mb-4 space-y-4">
                    <div className='w-[800px] flex flex-col gap-4 py-10'>
                        {chatHistory.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? "justify-end" : "justify-start"}`}>
                                <div key={index} className={` px-10 rounded-lg ${message.role === 'user' ? 'py-4 bg-gray-200 rounded-t-3xl rounded-l-3xl ' : 'py-10 bg-gray-200 rounded-b-3xl rounded-r-3xl'}`}>
                                    <div className="markdown-content text-black">
                                        <ReactMarkdown
                                            children={message.content}
                                            components={{
                                                code({ node, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return match ? (
                                                        <SyntaxHighlighter
                                                            customStyle={{ padding: "20px", borderRadius: "24px" }}
                                                            style={materialLight}
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
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[800px]  bg-white flex-grow-0  rounded-3xl dark:bg-neutral-700 overflow-hidden border-gray-200 border-2 shadow-lg focus:outline-gray-300  flex flex-col ">
                    <form onSubmit={sendMessage} className=" relative  flex items-center justify-center  ">
                        <input
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="What's on your mind..."
                            className="   pr-28  bg-white focus:outline-none p-4 w-full"
                        />{" "}

                        <button
                            type='submit'
                            className="text-gray-400 hover:bg-gray-300 hover:scale-125 duration-500 absolute glow p-2 group cursor-pointer rounded-full bg-gray-100  right-2 "
                        >
                            <PiRocketLaunchThin size={20} className="text-gray-500 group-hover:text-white duration-500" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SavedCoder;
