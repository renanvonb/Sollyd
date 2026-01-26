import { normalizeSearch } from '@/lib/utils';

interface HighlightTextProps {
    text: string;
    highlight: string;
    className?: string;
}

export function HighlightText({ text, highlight, className }: HighlightTextProps) {
    if (!highlight.trim()) {
        return <span className={className}>{text}</span>;
    }

    const normText = normalizeSearch(text);
    const normHighlight = normalizeSearch(highlight);

    if (!normText.includes(normHighlight)) {
        return <span className={`${className || ''} opacity-30`}>{text}</span>;
    }

    const result = [];
    let currentIndex = 0;
    let searchIndex = normText.indexOf(normHighlight);

    while (searchIndex !== -1) {
        // Text before match
        if (searchIndex > currentIndex) {
            result.push(
                <span key={`pre-${currentIndex}`} className="opacity-30">
                    {text.slice(currentIndex, searchIndex)}
                </span>
            );
        }

        // Matched text (using original string content but indices from normalized search)
        const matchEnd = searchIndex + normHighlight.length;
        result.push(
            <span key={`match-${searchIndex}`}>
                {text.slice(searchIndex, matchEnd)}
            </span>
        );

        currentIndex = matchEnd;
        searchIndex = normText.indexOf(normHighlight, currentIndex);
    }

    // Remaining text
    if (currentIndex < text.length) {
        result.push(
            <span key={`post-${currentIndex}`} className="opacity-30">
                {text.slice(currentIndex)}
            </span>
        );
    }

    return <span className={className}>{result}</span>;
}
