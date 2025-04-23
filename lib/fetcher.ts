import deepmerge from 'deepmerge';
import { HttpMethod } from '@/types';

export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const finalOptions = deepmerge(
    {
      method: HttpMethod.GET,
      headers:
        init?.body instanceof FormData
          ? {}
          : {
              'Content-Type': 'application/json',
            },
    },
    init ?? {}
  );

  const response = await fetch(input, finalOptions);

  // Sometime the body can be empty, and the json() will fail
  if (response.status === 204 || response.statusText === 'No Content') {
    return JSON.parse('{}');
  }

  return await response.json();
}
