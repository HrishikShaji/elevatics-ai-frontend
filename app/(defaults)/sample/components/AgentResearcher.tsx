"use client"

import React, { useState } from 'react';
import ReportContainer from './ReportContainer';
import SourcesContainer from './SourcesContainer';

export default function AgentResearcher() {
    const [description, setDescription] = useState('nvidia stock performance');
    const [report, setReport] = useState('');
    const [sources, setSources] = useState<[string, string][]>([]);

    const generateReport = async () => {
        setReport('Generating report...');
        setSources([]);

        try {
            const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({
                    description,
                    user_id: "test",
                    user_name: "John Doe",
                    internet: true,
                    output_format: "report_table",
                    data_format: "Structured data",
                    generate_charts: true,
                    output_as_md: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.body) {

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let markdown = '';
                let metadata = '';
                let isReadingMetadata = false;

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });

                    if (chunk.includes('<report-metadata>')) {
                        isReadingMetadata = true;
                        metadata = '';
                    }

                    if (isReadingMetadata) {
                        metadata += chunk;
                        if (chunk.includes('</report-metadata>')) {
                            isReadingMetadata = false;
                            processMetadata(metadata);
                        }
                    } else {
                        markdown += chunk;
                        renderMarkdown(markdown);
                    }
                }
            }
        } catch (error) {
            setReport(`Error generating report`);
        }
    };

    const renderMarkdown = (markdown: string) => {
        const reportContent = markdown.match(/<report>([\s\S]*)<\/report>/);

        if (reportContent) {
            setReport(reportContent[1]);
        } else {
            setReport(markdown);
        }
    };

    const processMetadata = (metadata: string) => {
        const metadataMatch = metadata.match(/all-text-with-urls: (.+)/);

        if (metadataMatch) {
            const metadataObj = JSON.parse(metadataMatch[1]);
            setSources(metadataObj);
        } else {
            setSources([]);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full p-2 mb-2 border border-gray-300"
                />
                <button onClick={generateReport} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700">
                    Generate Report
                </button>
            </div>
            <div className="flex">
                <ReportContainer report={report} />
                <SourcesContainer sources={sources} />
            </div>
        </div>
    );
};

