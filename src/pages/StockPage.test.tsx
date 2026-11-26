import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStockDividends, createStockList } from '../test/fixtures';
import { mockFetch, ok, renderRoute } from '../test/render';

beforeEach(() => {
    window.localStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('StockPage', () => {
    it('shows the summary, the latest ex-date and the yearly table of a stock', async () => {
        mockFetch([
            { path: '/v1/stocks', body: ok(createStockList()) },
            { path: '/v1/stocks/dividends', body: ok(createStockDividends()) },
        ]);

        renderRoute('/stock/2330');

        expect(await screen.findByRole('heading', { level: 1, name: /2330\s*台積電/ })).toBeInTheDocument();
        expect(screen.getByText('上市')).toBeInTheDocument();
        expect(screen.getByText('95.65%')).toBeInTheDocument();
        expect(screen.getByText('23 年中有 22 年填權息')).toBeInTheDocument();
        expect(screen.getByText('3.16%')).toBeInTheDocument();
        expect(screen.getByText('1.30%')).toBeInTheDocument();
        expect(screen.getByText(/最近一次除息：2026\/09\/16.*尚未填權息/)).toBeInTheDocument();

        const table = screen.getByRole('table', { name: '歷年除權息明細' });
        const rows = within(table).getAllByRole('row');
        expect(within(rows[1]).getByText('2026')).toBeInTheDocument();
        expect(within(rows[1]).getByText('未填權息')).toBeInTheDocument();
        expect(within(table).getByText('15 天')).toBeInTheDocument();
        expect(document.title).toBe('2330 台積電 填權息、殖利率 | 權息通');
    });

    it('expands a year to show each ex-date', async () => {
        mockFetch([
            { path: '/v1/stocks', body: ok(createStockList()) },
            { path: '/v1/stocks/dividends', body: ok(createStockDividends()) },
        ]);
        const user = userEvent.setup();

        renderRoute('/stock/2330');
        await user.click(await screen.findByRole('button', { name: '展開2026 年的 2 次除權息' }));

        const events = await screen.findByRole('table', { name: '各次除權息' });
        expect(within(events).getByText('2026/06/11')).toBeInTheDocument();
        expect(within(events).getByText('1 天')).toBeInTheDocument();
    });

    it('remembers the stock as a recent search', async () => {
        mockFetch([
            { path: '/v1/stocks', body: ok(createStockList()) },
            { path: '/v1/stocks/dividends', body: ok(createStockDividends()) },
        ]);

        renderRoute('/stock/2330');
        await screen.findByRole('heading', { level: 1, name: /台積電/ });

        expect(JSON.parse(window.localStorage.getItem('recent-stocks') ?? '[]')).toEqual([{ idString: '2330', name: '台積電' }]);
    });

    it('moves a search by name to the stock id', async () => {
        mockFetch([
            { path: '/v1/stocks', body: ok(createStockList()) },
            { path: '/v1/stocks/dividends', body: ok(createStockDividends()) },
        ]);

        const { router } = renderRoute(`/stock/${encodeURIComponent('台積電')}`);
        await screen.findByRole('heading', { level: 1, name: /台積電/ });

        expect(router.state.location.pathname).toBe('/stock/2330');
    });

    it('says when a stock has no dividend data', async () => {
        mockFetch([
            { path: '/v1/stocks', body: ok(createStockList()) },
            { path: '/v1/stocks/dividends', body: { status: 'ok', code: 20400 } },
        ]);

        renderRoute('/stock/9999');

        expect(await screen.findByRole('heading', { name: '查無「9999」的除權息資料' })).toBeInTheDocument();
    });

    it('shows the error and retries when the API fails', async () => {
        const fetchMock = mockFetch([
            { path: '/v1/stocks', body: ok(createStockList()) },
            { path: '/v1/stocks/dividends', status: 500, body: { status: 'error', code: 50000, error: { message: '伺服器暫時無法回應' } } },
        ]);
        const user = userEvent.setup();

        renderRoute('/stock/2330');
        expect(await screen.findByText('伺服器暫時無法回應')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: '重試' }));
        const dividendCalls = fetchMock.mock.calls.filter(([input]) => String(input).includes('/v1/stocks/dividends'));
        expect(dividendCalls).toHaveLength(2);
    });
});
