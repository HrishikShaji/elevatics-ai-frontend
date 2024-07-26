"use client"

import useFetchSavedReport from "@/hooks/useFetchSavedReport"
import SavedQuickReport from "./SavedQuickReport"

export default function SavedReport() {
    const { data, isLoading } = useFetchSavedReport()
    if (isLoading) return <div>Loading...</div>

    return <div>{data.reportType === "QUICK" ? <SavedQuickReport name={data.name} report={data.data} /> : null}</div>
}
