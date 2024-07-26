
"use client"

import React from 'react';
import ReactMarkdown from 'react-markdown';


interface SavedNewsProps {
    report: string;
    name: string;
}

export default function SavedNews({ report, name }: SavedNewsProps) {
    const parsedData = JSON.parse(report)

    return (
        <main className="main-content flex-grow p-5 transition-all duration-300">
            <div className="content-wrapper max-w-4xl mx-auto">

                <div id="report-container" className="h-[60vh] overflow-y-scroll bg-white border border-gray-300 rounded-md p-6 mt-6 shadow-md">
                    <ReactMarkdown
                        children={parsedData}
                    />
                </div>
            </div>
        </main>
    );
}
