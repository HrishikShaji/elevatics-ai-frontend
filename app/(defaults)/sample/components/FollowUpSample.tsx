"use client"
import { FOLLOWUP_AGENT_API_KEY, FOLLOWUP_AGENT_URL } from "@/lib/endpoints";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";

export default function FollowUpSample() {
    const [messages, setMessages] = useState<Array<any>>([]);
    const [userInput, setUserInput] = useState("");
    const [conversationId, setConversationId] = useState(uuidv4());
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        setMessages([...messages, { type: "user", content: userInput }]);
        const message = userInput;
        setUserInput("");

        try {
            const response = await fetch(FOLLOWUP_AGENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": FOLLOWUP_AGENT_API_KEY
                },
                body: JSON.stringify({
                    query: message,
                    model_id: "openai/gpt-4o-mini",
                    conversation_id: conversationId,
                    user_id: "string"
                })
            });

            const reader = response.body?.getReader();
            let rawResponse = "";
            let streamingIndex = messages.length;

            setMessages((prevMessages) => [
                ...prevMessages,
                { type: "bot", content: "Thinking..." }
            ]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = new TextDecoder().decode(value);
                    rawResponse += chunk;
                    setMessages((prevMessages) =>
                        prevMessages.map((msg, i) =>
                            i === streamingIndex ? { type: "bot", content: rawResponse } : msg
                        )
                    );
                }
            }

            const jsonStart = rawResponse.lastIndexOf("\n\n");
            if (jsonStart !== -1) {
                const jsonStr = rawResponse.slice(jsonStart + 2);
                const parsedResponse = JSON.parse(jsonStr);
                renderParsedResponse(parsedResponse);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages([...messages, { type: "bot", content: "An error occurred while processing your request." }]);
        }
        scrollToBottom();
    };

    const renderParsedResponse = async (parsedResponse: any) => {
        let botResponse = "";
        let responseForAudio = "";
        let metadata = "";

        if (parsedResponse.response) {
            botResponse += parsedResponse.response + "\n\n";
            responseForAudio = parsedResponse.response.replace(/#/g, "");
        }

        if (parsedResponse.clarification) {
            parsedResponse.clarification.forEach((item: any, questionIndex: number) => {
                metadata += `**${item.question}**\n\n`;
                metadata += `<div class="option-buttons">`;
                item.options.forEach((option: string, optionIndex: number) => {
                    const escapedOption = option.replace(/'/g, "\\'");
                    metadata += `<button class="option-button" onClick={() => toggleOption('${escapedOption}', ${questionIndex}, ${optionIndex})}>${option}</button>`;
                });
                metadata += `</div>\n\n`;
            });
        }

        if (botResponse) {
            setMessages([...messages, { type: "bot", content: botResponse, audio: null, metadata: metadata }]);
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md flex flex-col h-screen">
                <div ref={messageContainerRef} className="flex-grow overflow-y-auto p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message mb-4 p-4 rounded-lg ${message.type === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-100 text-black"
                                }`}
                        >
                            <ReactMarkdown>{message.metadata}</ReactMarkdown>
                            <ReactMarkdown rehypePlugins={[]}>{message.content}</ReactMarkdown>
                        </div>
                    ))}
                </div>
                <div className="flex items-center p-4 bg-white border-t">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border rounded-full focus:outline-none"
                    />
                    <button onClick={sendMessage} className="ml-4 bg-blue-500 text-white rounded-full p-2">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};


