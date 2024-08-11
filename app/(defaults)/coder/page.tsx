import { ChatProvider } from "@/contexts/ChatContext";
import Coder from "./components/Coder";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Page() {
    return <ChatProvider>
        <ChatWindow title="Coder" subTitle='Efficient  Coder' responseType='coder' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>
}
