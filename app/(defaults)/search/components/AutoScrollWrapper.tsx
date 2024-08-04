
"use client"
import useResizeObserver from '@/hooks/useResizeObserver';
import React, { ReactNode, useCallback, useRef } from 'react';

interface AutoScrollWrapperProps {
    children: ReactNode
}


export default function AutoScrollWrapper({ children }: AutoScrollWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        containerRef.current?.scrollTo({ left: 0, top: containerRef.current.scrollHeight, behavior: 'smooth' });
    };
    const onResize = useCallback((target: HTMLDivElement) => {
        scrollToBottom()
    }, []);

    const ref = useResizeObserver(onResize);




    return (
        <div ref={containerRef} className="custom-scrollbar  w-full flex justify-center  min-h-[40vh] max-h-[calc(100vh_-_160px)] overflow-y-auto">
            <div ref={ref} className='h-fit pb-5'>
                {children}
            </div>
        </div>
    );
}
