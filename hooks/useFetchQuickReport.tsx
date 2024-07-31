import { useQuickReport } from '@/contexts/QuickReportContext';
import { useSettings } from '@/contexts/SettingsContext';
import { QUICK_REPORT_URL } from '@/lib/endpoints';
import { ReportDataType } from '@/types/types';
import { useQuery } from '@tanstack/react-query';



async function generateQuickReport({ generateCharts, prompt, internet, dataFormat, outputFormat }: { generateCharts: boolean, prompt: string; internet: boolean; dataFormat: string; outputFormat: string }) {
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(
        QUICK_REPORT_URL,
        {
            method: "POST",
            cache: "no-store",
            headers: headers,
            body: JSON.stringify({
                topic: "",
                description: prompt,
                user_id: "",
                user_name: "",
                internet: internet,
                output_format: outputFormat,
                data_format: dataFormat,
                generate_charts: generateCharts,
                output_as_md: true
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Error fetching topics");
    }

    const data = await response.json();

    return data as ReportDataType;
}
const useFetchQuickReport = () => {
    const { prompt } = useQuickReport()
    const { reportOptions } = useSettings()
    const fetchReport = async () => {
        const data = await generateQuickReport({
            generateCharts: reportOptions.generate_charts,
            prompt,
            internet: reportOptions.internet,
            outputFormat: reportOptions.outputFormat,
            dataFormat: reportOptions.dataFormat,
        });
        return data;
    };

    return useQuery({
        queryKey: ["report", prompt],
        queryFn: fetchReport
    }
    );



};

export default useFetchQuickReport;
