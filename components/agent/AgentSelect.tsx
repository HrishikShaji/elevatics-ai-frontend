
import { AgentModel } from "@/types/types";
import { Dispatch, Fragment, SetStateAction } from "react";
import CustomDropdown from "../CustomDropdown";

interface AgentSelectProps {
    setSelectedAgent: Dispatch<SetStateAction<AgentModel>>;
    selectedAgent: AgentModel
}

export default function AgentSelect({ selectedAgent, setSelectedAgent }: AgentSelectProps) {

    const agents: { title: string, value: AgentModel }[] = [{ title: "qwen-72b", value: "qwen/qwen-72b-chat" }, { title: "gemma-2-27b", value: "google/gemma-2-27b-it" }, { title: "deepseek", value: "deepseek/deepseek-coder" }, { title: "claude-3", value: "anthropic/claude-3-haiku" }, { title: "claude-3.5", value: "anthropic/claude-3.5-sonnet" }, { title: "gpt-3.5", value: "openai/gpt-3.5-turbo-instruct" }, { title: "llama-3-70b", value: "meta-llama/llama-3-70b-instruct" }]

    function agentChange(value: string | number) {
        setSelectedAgent(value as AgentModel);
    }

    function getCurrentTitle(value: AgentModel) {
        const selectedItem = agents.find(item => item.value === selectedAgent)
        return selectedItem?.title
    }

    return <CustomDropdown label="" options={agents} value={selectedAgent} onChange={agentChange} />

}
