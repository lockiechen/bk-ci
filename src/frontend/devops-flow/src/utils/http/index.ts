import httpInstance from './httpClient'
import type { HttpMethod, HttpRequestConfig } from './types'
import { getCache, setCache } from './cache'
import {
  createDebouncedPromise,
  createThrottledPromise,
} from './requestControl'

export async function request<T = any>(
  method: HttpMethod,
  url: string,
  config: HttpRequestConfig = {},
): Promise<T> {
  const finalConfig: HttpRequestConfig = {
    url,
    method,
    ...config,
  }

  const meta = finalConfig.meta || {}
  finalConfig.meta = meta

  const cacheKey =
    meta.cacheKey ||
    `${method}:${url}:${JSON.stringify(
      finalConfig.params || finalConfig.data || {},
    )}`

  if (meta.enableCache) {
    const cached = getCache<T>(cacheKey)
    if (cached) return cached
  }

  const executor = async () => {
    const result = await httpInstance.request<T>(finalConfig)

    if (meta.enableCache) {
      setCache(cacheKey, result, meta.cacheTTL)
    }

    return result
  }

  if (meta.debounceKey && meta.debounceTime) {
    return createDebouncedPromise(meta.debounceKey, meta.debounceTime, executor)
  }

  if (meta.throttleKey && meta.throttleTime) {
    return createThrottledPromise(meta.throttleKey, meta.throttleTime, executor)
  }

  return executor()
}

export function get<T = any>(
  url: string,
  config?: HttpRequestConfig,
): Promise<T> {
  return request<T>('GET', url, config)
}

export function post<T = any>(
  url: string,
  data?: any,
  config?: HttpRequestConfig,
): Promise<T> {
  return request<T>('POST', url, { ...config, data })
}

export function put<T = any>(
  url: string,
  data?: any,
  config?: HttpRequestConfig,
): Promise<T> {
  return request<T>('PUT', url, { ...config, data })
}

export function del<T = any>(
  url: string,
  config?: HttpRequestConfig,
): Promise<T> {
  return request<T>('DELETE', url, config)
}
