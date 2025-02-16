export class APIError extends Error {
  status: number;
  data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'APIError';
    this.status = status ?? 500;
    this.data = data;
  }
}

export async function api<T = unknown>(...params: Parameters<typeof fetch>) {
  const [path, options] = params;
  const { headers, ...restOptions } = options ?? {};

  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    ...restOptions,
  });
  const data = (await res.json()) as unknown;
  if (!res.ok) {
    throw new APIError('API request failed', res.status, data);
  }
  return data as T;
}
