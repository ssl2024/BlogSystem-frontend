/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-08 21:55:38
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 02:18:37
 * @Description: 对http请求进行封装，在发送http请求前展示loading框，在接收到http结果后隐藏loading框
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
