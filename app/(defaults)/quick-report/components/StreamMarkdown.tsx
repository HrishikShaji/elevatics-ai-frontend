
import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import style from "../../../../styles/markdown.module.css"

interface StreamMarkdownProps {
    content: string;
    speed: number;
    setLineAdded: Dispatch<SetStateAction<boolean>>;
    onComplete: () => void;
    handleScroll: () => void;
    fullComplete: boolean;
    handleFullComplete: () => void;
}

const StreamMarkdown = ({ fullComplete, handleFullComplete, handleScroll, content, speed = 50, setLineAdded, onComplete }: StreamMarkdownProps) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [index, setIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (index < content.length) {
            const timeoutId = setTimeout(() => {
                const nextChar = content[index];
                setDisplayedContent((prev) => prev + nextChar);
                setIndex((prev) => prev + 1);
                if (nextChar === '\n') {
                    setLineAdded((prev) => !prev);
                }
            }, speed);

            return () => clearTimeout(timeoutId);
        } else if (!isComplete) {
            setIsComplete(true);
            onComplete();
            if (fullComplete) {
                handleFullComplete()
            }
        }
    }, [index, content, speed, isComplete, onComplete, setLineAdded]);

    useEffect(() => {
        handleScroll()
    }, [displayedContent]);

    return (
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className={style.markdown}>
            {displayedContent}
        </ReactMarkdown>
    );
};

export default StreamMarkdown;
