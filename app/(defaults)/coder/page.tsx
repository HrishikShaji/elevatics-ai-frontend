import AgentCoder from "./components/AgentCoder";
import { CoderProvider } from "./contexts/CoderContext";

export default function Page() {
    return <CoderProvider>
        <AgentCoder />
    </CoderProvider>
}
