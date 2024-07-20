"use client"

import { useQuickReport } from "@/contexts/QuickReportContext"
import useFetchQuickReport from "@/hooks/useFetchQuickReport"
import RenderReport from "./RenderReport"

export default function QuickReport() {
    const { data, loading, error } = useFetchQuickReport()
    console.log(data)
    return <div className="p-10 w-full h-full">
        <div>{loading ? "loading" : (
            <RenderReport data={data.report} />
        )}</div>
    </div>
}
