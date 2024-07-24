"use client"

import { useQuickReport } from "@/contexts/QuickReportContext"
import useFetchQuickReport from "@/hooks/useFetchQuickReport"
import RenderReport from "./RenderReport"
import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import { quickReportLoadingSteps } from "@/lib/loadingStatements"
import { ReportDataType } from "@/types/types"
import useSaveReport from "@/hooks/useSaveReport"

export default function QuickReport() {
    const { data, isLoading, error, isSuccess: fetchComplete } = useFetchQuickReport()
    const { prompt } = useQuickReport()
    const [showLoader, setShowLoader] = useState(true);
    const { mutate } = useSaveReport()

    useEffect(() => {
        if (fetchComplete) {
            mutate({ reportId: '', name: prompt, report: JSON.stringify(data), reportType: "QUICK" })
        }
    }, [fetchComplete])

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setShowLoader(true);
        }
    }, [isLoading]);
    return <div className="py-10 w-full h-full">
        <div>{showLoader ? <Loader steps={quickReportLoadingSteps} /> : (
            <RenderReport data={(data as ReportDataType).report} />
        )}</div>
    </div>
}
