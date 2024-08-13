import { ChatProvider } from "@/contexts/ChatContext";
import ChatWindow from "@/components/chat/ChatWindow";

interface SavedQuickReportProps {
    name: string;
    report: string;
    reportId: string;
}

export default function SavedQuickReport({ name, report, reportId }: SavedQuickReportProps) {
    return <ChatProvider>
        <ChatWindow title='Quick Search' subTitle='Efficient Quick Search' responseType='iresearcher-report' initialChatHistory={report} reportId={reportId} disable={false} />
    </ChatProvider>
}
