import { IRESEARCHER_PDF } from "@/lib/endpoints";
import { useMutation } from "@tanstack/react-query";

async function downloadResearcherPdf({
    htmlArray,
    prompt,
}: {
    htmlArray: string[][];
    prompt: string;
}) {
    const response = await fetch(IRESEARCHER_PDF, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: prompt, htmls: htmlArray }),
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${prompt}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } else {
        const result = await response.json()
        console.log(result)
        console.error("Failed to generate PDF");
    }
}

export default function useDownloadPdf() {
    return useMutation({ mutationFn: downloadResearcherPdf })
}
