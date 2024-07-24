import useDeleteLibraryItem from "@/hooks/useDeleteLibraryItem"
import IconTrashLines from "./icon/icon-trash-lines"

interface DeleteReportProps {
    id: string;
}

export default function DeleteReport({ id }: DeleteReportProps) {
    const { mutate, isPending } = useDeleteLibraryItem()
    return (

        <button onClick={() => mutate(id)}>
            {isPending ? "Deleting..." :
                <IconTrashLines />}
        </button>
    )
}
