const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, ...restOptions } = options;
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...restOptions,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new HttpError(response.status, `HTTP помилка: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}