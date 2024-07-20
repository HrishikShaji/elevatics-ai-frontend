
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
