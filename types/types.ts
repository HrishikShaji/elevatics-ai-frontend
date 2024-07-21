
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
