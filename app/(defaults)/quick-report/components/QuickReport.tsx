"use client"

import { useQuickReport } from "@/contexts/QuickReportContext"

export default function QuickReport() {
    const { prompt } = useQuickReport()
    return <div>{prompt}</div>
}
