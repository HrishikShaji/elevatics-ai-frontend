"use client"

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import 'tailwindcss/tailwind.css';

// Initialize marked
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
});

const Coder = () => {
    const [userQuery, setUserQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedModel, setSelectedModel] = useState('meta-llama/llama-3-70b-instruct');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const apiKey = '44d5c2ac18ced6fc25c1e57dcd06fc0b31fb4ad97bf56e67540671a647465df4'; // Replace with your actual API key
    const conversationId = Date.now().toString(); // Simple unique ID for the conversation
    const userId = 'user_' + Math.random().toString(36).substr(2, 9); // Simple unique user ID

    const displayMessages = () => {
        // Scroll to the bottom of the chat container
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

        // Apply syntax highlighting to code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    };

    useEffect(() => {
        displayMessages();
    }, [chatHistory]);

    const addMessage = (role, content) => {
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

        addMessage('user', userQuery);
        setUserQuery('');

        try {
            const response = await fetch('https://pvanand-general-chat.hf.space/coding-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify({
                    user_query: userQuery,
                    model_id: selectedModel,
                    conversation_id: conversationId,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

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
                    addMessage('assistant', assistantResponse);
                    lastUpdateTime = Date.now();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('assistant', 'Sorry, an error occurred while processing your request.');
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col">
            <div className="container mx-auto p-4 flex-grow flex flex-col max-w-3xl">
                <h1 className="text-2xl font-bold mb-4 text-center">Coding Assistant</h1>
                <div ref={chatContainerRef} id="chat-container" className="flex-grow overflow-y-auto mb-4 space-y-4">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-gray-800' : 'bg-gray-700'}`}>
                            <span className="font-bold text-sm mb-2 inline-block">{message.role === 'user' ? 'You' : 'Assistant'}</span>
                            <div className="markdown-content text-gray-300" dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}></div>
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
                    <select
                        id="model-select"
                        className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                    >
                        <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B</option>
                        <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                        <option value="deepseek/deepseek-coder">DeepSeek Coder</option>
                        <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                        <option value="openai/gpt-3.5-turbo-instruct">GPT-3.5 Turbo</option>
                        <option value="qwen/qwen-72b-chat">Qwen 72B</option>
                        <option value="google/gemma-2-27b-it">Gemma 27B</option>
                    </select>
                    <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Coder;
