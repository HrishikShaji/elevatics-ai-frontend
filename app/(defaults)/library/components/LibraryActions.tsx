import { useState, useRef, useEffect } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiDotsThreeOutlineVerticalThin } from "react-icons/pi";
import Link from "next/link";
import DeleteReport from "@/components/DeleteReport";
import IconPencil from "@/components/icon/icon-pencil";
import { useRouter } from "next/navigation";

interface LibraryActionsProps {
    id: string;
}

export default function LibraryActions({ id }: LibraryActionsProps) {
    const [actionsOpen, setActionsOpen] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);
    const router = useRouter()

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
            <button onClick={() => setActionsOpen(true)}><PiDotsThreeOutlineVerticalThin /></button>
            {actionsOpen ? (
                <div className="min-w-[150px]  flex flex-col bg-white shadow-gray-400 shadow-3xl divide-y-2 rounded-2xl overflow-hidden  absolute right-4 z-10">
                    <Link href={`${process.env.NEXT_PUBLIC_URL}/saved/${id}`} className="p-1 w-full text-left pl-4 hover:bg-gray-200">
                        View</Link>
                    <button className="p-1 w-full text-left pl-4 hover:bg-gray-200">
                        Edit
                    </button>
                    <DeleteReport id={id} />
                </div>
            ) : null}
        </div>
    );
}
