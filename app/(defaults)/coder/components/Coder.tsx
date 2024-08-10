"use client"
import { CoderProvider } from "../contexts/CoderContext";
import AgentCoder from "./AgentCoder";

export default function Coder() {
    return (
        <CoderProvider>
            <AgentCoder disable={false} initialChatHistory="" reportId="" />
        </CoderProvider>
    )
}
