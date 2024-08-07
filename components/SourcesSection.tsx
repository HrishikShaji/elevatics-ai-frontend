
import React, { useEffect, useState, MouseEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SourceItemProps {
    content: string;
    url: string;
}

interface SourcesComponentProps {
    metadata: string;
}

const SourceItem: React.FC<SourceItemProps> = ({ content, url }) => {
    const snippet = content.length > 400 ? content.substring(0, 400) + '...' : content;
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = (e: MouseEvent<HTMLDivElement>) => {
        if (expanded) {
            if (e.clientY > (e.currentTarget.getBoundingClientRect().bottom - 20)) {
                setExpanded(false);
            }
        } else {
            setExpanded(true);
        }
    };

    return (
        <div
            className={`source-item ${expanded ? 'expanded' : ''} mb-4 p-4 border rounded-lg shadow-md cursor-pointer`}
            onClick={toggleExpand}
        >
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-url block font-bold mb-2 text-blue-500 underline"
                onClick={(e) => e.stopPropagation()}
            >
                {url}
            </a>
            <div className="source-content">
                <div className={`source-snippet ${expanded ? 'hidden' : 'block'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{snippet}</ReactMarkdown>
                </div>
                <div className={`source-full ${expanded ? 'block' : 'hidden'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
                <div className="expand-indicator mt-2 text-sm text-gray-500">
                    {expanded ? 'Click to collapse' : 'Click to expand'}
                </div>
            </div>
        </div>
    );
};

const SourcesSection: React.FC<SourcesComponentProps> = ({ metadata }) => {
    const [sources, setSources] = useState<{ content: string; url: string }[]>([]);

    useEffect(() => {
        const metadataMatch = metadata.match(/all-text-with-urls: (.+)/);
        if (metadataMatch) {
            const metadataObj = JSON.parse(metadataMatch[1]);
            setSources(metadataObj);
        }
    }, [metadata]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Sources</h2>
            <div id="sourcesContainer">
                {sources.map((source, index) => (
                    <SourceItem key={index} content={source[0]} url={source[1]} />
                ))}
            </div>
        </div>
    );
};

export default SourcesSection;
