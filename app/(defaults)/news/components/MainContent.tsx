
import React from 'react';

export default function MainContent({ sidebarCollapsed, query, setQuery, selectedModel, setSelectedModel, submitForm, isLoading, renderedReport }) {
    const models = [
        "meta-llama/llama-3-70b-instruct",
        "anthropic/claude-3.5-sonnet",
        "deepseek/deepseek-coder",
        "anthropic/claude-3-haiku",
        "openai/gpt-3.5-turbo-instruct",
        "qwen/qwen-72b-chat",
        "google/gemma-2-27b-it"
    ];

    return (
        <main className={`main-content flex-grow p-5 transition-all duration-300 ${sidebarCollapsed ? 'ml-5' : 'ml-[250px]'}`}>
            <div className="content-wrapper max-w-4xl mx-auto">
                <h1 className="text-center text-gray-700 mb-4">Where knowledge begins</h1>

                <form onSubmit={submitForm} className="flex mb-8">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Ask anything..."
                        required
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-l-md shadow-md"
                    />
                    <button type="submit" disabled={isLoading} className="p-3 bg-blue-600 text-white rounded-r-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Loading...' : 'Search'}
                    </button>
                </form>

                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full mb-4 p-2 border border-gray-300 rounded-md bg-gray-50">
                    {models.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </select>

                {isLoading && <div className="spinner mx-auto my-5 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin"></div>}

                {renderedReport && (
                    <div id="report-container" className="bg-white border border-gray-300 rounded-md p-6 mt-6 shadow-md" dangerouslySetInnerHTML={{ __html: renderedReport }}></div>
                )}
            </div>
        </main>
    );
}
