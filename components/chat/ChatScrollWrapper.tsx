"use client"
import useResizeObserver from '@/hooks/useResizeObserver';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface ChatScrollWrapperProps {
    children: ReactNode
}

export default function ChatScrollWrapper({ children }: ChatScrollWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isUserScrolling, setIsUserScrolling] = useState(false);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (atBottom) {
                setIsAtBottom(true);
                setIsUserScrolling(false);
            } else {
                setIsAtBottom(false);
                setIsUserScrolling(true);
            }
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToBottom = () => {
        if (isAtBottom && !isUserScrolling) {
            containerRef.current?.scrollTo({ left: 0, top: containerRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    const onResize = useCallback((target: HTMLDivElement) => {
        scrollToBottom();
    }, [isAtBottom, isUserScrolling]);

    const ref = useResizeObserver(onResize);

    return (
        <div ref={containerRef} className="custom-scrollbar w-full flex justify-center h-[calc(100vh_-_80px)] overflow-y-auto">
            <div ref={ref} className='h-fit '>
                {children}
            </div>
        </div>
    );
}
