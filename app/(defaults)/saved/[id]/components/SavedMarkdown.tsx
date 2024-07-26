

import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import style from "../../../../../styles/markdown.module.css"

interface SavedMarkdownProps {
    content: string;
}

const SavedMarkdown = ({ content }: SavedMarkdownProps) => {


    return (
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className={style.markdown}>
            {content}
        </ReactMarkdown>
    );
};

export default SavedMarkdown;
