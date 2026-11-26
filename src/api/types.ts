/** Response codes of the standard `{ status, code, data }` envelope of the v1 API. */
export const ResponseCode = {
    SUCCESS: 20000,
    NO_DATA: 20400,
    INVALID_INPUT: 40000,
    SERVER_ERROR: 50000,
} as const;

export interface ApiEnvelope<T> {
    status: 'ok' | 'error';
    code: number;
    data?: T;
    error?: { message: string };
}

export type Market = 'twse' | 'tpex';

/** cash: 除息, stock: 除權, both: 除權息 */
export type DividendKind = 'cash' | 'stock' | 'both';

export interface StockOption {
    idString: string;
    name: string;
}

export interface StockList {
    list: StockOption[];
    /** The trading day the list was taken from, YYYY-MM-DD */
    listDate: string | null;
}

export interface DividendEventItem {
    exDate: string;
    kind: DividendKind;
    preExClose: number;
    referencePrice: number;
    /** 元/股 */
    cashDividend: number;
    /** 元/股 (面額 10 元) */
    stockDividend: number;
    filledDate: string | null;
    /** Calendar days from the ex-date to the fill date; 0 = filled on the ex-date */
    fillDayCount: number | null;
    isAmountEstimated: boolean;
}

export interface DividendYear {
    year: number;
    cashDividend: number;
    stockDividend: number;
    cashYieldRatio: number;
    retroactiveYieldRatio: number;
    isFilled: boolean;
    /** Oldest first */
    events: DividendEventItem[];
}

export interface StockDividends {
    idString: string;
    name: string;
    market: Market | null;
    successRatio: number;
    avgCashYieldRatio: number;
    avgRetroactiveYieldRatio: number;
    dividendYearCount: number;
    filledYearCount: number;
    dividendYearStart: number;
    dividendYearEnd: number;
    dataThroughDate: string | null;
    updatedAt: string | null;
    lastClose: number | null;
    lastCloseDate: string | null;
    trailingCashDividend: number;
    trailingCashYieldRatio: number | null;
    /** Newest year first */
    years: DividendYear[];
}
