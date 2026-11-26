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

/** The page of one stock. Ids are letters and digits today; encoding keeps any other character from breaking the route. */
export function stockPath(idString: string): string {
    return `/stock/${encodeURIComponent(idString)}`;
}

/**
 * Turns free text from the search box into the keyword for the API: "2330 台積電" → "2330",
 * an id in any case or an exact name → the id as the list spells it, anything else as typed.
 */
export function resolveKeyword(options: readonly StockOption[], input: string): string {
    const text = input.trim();
    if(text === '') return '';
    const [first] = text.split(/\s+/);
    const id = first.toUpperCase();
    const match = options.find((option) => option.idString.toUpperCase() === id || option.name === text);
    return match ? match.idString : first;
}

/**
 * What the 查詢 button looks up: the top suggestion, as Enter would pick it, so "台積" opens 2330
 * either way; the typed text when nothing in the list matches.
 */
export function pickKeyword(options: readonly StockOption[], input: string): string {
    if(input.trim() === '') return '';
    const [best] = filterStockOptions(options, input, 1);
    return best ? best.idString : resolveKeyword(options, input);
}
