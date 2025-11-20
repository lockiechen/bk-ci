import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'
import { API_BASE_URL, HTTP_TIMEOUT } from './config'
import type {
  HttpRequestConfig,
  HttpResponse,
  HttpResponseEnvelope,
} from './types'
import { retryRequest } from './retry'
import { handleHttpError, HttpError } from './error'
import { useAuthStore } from '@/stores/auth'
import { useHttpLogStore } from '@/stores/httpLog'

const httpInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: HTTP_TIMEOUT,
  withCredentials: true,
})

httpInstance.interceptors.request.use(
  (config: HttpRequestConfig) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (!config.headers) config.headers = {}

    config.headers['Accept'] = 'application/json'
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }

    if (!config.meta?.skipAuth && token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    ;(config as any).__startTime = Date.now()

    return config
  },
  (error) => Promise.reject(error),
)

httpInstance.interceptors.response.use(
  (response: HttpResponse<HttpResponseEnvelope<any>>) => {
    const httpLogStore = useHttpLogStore()
    const config = response.config as HttpRequestConfig
    const duration = Date.now() - ((config as any).__startTime || Date.now())

    httpLogStore.addLog({
      url: config.url || '',
      method: (config.method || 'GET').toUpperCase(),
      status: response.status,
      duration,
      timestamp: Date.now(),
    })

    const envelope = response.data

    if (
      typeof envelope === 'object' &&
      envelope &&
      'code' in envelope &&
      'data' in envelope
    ) {
      if (envelope.code === 0) {
        return envelope.data
      }

      const businessError = new HttpError({
        type: 'business',
        message: envelope.message || 'Business error',
        business: {
          code: envelope.code,
          message: envelope.message,
        },
      })

      if (!config.meta?.silent && config.meta?.showBusinessError !== false) {
        handleHttpError(businessError)
      }

      return Promise.reject(businessError)
    }

    return response.data as any
  },
  async (error: AxiosError) => {
    const config = error.config as HttpRequestConfig | undefined

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      if (config?.meta?.retry || config?.meta?.retry === 0) {
        try {
          const newConfig = await retryRequest(error)
          return httpInstance.request(newConfig)
        } catch (err) {
          const timeoutError = new HttpError({
            type: 'timeout',
            message: 'Request timeout',
            raw: error,
          })
          if (!config?.meta?.silent) {
            handleHttpError(timeoutError)
          }
          return Promise.reject(timeoutError)
        }
      }
    }

    if (!error.response) {
      const networkError = new HttpError({
        type: 'network',
        message: 'Network error',
        raw: error,
      })
      if (!config?.meta?.silent) {
        handleHttpError(networkError)
      }
      return Promise.reject(networkError)
    }

    const status = error.response.status
    const httpError = new HttpError({
      type: 'http',
      message: error.response.statusText || `HTTP Error ${status}`,
      status,
      raw: error,
    })

    if (!config?.meta?.silent) {
      handleHttpError(httpError)
    }

    return Promise.reject(httpError)
  },
)

export default httpInstance
