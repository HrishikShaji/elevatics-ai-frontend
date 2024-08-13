"use client"

import useFetchSavedReport from "@/hooks/useFetchSavedReport"
import SavedQuickReport from "./SavedQuickReport"
import SavedInvestorReport from "./SavedInvestorReport"
import SavedNews from "./SavedNews"
import SavedSearch from "./SavedSearch"
import { CoderProvider } from "@/app/(defaults)/coder/contexts/CoderContext"
import AgentCoder from "@/app/(defaults)/coder/components/AgentCoder"
import SavedResearcherReportHome from "@/app/(defaults)/agents/components/SavedResearcherReportHome"

export default function SavedReport() {
    const { data, isLoading } = useFetchSavedReport()
    if (isLoading) return <div>Loading...</div>

    return <div>{data.reportType === "QUICK" ? <SavedQuickReport reportId={data.id} name={data.name} report={data.data} /> : null}
        {data.reportType === "FULL" ? <SavedResearcherReportHome name={data.name} data={data.data} /> : null}
        {data.reportType === "INVESTOR" ? <SavedInvestorReport name={data.name} report={data.data} /> : null}
        {data.reportType === "NEWS" ? <SavedNews name={data.name} report={data.data} /> : null}
        {data.reportType === "SEARCH" ? <SavedSearch id={data.id} history={data.data} /> : null}
        {data.reportType === "CODE" ? <CoderProvider>
            <AgentCoder disable={true} initialChatHistory={data.data} reportId={data.id} />
        </CoderProvider>
            : null}
    </div>
}
