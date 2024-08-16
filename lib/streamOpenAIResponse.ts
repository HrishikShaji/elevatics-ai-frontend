import { OPENAI_API_KEY } from "./endpoints";

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const streamOpenAIResponse = async (prompt: string, onUpdate: (data: string) => void) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            stream: true, // Enable streaming
        }),
    });

    if (!response.ok || !response.body) {
        console.error("Failed to connect to the stream");
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
            const decodedValue = decoder.decode(value);
            const lines = decodedValue.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line === '[DONE]') {
                    return;
                }

                const message = line.replace(/^data: /, '');

                try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices[0].delta?.content || '';
                    onUpdate(content);
                } catch (error) {
                    console.error('Error parsing stream:', error);
                }
            }
        }
    }
};
