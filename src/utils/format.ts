import { DividendKind, Market } from '../api/types';

const LOCALE = 'zh-TW';
const EMPTY = '—';
const PERCENT_DIGITS = 2;
const MAX_AMOUNT_DIGITS = 4;
const AMOUNT_DIGITS = 2;

export function formatPercent(value: number | null | undefined, digits = PERCENT_DIGITS): string {
    if(value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
    return `${value.toFixed(digits)}%`;
}

/** Dividends and prices: at least 2 decimals, at most 4 (some dividends have 3–4 decimals). */
export function formatAmount(value: number | null | undefined): string {
    if(value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
    return value.toLocaleString(LOCALE, { minimumFractionDigits: AMOUNT_DIGITS, maximumFractionDigits: MAX_AMOUNT_DIGITS });
}

export function formatFillDays(days: number | null): string {
    if(days === null) return '未填';
    if(days === 0) return '當天';
    return `${days} 天`;
}

const MARKET_LABELS: Record<Market, string> = {
    twse: '上市',
    tpex: '上櫃',
};

export function formatMarket(market: Market | null): string | null {
    return market ? MARKET_LABELS[market] : null;
}

const KIND_LABELS: Record<DividendKind, string> = {
    cash: '除息',
    stock: '除權',
    both: '除權息',
};

export function formatKind(kind: DividendKind): string {
    return KIND_LABELS[kind];
}

/** 2026-11-25 → 2026/11/25 */
export function formatDate(date: string | null | undefined): string {
    if(!date) return EMPTY;
    return date.slice(0, 10).replaceAll('-', '/');
}
