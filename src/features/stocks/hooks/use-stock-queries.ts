import { useQuery } from '@tanstack/react-query';
import { fetchStockDividends, fetchStockList } from '../../../api/stocks';

const MINUTE_MS = 60 * 1000;
/** The data is synced once a day after the market closes, so it can be kept for a while. */
const STOCK_LIST_STALE_MS = 60 * MINUTE_MS;
const DIVIDENDS_STALE_MS = 10 * MINUTE_MS;

export const stockQueryKeys = {
    list: ['stocks'] as const,
    dividends: (keyword: string) => ['stocks', 'dividends', keyword] as const,
};

export function useStockList() {
    return useQuery({
        queryKey: stockQueryKeys.list,
        queryFn: ({ signal }) => fetchStockList(signal),
        staleTime: STOCK_LIST_STALE_MS,
    });
}

export function useStockDividends(keyword: string) {
    return useQuery({
        queryKey: stockQueryKeys.dividends(keyword),
        queryFn: ({ signal }) => fetchStockDividends(keyword, signal),
        staleTime: DIVIDENDS_STALE_MS,
        enabled: keyword !== '',
    });
}
