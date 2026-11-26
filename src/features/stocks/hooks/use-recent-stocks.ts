import { useCallback, useSyncExternalStore } from 'react';
import { StockOption } from '../../../api/types';

const STORAGE_KEY = 'recent-stocks';
const MAX_RECENT = 8;
const listeners = new Set<() => void>();
const EMPTY: StockOption[] = [];

let cachedRaw: string | null = null;
let cachedValue: StockOption[] = EMPTY;

function isStockOption(value: unknown): value is StockOption {
    if(typeof value !== 'object' || value === null) return false;
    const { idString, name } = value as Record<string, unknown>;
    return typeof idString === 'string' && typeof name === 'string';
}

function readRaw(): string | null {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

/** Parses once per stored value, so useSyncExternalStore gets the same array while nothing changed. */
function getSnapshot(): StockOption[] {
    const raw = readRaw();
    if(raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    try {
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        cachedValue = Array.isArray(parsed) ? parsed.filter(isStockOption).slice(0, MAX_RECENT) : EMPTY;
    } catch {
        cachedValue = EMPTY;
    }
    return cachedValue;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener('storage', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
    };
}

function write(list: StockOption[]) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        // Private mode or a full storage: recent searches are a convenience, so go on without them.
    }
    listeners.forEach((listener) => listener());
}

/** The stocks looked up most recently on this device, newest first. */
export function useRecentStocks() {
    const recent = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

    const addRecent = useCallback((stock: StockOption) => {
        const rest = getSnapshot().filter((item) => item.idString !== stock.idString);
        write([stock, ...rest].slice(0, MAX_RECENT));
    }, []);

    const clearRecent = useCallback(() => write([]), []);

    return { recent, addRecent, clearRecent };
}
