"use client"
import React from 'react';
import ReactMarkdown, { Components, ExtraProps } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { sampleReport, simpleReport } from './sampleReport';
import remarkGfm from 'remark-gfm';

const components: Components = {
    'ignore': ({ node, ...props }: ExtraProps) => {
        console.log(node.children)
        return (
            <div className='bg-blue-500' {...props} />
        );
    },
};

export default function Page() {

    return (
        <div className="h-screen w-full justify-center items-center">
            <ReactMarkdown
                components={components}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
            >
                {simpleReport}
            </ReactMarkdown>
        </div>
    );
}
