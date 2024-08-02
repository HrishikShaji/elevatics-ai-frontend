
"use client"
import React, { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';

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
            {children}
        </div>
    );
}
