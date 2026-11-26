import { QueryClient } from '@tanstack/react-query';

const QUERY_RETRY_COUNT = 1;

export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: QUERY_RETRY_COUNT,
                refetchOnWindowFocus: false,
            },
        },
    });
}
