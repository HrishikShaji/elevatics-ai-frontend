
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
        <main className=" h-[calc(100vh_-_40px)]   w-full transition-all duration-300">
            <div id="report-container" className="min-h-[40vh] custom-scrollbar py-10 flex justify-center max-h-[90vh] overflow-y-auto bg-white w-full">
                <div className='w-[800px] bg-gray-200 rounded-3xl p-10 h-full'>
                    <ReactMarkdown
                        children={parsedData}
                    />
                </div>
            </div>
        </main>
    );
}
