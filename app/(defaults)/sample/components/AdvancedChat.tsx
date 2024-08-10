import React from 'react';
import { Chat, SelectedSubtasks } from '@/types/types';
import AutoScrollWrapper from '../../search/components/AutoScrollWrapper';
import AdvancedTopics from './AdvancedTopics';
import AdvancedReportContainer from './AdvancedReportContainer';
import UserMessageWrapper from './UserMessageWrapper';
import AgentMessageWrapper from './BotMessageWrapper';

interface AdvancedChatProps {
    chatHistory: Chat[];
    generateReport: (tasks: SelectedSubtasks) => void;
    loading: boolean;
}

export default function AdvancedChat({ chatHistory, generateReport, loading }: AdvancedChatProps) {

    if (chatHistory.length <= 0) return null;

    return (
        <AutoScrollWrapper>
            <div className='w-[1000px] py-5 flex flex-col gap-2 ' >
                {chatHistory.map((chat, i) => {
                    return chat.role === "user" ? (
                        <UserMessageWrapper key={i} >
                            {chat.content}
                        </UserMessageWrapper>
                    ) : chat.role === "options" ?
                        <AgentMessageWrapper key={i}>
                            <AdvancedTopics generateReport={generateReport} content={chat.content} />
                        </AgentMessageWrapper>
                        : (
                            <AgentMessageWrapper key={i}>
                                <AdvancedReportContainer chat={chat} key={i} />
                            </AgentMessageWrapper>
                        );
                })}
                {loading ?
                    <AgentMessageWrapper>
                        Loading...
                    </AgentMessageWrapper>
                    : null}
            </div>
        </AutoScrollWrapper>
    );
}
