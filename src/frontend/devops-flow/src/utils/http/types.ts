export interface HttpResponseEnvelope<T = unknown> {
  code: number
  message: string
  data: T
}

export interface RequestMeta {
  retry?: number
  retryDelay?: number
  enableCache?: boolean
  cacheKey?: string
  cacheTTL?: number
  debounceKey?: string
  debounceTime?: number
  throttleKey?: string
  throttleTime?: number
  silent?: boolean
  showBusinessError?: boolean
  skipAuth?: boolean
}

export interface HttpRequestConfig<TData = any>
  extends import('axios').AxiosRequestConfig<TData> {
  meta?: RequestMeta
}

export interface HttpResponse<T = unknown>
  extends import('axios').AxiosResponse<T> {}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface BusinessErrorPayload {
  code: number | string
  message: string
  traceId?: string
}
