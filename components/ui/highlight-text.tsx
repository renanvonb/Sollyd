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

    const normHighlight = normalizeSearch(highlight);

    // Tentar encontrar o match no texto original ou normalizado
    const normText = normalizeSearch(text);

    if (!normText.includes(normHighlight)) {
        return <span className={`${className || ''} opacity-30`}>{text}</span>;
    }

    // Criar mapeamento de índices: texto normalizado -> texto original
    const indexMap: number[] = [];
    let normIdx = 0;
    for (let origIdx = 0; origIdx < text.length; origIdx++) {
        const origChar = text[origIdx];
        const normChar = normalizeSearch(origChar);
        if (normChar.length > 0) {
            indexMap[normIdx] = origIdx;
            normIdx++;
        }
    }
    // Adicionar índice final para facilitar o slice
    indexMap[normIdx] = text.length;

    const result = [];
    let currentNormIndex = 0;
    let searchIndex = normText.indexOf(normHighlight);

    while (searchIndex !== -1) {
        // Texto antes do match
        if (searchIndex > currentNormIndex) {
            const origStart = indexMap[currentNormIndex] ?? 0;
            const origEnd = indexMap[searchIndex] ?? text.length;
            result.push(
                <span key={`pre-${currentNormIndex}`} className="opacity-30">
                    {text.slice(origStart, origEnd)}
                </span>
            );
        }

        // Texto que deu match
        const matchNormEnd = searchIndex + normHighlight.length;
        const matchOrigStart = indexMap[searchIndex] ?? 0;
        const matchOrigEnd = indexMap[matchNormEnd] ?? text.length;
        result.push(
            <span key={`match-${searchIndex}`}>
                {text.slice(matchOrigStart, matchOrigEnd)}
            </span>
        );

        currentNormIndex = matchNormEnd;
        searchIndex = normText.indexOf(normHighlight, currentNormIndex);
    }

    // Texto restante
    if (currentNormIndex < normText.length) {
        const origStart = indexMap[currentNormIndex] ?? 0;
        result.push(
            <span key={`post-${currentNormIndex}`} className="opacity-30">
                {text.slice(origStart)}
            </span>
        );
    }

    return <span className={className}>{result}</span>;
}
