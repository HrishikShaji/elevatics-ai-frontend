
import React from 'react';
import SourceItem from './SourceItem';

interface SourcesContainerProps {
    sources: [string, string][];
}

const SourcesContainer: React.FC<SourcesContainerProps> = ({ sources }) => {
    return (
        <div id="sources-container" className="w-2/5 p-4 bg-gray-100">
            <h2 className="text-lg font-bold mb-4">Sources</h2>
            {sources.length > 0 ? (
                sources.map(([content, url], index) => (
                    <SourceItem key={index} content={content} url={url} />
                ))
            ) : (
                <p>No source information available.</p>
            )}
        </div>
    );
};

export default SourcesContainer;
