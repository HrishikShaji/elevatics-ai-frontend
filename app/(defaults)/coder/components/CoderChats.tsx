
import AutoScrollWrapper from "../../search/components/AutoScrollWrapper";
import SourcesModal from "@/components/SourcesModal";
import { Chat } from "@/types/types";
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, dracula, oneLight, duotoneLight, gruvboxLight, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AgentMessageWrapper from "../../sample/components/BotMessageWrapper";
import UserMessageWrapper from "../../sample/components/UserMessageWrapper";

interface CoderChatsProps {
    chatHistory: Chat[];
    loading: boolean;
}

export default function CoderChats({ chatHistory, loading }: CoderChatsProps) {

    if (chatHistory.length === 0) return null;

    return (<AutoScrollWrapper>
        <div className="w-[1000px] py-5 flex flex-col gap-2">
            {chatHistory.map((chat, i) => (
                chat.role === "user" ? (
                    <UserMessageWrapper key={i}>
                        {chat.content}
                    </UserMessageWrapper>
                ) : (
                    <AgentMessageWrapper key={i}>
                        <ReactMarkdown
                            children={chat.content}
                            components={{
                                code({ node, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return match ? (
                                        <SyntaxHighlighter
                                            useInlineStyles={true}
                                            customStyle={{ width: "700px", padding: "20px", borderRadius: "24px" }}
                                            style={materialLight}
                                            language={match[1]}
                                            PreTag="div"
                                        >{String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        />
                    </AgentMessageWrapper>
                )))}
            {loading && (
                <AgentMessageWrapper>
                    Loading...
                </AgentMessageWrapper>
            )}
        </div>
    </AutoScrollWrapper>
    )
}
