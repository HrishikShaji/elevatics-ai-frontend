import { ChatProvider } from "@/contexts/ChatContext";
import SampleStream from "./components/SampleStream";
import SearchAgent from "./components/SearchAgent";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Page() {
    return <ChatProvider>
        <ChatWindow title="Search" subTitle='Efficient  Search' responseType='search' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>
}
