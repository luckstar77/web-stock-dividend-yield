import { StockOption } from '../../api/types';

export const MAX_SEARCH_RESULTS = 50;

export function optionLabel(option: StockOption): string {
    return `${option.idString} ${option.name}`;
}

function normalize(text: string): string {
    return text.trim().toUpperCase();
}

/**
 * Ranks the stocks matching what was typed, like the search boxes of Goodinfo and Yahoo 股市:
 * exact id first, then ids starting with the text, then names starting with it, then names containing it.
 */
export function filterStockOptions(options: readonly StockOption[], input: string, limit = MAX_SEARCH_RESULTS): StockOption[] {
    const text = normalize(input);
    if(text === '') return options.slice(0, limit);

    const ranked: { option: StockOption; rank: number }[] = [];
    for(const option of options) {
        const id = option.idString.toUpperCase();
        const name = option.name.toUpperCase();
        let rank: number | undefined;
        if(id === text || name === text) rank = 0;
        else if(id.startsWith(text)) rank = 1;
        else if(name.startsWith(text)) rank = 2;
        else if(name.includes(text) || optionLabel(option).toUpperCase().includes(text)) rank = 3;
        if(rank !== undefined) ranked.push({ option, rank });
    }
    ranked.sort((first, second) => first.rank - second.rank || first.option.idString.localeCompare(second.option.idString));
    return ranked.slice(0, limit).map(({ option }) => option);
}

/**
 * Turns free text from the search box into the keyword for the API: "2330 台積電" → "2330",
 * an exact name → its id when the list knows it, anything else as typed.
 */
export function resolveKeyword(options: readonly StockOption[], input: string): string {
    const text = input.trim();
    if(text === '') return '';
    const [first] = text.split(/\s+/);
    const match = options.find((option) => option.idString === first || option.name === text);
    return match ? match.idString : first;
}
