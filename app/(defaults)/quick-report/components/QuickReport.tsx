"use client"

import { useQuickReport } from "@/contexts/QuickReportContext"
import useFetchQuickReport from "@/hooks/useFetchQuickReport"
import RenderReport from "./RenderReport"
import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import { quickReportLoadingSteps } from "@/lib/loadingStatements"

export default function QuickReport() {
    const { data, loading, error } = useFetchQuickReport()
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setShowLoader(true);
        }
    }, [loading]);
    console.log(data)
    return <div className="py-10 w-full h-full">
        <div>{showLoader ? <Loader steps={quickReportLoadingSteps} /> : (
            <RenderReport data={data.report} />
        )}</div>
    </div>
}
