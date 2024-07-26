import useDownloadPdf from "@/hooks/useDownloadPdf"

interface DownloadPdfButtonProps {
    htmlArray: string[][];
    prompt: string;
}

export default function DownloadPdfButton({ htmlArray, prompt }: DownloadPdfButtonProps) {
    const { mutate, isPending } = useDownloadPdf()

    return <button className="py-2 px-3 rounded-md bg-gray-100 " onClick={() => mutate({ htmlArray, prompt })} >{isPending ? "Downloading..." : "Download"}</button>
}
