import useDownloadPdf from "@/hooks/useDownloadPdf"

interface DownloadPdfButtonProps {
    htmlArray: string[][];
    prompt: string;
}

export default function DownloadPdfButton({ htmlArray, prompt }: DownloadPdfButtonProps) {
    const { mutate, isPending } = useDownloadPdf()

    return <button onClick={() => mutate({ htmlArray, prompt })} >{isPending ? "Downloading..." : "Download"}</button>
}
