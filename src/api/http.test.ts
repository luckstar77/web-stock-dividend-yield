import { mockFetch, ok } from '../test/render';
import { ApiError, apiGet } from './http';

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('apiGet', () => {
    it('unwraps the data of a successful envelope and sends the query', async () => {
        const fetchMock = mockFetch([{ path: '/v1/stocks/dividends', body: ok({ idString: '2330' }) }]);

        await expect(apiGet('/v1/stocks/dividends', { keyword: '台積電', unused: undefined })).resolves.toEqual({ idString: '2330' });

        const url = new URL(String(fetchMock.mock.calls[0][0]));
        expect(url.searchParams.get('keyword')).toBe('台積電');
        expect(url.searchParams.has('unused')).toBe(false);
    });

    it('resolves to null when the API has no data', async () => {
        mockFetch([{ path: '/v1/stocks/dividends', body: { status: 'ok', code: 20400 } }]);
        await expect(apiGet('/v1/stocks/dividends', { keyword: '9999' })).resolves.toBeNull();
    });

    it('throws the API message for input and server errors', async () => {
        mockFetch([{ path: '/v1/stocks/dividends', body: { status: 'error', code: 40000, error: { message: 'keyword is required' } } }]);
        await expect(apiGet('/v1/stocks/dividends')).rejects.toMatchObject({ code: 40000, message: 'keyword is required' });
    });

    it('throws a readable error when the server answers something that is not JSON', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>502 Bad Gateway</html>', { status: 502 })));
        await expect(apiGet('/v1/stocks')).rejects.toThrow('HTTP 502');
    });

    it('throws a readable error when the network is down', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => {
            throw new TypeError('Failed to fetch');
        }));
        const error = await apiGet('/v1/stocks').catch((caught: unknown) => caught);
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toContain('無法連線');
    });
});
