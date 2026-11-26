import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStockList } from '../test/fixtures';
import { mockFetch, ok, renderRoute } from '../test/render';

beforeEach(() => {
    window.localStorage.clear();
    mockFetch([{ path: '/v1/stocks', body: ok(createStockList()) }]);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('HomePage', () => {
    it('suggests stocks while typing and opens the chosen one', async () => {
        const user = userEvent.setup();
        const { router } = renderRoute('/');

        await user.type(screen.getByRole('combobox', { name: '搜尋股票' }), '台積');
        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(['2330台積電', '3330台積科']);

        await user.click(options[1]);
        // The stock page is a lazy route: the location changes once its chunk has loaded.
        await waitFor(() => expect(router.state.location.pathname).toBe('/stock/3330'));
    });

    it('looks up free text on Enter', async () => {
        const user = userEvent.setup();
        const { router } = renderRoute('/');
        await screen.findByRole('combobox', { name: '搜尋股票' });

        await user.type(screen.getByRole('combobox', { name: '搜尋股票' }), '9999{Enter}');

        await waitFor(() => expect(router.state.location.pathname).toBe('/stock/9999'));
    });

    it('opens the top suggestion with the 查詢 button', async () => {
        const user = userEvent.setup();
        const { router } = renderRoute('/');
        await screen.findByRole('combobox', { name: '搜尋股票' });

        await user.type(screen.getByRole('combobox', { name: '搜尋股票' }), '台積');
        await user.click(screen.getByRole('button', { name: '查詢' }));

        await waitFor(() => expect(router.state.location.pathname).toBe('/stock/2330'));
    });

    it('links the popular stocks and the recent searches', async () => {
        window.localStorage.setItem('recent-stocks', JSON.stringify([{ idString: '2412', name: '中華電' }]));
        const user = userEvent.setup();
        renderRoute('/');

        expect(screen.getByRole('link', { name: '0056 元大高股息' })).toHaveAttribute('href', '/stock/0056');
        expect(screen.getAllByRole('link', { name: '2412 中華電' })).toHaveLength(2);

        await user.click(screen.getByRole('button', { name: '清除' }));
        expect(screen.getAllByRole('link', { name: '2412 中華電' })).toHaveLength(1);
    });
});
