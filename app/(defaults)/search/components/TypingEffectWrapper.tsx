import useTypingEffect from '@/hooks/useTypingEffect';
import useTypingEffectTwo from '@/hooks/useTypingEffectTwo';
import ReactMarkdown from 'react-markdown';

interface TypingEffectWrapperProps {
    text: string;
    onUpdate: () => void;
}

export default function TypingEffectWrapper({ text, onUpdate }: TypingEffectWrapperProps) {
    const typedContent = useTypingEffect({ text: text, speed: 10 });
    //const newContent = useTypingEffectTwo({ text: text, onUpdate: onUpdate })

    return <ReactMarkdown>{typedContent}</ReactMarkdown>;
}
