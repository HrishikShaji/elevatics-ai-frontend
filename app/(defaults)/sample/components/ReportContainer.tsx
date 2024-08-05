
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ReportContainerProps {
    report: string;
}

const ReportContainer: React.FC<ReportContainerProps> = ({ report }) => {
    return (
        <div id="report-container" className="w-3/5 p-4 border-r border-gray-300">
            <ReactMarkdown>{report}</ReactMarkdown>
        </div>
    );
};

export default ReportContainer;
