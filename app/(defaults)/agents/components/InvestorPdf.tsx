

"use client"

import { useState, useEffect } from "react"
import { AiOutlineDownload } from "react-icons/ai"

interface InvestorPdfProps {
    name: string;
    data: any;
}

export default function InvestorPdf({ name, data }: InvestorPdfProps) {
    const [loading, setLoading] = useState(false)

    async function downloadPdf() {
        try {
            setLoading(true)
            const response = await fetch("https://nithin1905-pdf.hf.space/generate_pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                const replacedName = name.replace(".pdf", "")
                a.href = url;

                a.download = `${replacedName}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                const result = await response.json()
                console.log(result)
                console.error("Failed to generate PDF");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <button
            className="text-sm sm:bg-[#f9f8fb] flex text-gray-500 hover:bg-gray-100 gap-2 rounded-md sm:p-2 items-center justify-center sm:w-[120px]"
            onClick={downloadPdf}>
            <AiOutlineDownload size={25} /><span className="hidden sm:block">Download</span>
        </button>
    )
}
