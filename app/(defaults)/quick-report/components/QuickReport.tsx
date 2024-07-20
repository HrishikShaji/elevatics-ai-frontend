"use client"

import { useQuickReport } from "@/contexts/QuickReportContext"
import useFetchQuickReport from "@/hooks/useFetchQuickReport"

export default function QuickReport() {
    const { prompt } = useQuickReport()
    const { data, loading, error } = useFetchQuickReport(prompt)
    console.log(data)
    return <div>{prompt}</div>
}
