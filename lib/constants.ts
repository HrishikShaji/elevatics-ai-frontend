import { ReportType } from "@prisma/client";

type AgentData = {
    name: string; url: string; active: boolean, tagLine: string, suggestions: string[], img: string, hidden: boolean;
}

export const agents: { [key in ReportType]: AgentData } = {
    "QUICK": { name: "Quick Search", url: "/", active: false, tagLine: "Smart Research, Swift Results.", suggestions: [], img: '/assets/agentIMG.png', hidden: true },
    "FULL": { name: "iResearcher", url: "/agents/researcher-agent", active: true, tagLine: "Smart Research, Swift Results.", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "RESEARCHERCHAT": { name: "Researcher Chat", url: "/agents/researcher-chat", active: false, tagLine: " Smart Research, Swift Results.", suggestions: [], img: '/assets/agentIMG.png', hidden: true },
    "DOCUMENT": { name: "Documind", url: "/agents/document-agent", active: false, tagLine: 'From Data to Clarity with One Click', suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "NEWS": { name: "News", url: "/agents/news-agent", active: false, tagLine: "Your Instant Pulse on Global News", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "SEARCH": { name: "Search", url: "/agents/search-agent", active: false, tagLine: "", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "CODE": { name: "Code Assistance", url: "/agents/coding-agent", active: false, tagLine: ": Your Instant Code Companion", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "INTERPRETER": { name: "Code Interpreter", url: "/agents/code-interpreter-agent", active: false, tagLine: "", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "INVESTOR": { name: "Investor", url: "/agents/investor-agent", active: false, tagLine: "Empowering Investors with Predictive Intelligence.", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "INVESTORCHAT": { name: "Investor", url: "/agents/investor-chat", active: false, tagLine: "Empowering Investors with Predictive Intelligence.", suggestions: [], img: '/assets/agentIMG.png', hidden: true },
    "CAREER": { name: "Career", url: "/agents/career-agent", active: false, tagLine: "Your Virtual Career Coach for Smarter Choices", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "FOLLOWUP": { name: "FollowUp", url: "/agents/followup-agent", active: false, tagLine: "", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
    "PRESENTATION": { name: "Presentation", url: "/agents/presentation-agent", active: false, tagLine: "", suggestions: [], img: '/assets/agentIMG.png', hidden: false },
}

export const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

