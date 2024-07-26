"use client"

import useFetchSavedReport from "@/hooks/useFetchSavedReport"
import SavedQuickReport from "./SavedQuickReport"
import SavedFullReport from "./SavedFullReport"
import SavedInvestorReport from "./SavedInvestorReport"
import SavedCoder from "./SavedCoder"

export default function SavedReport() {
    const { data, isLoading } = useFetchSavedReport()
    if (isLoading) return <div>Loading...</div>

    return <div>{data.reportType === "QUICK" ? <SavedQuickReport name={data.name} report={data.data} /> : null}
        {data.reportType === "FULL" ? <SavedFullReport name={data.name} report={data.data} /> : null}
        {data.reportType === "INVESTOR" ? <SavedInvestorReport name={data.name} report={data.data} /> : null}
        {data.reportType === "CODE" ? <SavedCoder id={data.id} history={data.data} /> : null}
    </div>
}
