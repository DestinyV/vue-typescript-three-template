import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const httpService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

httpService.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (error:AxiosError) => {
    return Promise.reject(error)
  }
)

httpService.interceptors.response.use(
  (response:AxiosResponse) => {
    return response
  },
  (error:AxiosError) => {
    return Promise.reject(error)
  }
)


export default httpService
