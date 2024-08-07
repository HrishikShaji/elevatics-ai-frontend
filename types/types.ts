
export type DataFormatType = "No presets" | "Structured data" | "Quantitative data"
export type OutputFormatType = "chat" | "report" | "report_table"

export type ReportOptions = {
    outputFormat: OutputFormatType;
    internet: boolean;
    dataFormat: DataFormatType
    generate_charts: boolean
}

export type TopicsLimit = {
    topics: number;
    subTopics: number;
}

export type SubTask = {
    name: string;
    prompt: string;
}
export type ResearcherTopicsResponse = {
    task: string;
    subtasks: SubTask[]
}

export interface SelectedSubtasks {
    [task: string]: SubTask[];
}

export interface Topic {
    parentKey: string;
    name: string;
    prompt: string;
}

type SectionType = {
    section: string;
    reasoning: string;
    score: number;
    weight: number
}

type SectorType = {
    sector: string;
    sections: SectionType[];
    overall_score: number;
}

export type InvestorDataResponse = {
    grading_results: { final_score: number; sectors: SectorType[] };
    other_info_results: { [key: string]: string };
    queries: string[];
    query_results: string[]
}

export type LoaderStep = {
    title: string
}

export type ReportDataType = {
    report: string;
    references: Record<string, any>
}

export type AgentModel = "meta-llama/llama-3-70b-instruct" |
    "anthropic/claude-3.5-sonnet" |
    "deepseek/deepseek-coder" |
    "anthropic/claude-3-haiku" |
    "openai/gpt-3.5-turbo-instruct" |
    "qwen/qwen-72b-chat" |
    "google/gemma-2-27b-it"



export type Chat = {
    content: string;
    role: "assistant" | "user";
    metadata: string | null
}
