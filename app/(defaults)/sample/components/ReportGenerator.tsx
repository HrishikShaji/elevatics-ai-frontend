import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import Plotly from 'plotly.js-dist';

const ReportGenerator = () => {
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState('');
    const [sources, setSources] = useState([]);
    const reportContainerRef = useRef(null);
    const sourcesContainerRef = useRef(null);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        const plots = document.querySelectorAll('.js-plotly-plot');
        plots.forEach(plot => {
            Plotly.Plots.resize(plot);
        });
    };

    const generateReport = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({
                    description: description,
                    user_id: "",
                    user_name: "multi-agent-research",
                    internet: true,
                    output_format: "report_table",
                    data_format: "Structured data",
                    generate_charts: true,
                    output_as_md: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let markdown = '';
            let metadata = '';
            let isReadingMetadata = false;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });

                if (chunk.includes('<report-metadata>')) {
                    isReadingMetadata = true;
                    metadata = '';
                }

                if (isReadingMetadata) {
                    metadata += chunk;
                    if (chunk.includes('</report-metadata>')) {
                        isReadingMetadata = false;
                        processMetadata(metadata);
                    }
                } else {
                    markdown += chunk;
                    renderMarkdown(markdown);
                }
            }
        } catch (error) {
            setReport(`Error generating report: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const renderMarkdown = (markdown) => {
        const reportContent = markdown.match(/<report>([\s\S]*)<\/report>/);
        if (reportContent) {
            setReport(marked(reportContent[1]));
        } else {
            setReport(marked(markdown));
        }

        setTimeout(() => {
            const scripts = reportContainerRef.current.getElementsByTagName('script');
            Array.from(scripts).forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
            });

            const plots = reportContainerRef.current.querySelectorAll('.js-plotly-plot');
            plots.forEach(plot => {
                Plotly.Plots.resize(plot);
            });
        }, 0);
    };

    const processMetadata = (metadata) => {
        const metadataMatch = metadata.match(/all-text-with-urls: (.+)/);
        if (metadataMatch) {
            const metadataObj = JSON.parse(metadataMatch[1]);
            setSources(metadataObj);
        } else {
            setSources([]);
        }
    };

    const downloadHTML = () => {
        // Implementation remains mostly the same,
        // but you'll need to adjust it to work with React's virtual DOM
        // This is a complex function that might require additional React-specific adjustments
    };

    return (
        <div>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
            />
            <button onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
            <div ref={reportContainerRef} dangerouslySetInnerHTML={{ __html: report }} />
            <div ref={sourcesContainerRef}>
                <h2>Sources</h2>
                {sources.map(([content, url], index) => (
                    <div key={index} className="source-item">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="source-url">{url}</a>
                        <div className="source-content">
                            <div className="source-snippet" dangerouslySetInnerHTML={{ __html: marked(content.substring(0, 400) + '...') }} />
                            <div className="source-full" dangerouslySetInnerHTML={{ __html: marked(content) }} />
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={downloadHTML}>Download HTML</button>
        </div>
    );
};

export default ReportGenerator;
