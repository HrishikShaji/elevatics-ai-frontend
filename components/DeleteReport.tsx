import useDeleteLibraryItem from "@/hooks/useDeleteLibraryItem"
import IconTrashLines from "./icon/icon-trash-lines"

interface DeleteReportProps {
    id: string;
}

export default function DeleteReport({ id }: DeleteReportProps) {
    const { mutate, isPending } = useDeleteLibraryItem()
    return (
        <button className="p-1 w-full text-left pl-4 hover:bg-gray-200"
            onClick={() => mutate(id)}>
            {isPending ? "Deleting..." :
                "Delete"}
        </button>
    )
}
