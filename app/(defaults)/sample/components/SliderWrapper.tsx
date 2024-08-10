import { ReactNode, useEffect, useRef, useState } from "react";
import { RefObject } from "@fullcalendar/core/preact";

interface SliderWrapperProps {
    children: ReactNode;
}

export default function SliderWrapper({ children }: SliderWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    function scrollLeft(ref: RefObject<HTMLDivElement>) {
        if (ref.current) {
            ref.current.scrollBy({
                left: -300,
                behavior: "smooth",
            });
        }
    }

    function scrollRight(ref: RefObject<HTMLDivElement>) {
        if (ref.current) {
            ref.current.scrollBy({
                left: 300,
                behavior: "smooth",
            });
        }
    }
    return (
        <div className="flex py-1 pb-3 justify-between w-full overflow-hiiden">
            <button
                onClick={() => scrollLeft(containerRef)}
                className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
            >
                {"<"}
            </button>
            <div className='w-[630px]  flex gap-2 overflow-hidden' ref={containerRef}>
                {children}
            </div>
            <button
                onClick={() => scrollRight(containerRef)}
                className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
            >
                {">"}
            </button>
        </div>
    )

}
