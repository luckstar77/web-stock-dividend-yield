import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { routes } from '../app/routes';
import theme from '../theme/theme';

/** Renders the whole app at a route, with retries off so error states show at once. */
export function renderRoute(path: string) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    const result = render(
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>,
    );
    return { ...result, router };
}

interface MockRoute {
    path: string;
    body: unknown;
    status?: number;
}

/** Replaces fetch with canned envelopes by path; returns the mock to inspect the calls. */
export function mockFetch(responses: MockRoute[]) {
    const mock = vi.fn(async (input: RequestInfo | URL) => {
        const url = new URL(String(input), 'http://localhost');
        const match = responses.find((route) => route.path === url.pathname);
        if(!match) return new Response(JSON.stringify({ status: 'error', code: 50000, error: { message: 'not mocked' } }), { status: 500 });
        return new Response(JSON.stringify(match.body), { status: match.status ?? 200, headers: { 'Content-Type': 'application/json' } });
    });
    vi.stubGlobal('fetch', mock);
    return mock;
}

export function ok<T>(data: T) {
    return { status: 'ok', code: 20000, data };
}
