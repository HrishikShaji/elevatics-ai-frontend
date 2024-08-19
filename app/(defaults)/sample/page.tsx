import React from 'react';
import ReactMarkdown, { Components, ExtraProps } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { sampleReport } from './sampleReport';
import { visit } from 'unist-util-visit';

function rehypeIgnoreMarkdown() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'ignore-markdown') {
                // Ensure the node type and children remain unchanged
                node.data = { ...node.data, hName: 'ignore-markdown' };
            }
        });
    };
}
const components: Components = {
    'ignore-markdown': ({ node, ...props }: ExtraProps) => {
        console.log('This is ignored:', node?.children);

        return (
            <div>
                {node?.children.map((child: any, index: number) => (
                    <div key={index}>{child.value || JSON.stringify(child)}</div>
                ))}
            </div>
        );
    },
    // Other custom components...
};

export default function Page() {

    return (
        <div className="h-screen w-full justify-center items-center">
            <ReactMarkdown
                components={components}
                rehypePlugins={[rehypeRaw, rehypeIgnoreMarkdown]}
            >
                {sampleReport}
            </ReactMarkdown>
        </div>
    );
}
