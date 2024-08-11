import { ChatProvider } from "@/contexts/ChatContext";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Page() {
    return <ChatProvider>
        <ChatWindow title="Document" subTitle='Efficient Document Search' responseType='document' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
