import { ReportType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

interface Props {
    report: string;
    reportType: ReportType;
    name: string;
    reportId: string;
}

async function saveReport({ reportId, reportType, report, name }: Props) {
    if (report) {
        try {
            const response = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reportId: reportId, report: report, reportType: reportType, name: name }),
            });
            if (!response.ok) {
                throw new Error("Failed to send report to backend");
            }
            const result = await response.json()
            return result.report
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}

export default function useSaveReport() {
    return useMutation({ mutationFn: saveReport, mutationKey: ["report"], onSuccess: () => console.log("report saved") })
}

