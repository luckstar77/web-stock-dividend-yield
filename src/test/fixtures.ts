import { StockDividends, StockList } from '../api/types';

export function createStockList(overrides: Partial<StockList> = {}): StockList {
    return {
        list: [
            { idString: '0056', name: '元大高股息' },
            { idString: '00878', name: '國泰永續高股息' },
            { idString: '2330', name: '台積電' },
            { idString: '2412', name: '中華電' },
            { idString: '3330', name: '台積科' },
        ],
        listDate: '2026-11-25',
        ...overrides,
    };
}

export function createStockDividends(overrides: Partial<StockDividends> = {}): StockDividends {
    return {
        idString: '2330',
        name: '台積電',
        market: 'twse',
        successRatio: 95.65217391304348,
        avgCashYieldRatio: 3.1555969257801637,
        avgRetroactiveYieldRatio: 4.099856276335496,
        dividendYearCount: 23,
        filledYearCount: 22,
        dividendYearStart: 2004,
        dividendYearEnd: 2026,
        dataThroughDate: '2026-11-25',
        updatedAt: '2026-11-25T10:35:38.711Z',
        lastClose: 1460,
        lastCloseDate: '2026-11-25',
        trailingCashDividend: 19,
        trailingCashYieldRatio: 1.3013698630136987,
        years: [
            {
                year: 2026,
                cashDividend: 10,
                stockDividend: 0,
                cashYieldRatio: 0.85,
                retroactiveYieldRatio: 0.85,
                isFilled: false,
                events: [
                    {
                        exDate: '2026-06-11', kind: 'cash', preExClose: 1050, referencePrice: 1045,
                        cashDividend: 5, stockDividend: 0, filledDate: '2026-06-12', fillDayCount: 1, isAmountEstimated: false,
                    },
                    {
                        exDate: '2026-09-16', kind: 'cash', preExClose: 1290, referencePrice: 1285,
                        cashDividend: 5, stockDividend: 0, filledDate: null, fillDayCount: null, isAmountEstimated: false,
                    },
                ],
            },
            {
                year: 2005,
                cashDividend: 2,
                stockDividend: 0.5,
                cashYieldRatio: 3.2,
                retroactiveYieldRatio: 4.1,
                isFilled: true,
                events: [
                    {
                        exDate: '2005-07-18', kind: 'both', preExClose: 62.5, referencePrice: 59.52,
                        cashDividend: 2, stockDividend: 0.5, filledDate: '2005-08-02', fillDayCount: 15, isAmountEstimated: true,
                    },
                ],
            },
        ],
        ...overrides,
    };
}
