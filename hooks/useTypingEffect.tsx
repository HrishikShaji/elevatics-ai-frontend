import { useState, useEffect, useRef } from 'react';

interface Props {
    text: string;
    speed: number;
}

const useTypingEffect = ({ text, speed }: Props) => {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(indexRef.current));
                indexRef.current += 1;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    useEffect(() => {
        if (text.length < displayedText.length) {
            setDisplayedText('');
            indexRef.current = 0;
        }
    }, [text]);


    return displayedText;
};

export default useTypingEffect;
