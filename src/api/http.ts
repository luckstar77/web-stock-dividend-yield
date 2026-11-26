import { ApiEnvelope, ResponseCode } from './types';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
    readonly code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
    }
}

type QueryParams = Record<string, string | undefined>;

function buildUrl(path: string, params: QueryParams = {}): string {
    const search = new URLSearchParams();
    for(const [key, value] of Object.entries(params)) {
        if(value !== undefined) search.set(key, value);
    }
    const query = search.toString();
    return `${API_URL}${path}${query ? `?${query}` : ''}`;
}

/**
 * GETs a v1 endpoint and unwraps the `{ status, code, data }` envelope.
 * Resolves to null when the API answers "no data" (code 20400); throws ApiError otherwise.
 */
export async function apiGet<T>(path: string, params?: QueryParams, signal?: AbortSignal): Promise<T | null> {
    let response: Response;
    try {
        response = await fetch(buildUrl(path, params), { signal, headers: { Accept: 'application/json' } });
    } catch(error) {
        if(error instanceof DOMException && error.name === 'AbortError') throw error;
        throw new ApiError('無法連線到伺服器，請檢查網路後再試一次', ResponseCode.SERVER_ERROR);
    }

    let body: ApiEnvelope<T>;
    try {
        body = await response.json() as ApiEnvelope<T>;
    } catch {
        throw new ApiError(`伺服器回應格式錯誤（HTTP ${response.status}）`, ResponseCode.SERVER_ERROR);
    }

    if(body.code === ResponseCode.NO_DATA) return null;
    if(body.status === 'ok' && body.code === ResponseCode.SUCCESS) return body.data ?? null;
    throw new ApiError(body.error?.message ?? '伺服器暫時無法回應，請稍後再試', body.code ?? ResponseCode.SERVER_ERROR);
}
