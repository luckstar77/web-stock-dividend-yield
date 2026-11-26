import { apiGet } from './http';
import { StockDividends, StockList } from './types';

const EMPTY_LIST: StockList = { list: [], listDate: null };

export async function fetchStockList(signal?: AbortSignal): Promise<StockList> {
    return (await apiGet<StockList>('/v1/stocks', undefined, signal)) ?? EMPTY_LIST;
}

/** keyword: a stock id or its exact name. Resolves to null when the stock has no dividend data. */
export function fetchStockDividends(keyword: string, signal?: AbortSignal): Promise<StockDividends | null> {
    return apiGet<StockDividends>('/v1/stocks/dividends', { keyword }, signal);
}
