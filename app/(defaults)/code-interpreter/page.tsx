
import { ChatProvider } from "@/contexts/ChatContext";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Page() {
    return <ChatProvider>
        <ChatWindow title="Code Interpreter" subTitle='Efficient  Code interpreter' responseType='code-interpreter' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>
}
