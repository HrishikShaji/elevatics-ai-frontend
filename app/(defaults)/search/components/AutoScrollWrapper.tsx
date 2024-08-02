
"use client"
import useResizeObserver from '@/hooks/useResizeObserver';
import React, { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface AutoScrollWrapperProps {
    children: ReactNode
}


export default function AutoScrollWrapper({ children }: AutoScrollWrapperProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        containerRef.current?.scrollTo({ left: 0, top: containerRef.current.scrollHeight, behavior: 'smooth' });
    };
    const onResize = useCallback((target: HTMLDivElement) => {
        console.log(target.clientHeight)
        scrollToBottom()
    }, []);

    const ref = useResizeObserver(onResize);

    useEffect(() => {
        if (contentRef.current) {
            const currentHeight = contentRef.current.clientHeight;
            if (currentHeight !== contentHeight) {
                console.log("ran")
                setContentHeight(currentHeight);
                scrollToBottom();
            }
        }
    }, [contentHeight]);



    return (
        <div ref={containerRef} className="custom-scrollbar  w-full flex justify-center  max-h-[50vh] overflow-y-auto">
            <div ref={ref} className='w-[800px] p-5 h-full rounded-3xl bg-gray-200'>
                {children}
            </div>
        </div>
    );
}
