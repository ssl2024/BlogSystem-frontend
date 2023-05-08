/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-08 21:55:38
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-08 22:07:15
 * @Description: 展示和隐藏 loading 框
 */
import { ref } from 'vue'
import http from '@/utils/http'

export default function useHttp() {
    const isLoading = ref(false)

    // 添加请求拦截器，在请求发出之前展示 loading
    http.interceptors.request.use(
        config => {
            isLoading.value = true
            return config
        },
        err => {
            isLoading.value = false
            return Promise.reject(err)
        }
    )

    // 添加响应拦截器，在响应后隐藏 loading
    http.interceptors.response.use(
        response => {
            isLoading.value = false
            return response
        },
        err => {
            isLoading.value = false
            return Promise.reject(err)
        }
    )

    return {
        isLoading,
    }
}
