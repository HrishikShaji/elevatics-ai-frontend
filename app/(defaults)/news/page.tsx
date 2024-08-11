import { ChatProvider } from "@/contexts/ChatContext";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Page() {
    return <ChatProvider>
        <ChatWindow title="News" subTitle='Efficient  News' responseType='news' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>
}
