import { ReportType } from "@prisma/client";

type AgentData = {
    name: string; url: string; active: boolean, tagLine: string, suggestions: string[]
}

export const agents: { [key in ReportType]: AgentData } = {
    "QUICK": { name: "Quick Search", url: "/", active: false, tagLine: "Smart Research, Swift Results.", suggestions: [] },
    "FULL": { name: "iResearcher", url: "/agents/researcher-agent", active: true, tagLine: "Smart Research, Swift Results.", suggestions: [] },
    "RESEARCHERCHAT": { name: "Researcher Chat", url: "/agents/researcher-chat", active: false, tagLine: " Smart Research, Swift Results.", suggestions: [] },
    "DOCUMENT": { name: "Documind", url: "/agents/document-agent", active: false, tagLine: 'From Data to Clarity with One Click', suggestions: [] },
    "NEWS": { name: "News", url: "/agents/news-agent", active: false, tagLine: "Your Instant Pulse on Global News", suggestions: [] },
    "SEARCH": { name: "Search", url: "/agents/search-agent", active: false, tagLine: "", suggestions: [] },
    "CODE": { name: "Code Assistance", url: "/agents/coding-agent", active: false, tagLine: ": Your Instant Code Companion", suggestions: [] },
    "INTERPRETER": { name: "Code Interpreter", url: "/agents/code-interpreter-agent", active: false, tagLine: "", suggestions: [] },
    "INVESTOR": { name: "Investor", url: "/agents/investor-agent", active: false, tagLine: "Empowering Investors with Predictive Intelligence.", suggestions: [] },
    "INVESTORCHAT": { name: "Investor", url: "/agents/investor-chat", active: false, tagLine: "Empowering Investors with Predictive Intelligence.", suggestions: [] },
    "CAREER": { name: "Career", url: "/agents/career-agent", active: false, tagLine: "Your Virtual Career Coach for Smarter Choices", suggestions: [] },
    "FOLLOWUP": { name: "FollowUp", url: "/agents/followup-agent", active: false, tagLine: "", suggestions: [] },
    "PRESENTATION": { name: "Presentation", url: "/agents/presentation-agent", active: false, tagLine: "", suggestions: [] },
}

export const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

