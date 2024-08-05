
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface SourceItemProps {
    content: string;
    url: string;
}

const SourceItem: React.FC<SourceItemProps> = ({ content, url }) => {
    const [expanded, setExpanded] = useState(false);
    const snippet = content.length > 400 ? content.substring(0, 400) + '...' : content;

    const toggleExpand = (e: React.MouseEvent) => {
        if (e.clientY > (e.currentTarget as HTMLElement).getBoundingClientRect().bottom - 20) {
            setExpanded(!expanded);
        }
    };

    return (
        <div className={`source-item ${expanded ? 'expanded' : ''}`} onClick={toggleExpand}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="source-url text-blue-600 font-bold mb-2 block">
                {url}
            </a>
            <div className="source-content relative">
                <div className="source-snippet" style={{ display: expanded ? 'none' : 'block' }}>
                    <ReactMarkdown>{snippet}</ReactMarkdown>
                </div>
                <div className="source-full" style={{ display: expanded ? 'block' : 'none' }}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                <div className="expand-indicator absolute bottom-0 left-0 right-0 h-5 bg-black bg-opacity-10 flex items-center justify-center">
                    <span className="text-sm text-gray-500">{expanded ? '▲' : '▼'}</span>
                </div>
            </div>
        </div>
    );
};

export default SourceItem;
