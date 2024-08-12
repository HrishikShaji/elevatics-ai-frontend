"use client"

import useFetchSavedReport from "@/hooks/useFetchSavedReport"
import SavedQuickReport from "./SavedQuickReport"
import SavedFullReport from "./SavedFullReport"
import SavedInvestorReport from "./SavedInvestorReport"
import SavedCoder from "./SavedCoder"
import SavedNews from "./SavedNews"
import SavedSearch from "./SavedSearch"
import { CoderProvider } from "@/app/(defaults)/coder/contexts/CoderContext"
import AgentCoder from "@/app/(defaults)/coder/components/AgentCoder"
import SavedAdvancedReport from "./SavedAdvancedReport"

export default function SavedReport() {
    const { data, isLoading } = useFetchSavedReport()
    if (isLoading) return <div>Loading...</div>

    return <div>{data.reportType === "QUICK" ? <SavedQuickReport name={data.name} report={data.data} /> : null}
        {data.reportType === "FULL" ? <SavedAdvancedReport name={data.name} data={data.data} /> : null}
        {data.reportType === "INVESTOR" ? <SavedInvestorReport name={data.name} report={data.data} /> : null}
        {data.reportType === "NEWS" ? <SavedNews name={data.name} report={data.data} /> : null}
        {data.reportType === "SEARCH" ? <SavedSearch id={data.id} history={data.data} /> : null}
        {data.reportType === "CODE" ? <CoderProvider>
            <AgentCoder disable={true} initialChatHistory={data.data} reportId={data.id} />
        </CoderProvider>
            : null}
    </div>
}
