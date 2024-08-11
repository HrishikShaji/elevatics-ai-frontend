

"use client"
import useResizeObserver from '@/hooks/useResizeObserver';
import React, { ReactNode, useCallback, useRef } from 'react';

interface ChatScrollWrapperProps {
    children: ReactNode
}


export default function ChatScrollWrapper({ children }: ChatScrollWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        containerRef.current?.scrollTo({ left: 0, top: containerRef.current.scrollHeight, behavior: 'smooth' });
    };
    const onResize = useCallback((target: HTMLDivElement) => {
        scrollToBottom()
    }, []);

    const ref = useResizeObserver(onResize);
    return (
        <div ref={containerRef} className="custom-scrollbar  w-full flex justify-center   h-[calc(100vh_-_80px)] overflow-y-auto">
            <div ref={ref} className='h-fit '>
                {children}
            </div>
        </div>
    );
}
