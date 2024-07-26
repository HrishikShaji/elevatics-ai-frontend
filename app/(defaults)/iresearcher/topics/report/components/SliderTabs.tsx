
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react"

interface SliderTabsProps {
    options: Record<string, any>[];
    setSelectedTopic: Dispatch<SetStateAction<string>>;
}


export default function SliderTabs({ options, setSelectedTopic }: SliderTabsProps) {

    const [currentIndex, setCurrentIndex] = useState(0)

    const containerRef = useRef<HTMLDivElement>(null)

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
    const handlePageChange = ({ page, parentKey }: { page: number, parentKey: string }) => {
        setCurrentIndex(page);
        setSelectedTopic(parentKey)
    };


    return (
        <div className="p-10">
            <div className="relative flex w-full items-center ">
                <button
                    onClick={() => scrollLeft(containerRef)}
                    className="absolute size-6 flex items-center justify-center -left-10 hover:bg-gray-200 rounded-full"
                >
                    {"<"}
                </button>
                <div
                    className="flex gap-4 overflow-x-hidden  rounded-2xl border-gray-300 h-[50px]"
                    ref={containerRef}
                >
                    {options.map((group: any, i: number) => (
                        <div
                            key={i}
                            onClick={() => handlePageChange({ page: i, parentKey: group.parentKey })}
                            className="w-full justify-center rounded-2xl cursor-pointer h-full flex items-center  relative group"
                            style={{
                                backgroundColor: currentIndex === i ? "#000000" : "#f3f4f6",
                                // borderColor: currentIndex === i ? "#2A42CB" : "white",
                            }}
                        >
                            <div
                                className="px-10 text-center whitespace-nowrap"
                                style={{ color: currentIndex === i ? "#FFFFFF" : "#7F7F7F" }}
                            >
                                {group.parentKey}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => scrollRight(containerRef)}
                    className="absolute size-6 flex items-center justify-center -right-10  hover:bg-gray-200 rounded-full"
                >
                    {">"}
                </button>
            </div>
        </div>
    );
}
