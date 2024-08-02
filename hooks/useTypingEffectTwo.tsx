import { useEffect, useState } from "react";

interface Props {
    onUpdate: () => void;
    text: string;
}

export default function useTypingEffectTwo({ onUpdate, text }: Props) {
    const [displayResponse, setDisplayResponse] = useState("")

    useEffect(() => {

        let i = 0;
        const stringResponse = text

        const intervalId = setInterval(() => {
            setDisplayResponse(stringResponse.slice(0, i));

            i++;

            if (i > stringResponse.length) {
                clearInterval(intervalId);
            }
        }, 20);

        return () => clearInterval(intervalId);
    }, [text, onUpdate]);
    return displayResponse
}
