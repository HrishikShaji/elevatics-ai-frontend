import useDeleteLibraryItem from "@/hooks/useDeleteLibraryItem"
import IconTrashLines from "./icon/icon-trash-lines"
import { AiOutlineDelete } from "react-icons/ai";
interface DeleteReportProps {
    id: string;
}

export default function DeleteReport({ id }: DeleteReportProps) {
    const { mutate, isPending } = useDeleteLibraryItem()
    return (
        <button className="p-1 w-full text-left  hover:bg-gray-200"
            onClick={() => mutate(id)}>
            <AiOutlineDelete />
        </button>
    )
}
