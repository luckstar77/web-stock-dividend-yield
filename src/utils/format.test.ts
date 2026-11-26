import { formatAmount, formatDate, formatFillDays, formatKind, formatMarket, formatPercent } from './format';

describe('formatPercent', () => {
    it('rounds to two decimals and adds a percent sign', () => {
        expect(formatPercent(3.1555969257801637)).toBe('3.16%');
        expect(formatPercent(100)).toBe('100.00%');
    });

    it('shows a dash for missing or non-finite values', () => {
        expect(formatPercent(null)).toBe('—');
        expect(formatPercent(undefined)).toBe('—');
        expect(formatPercent(Number.NaN)).toBe('—');
    });
});

describe('formatAmount', () => {
    it('keeps two to four decimals', () => {
        expect(formatAmount(5)).toBe('5.00');
        expect(formatAmount(0.98765)).toBe('0.9877');
        expect(formatAmount(1460)).toBe('1,460.00');
    });

    it('hides floating point noise from summed dividends', () => {
        expect(formatAmount(0.1 + 0.2)).toBe('0.30');
    });
});

describe('formatFillDays', () => {
    it('names the ex-date itself and unfilled ex-dates', () => {
        expect(formatFillDays(0)).toBe('當天');
        expect(formatFillDays(15)).toBe('15 天');
        expect(formatFillDays(null)).toBe('未填');
    });
});

describe('labels', () => {
    it('names the market and the kind of ex-date', () => {
        expect(formatMarket('twse')).toBe('上市');
        expect(formatMarket('tpex')).toBe('上櫃');
        expect(formatMarket(null)).toBeNull();
        expect(formatKind('cash')).toBe('除息');
        expect(formatKind('stock')).toBe('除權');
        expect(formatKind('both')).toBe('除權息');
    });

    it('formats dates and ISO timestamps with slashes', () => {
        expect(formatDate('2026-11-25')).toBe('2026/11/25');
        expect(formatDate('2026-11-25T10:35:38.711Z')).toBe('2026/11/25');
        expect(formatDate(null)).toBe('—');
    });
});
