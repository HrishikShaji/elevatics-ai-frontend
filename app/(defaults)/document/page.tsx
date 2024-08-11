import AgentContainer from "@/components/agent/AgentContainer";
import { DocumentProvider } from "./contexts/DocumentContext";
import AgentDocument from "./components/DocumentAgent";

export default function Page() {
    return <DocumentProvider>
        <AgentDocument initialChatHistory="" reportId="" disable={false} />
    </DocumentProvider>
}
