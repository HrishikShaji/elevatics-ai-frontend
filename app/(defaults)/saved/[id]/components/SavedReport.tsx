"use client"

import useFetchSavedReport from "@/hooks/useFetchSavedReport"
import SavedResearcherReportHome from "@/app/(defaults)/agents/components/SavedResearcherReportHome"
import SavedResearcherChat from "@/app/(defaults)/agents/components/SavedResearcherChat"
import SavedInvestorReportHome from "@/app/(defaults)/agents/components/SavedInvestorReportHome"
import SavedQuickChat from "@/app/(defaults)/agents/components/SavedQuickChat"
import SavedNewsChat from "@/app/(defaults)/agents/components/SavedNewsChat"
import SavedSearchChat from "@/app/(defaults)/agents/components/SavedSearchChat"
import SavedCoderChat from "@/app/(defaults)/agents/components/SavedCoderChat"
import SavedInterpreterChat from "@/app/(defaults)/agents/components/SavedInterpreterChat"
import SavedDocumentChat from "@/app/(defaults)/agents/components/SavedDocumentChat"
import SavedCareerChat from "@/app/(defaults)/agents/components/SavedCareerChat"

export default function SavedReport() {
    const { data, isLoading } = useFetchSavedReport()
    if (isLoading) return <div>Loading...</div>

    return <div>{data.reportType === "QUICK" ? <SavedQuickChat reportId={data.id} initialChatHistory={data.data} /> : null}
        {data.reportType === "FULL" ? <SavedResearcherReportHome name={data.name} data={data.data} /> : null}
        {data.reportType === "INVESTOR" ? <SavedInvestorReportHome name={data.name} report={data.data} /> : null}
        {data.reportType === "NEWS" ? <SavedNewsChat reportId={data.id} initialChatHistory={data.data} /> : null}
        {data.reportType === "SEARCH" ? <SavedSearchChat reportId={data.id} initialChatHistory={data.data} /> : null}
        {data.reportType === "CODE" ? <SavedCoderChat initialChatHistory={data.data} reportId={data.id} /> : null}
        {data.reportType === "RESEARCHERCHAT" ? <SavedResearcherChat initialChatHistory={data.data} reportId={data.id} /> : null}
        {data.reportType === "INTERPRETER" ? <SavedInterpreterChat initialChatHistory={data.data} reportId={data.id} /> : null}
        {data.reportType === "DOCUMENT" ? <SavedDocumentChat initialChatHistory={data.data} reportId={data.id} /> : null}
        {data.reportType === "CAREER" ? <SavedCareerChat initialChatHistory={data.data} reportId={data.id} /> : null}
    </div>
}
