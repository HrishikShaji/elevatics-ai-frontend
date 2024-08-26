import { useState, useRef, useEffect } from "react";
import { PiDotsThreeOutlineVerticalThin } from "react-icons/pi";
import Link from "next/link";
import DeleteReport from "@/components/DeleteReport";

import { MdEdit } from "react-icons/md";

interface LibraryActionsProps {
    id: string;
}

export default function LibraryActions({ id }: LibraryActionsProps) {
    const [actionsOpen, setActionsOpen] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
            setActionsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative mx-auto flex w-max  items-center " ref={actionsRef}>
            <div className="flex gap-5">
                <button className="p-1 w-full text-left pl-4 hover:bg-gray-200">
                    <MdEdit />
                </button>
                <DeleteReport id={id} />
            </div>
        </div>
    );
}
