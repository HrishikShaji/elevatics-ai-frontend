"use client"

import { useQuickReport } from "@/contexts/QuickReportContext"
import useFetchQuickReport from "@/hooks/useFetchQuickReport"
import RenderReport from "./RenderReport"

export default function QuickReport() {
    const { prompt } = useQuickReport()
    const { data, loading, error } = useFetchQuickReport(prompt)
    console.log(data)
    return <div className="p-10 w-full h-full">{prompt}
        <div>{loading ? "loading" : (
            <RenderReport data={data.report} />
        )}</div>
    </div>
}
