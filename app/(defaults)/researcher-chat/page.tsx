import ChatWindow from "@/components/chat/ChatWindow";
import { ChatProvider } from "@/contexts/ChatContext";

export default function Page() {
    return <ChatProvider>
        <ChatWindow title='Advanced Search' subTitle='Efficient Advanced Search' responseType='iresearcher-topics' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
