/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-08 21:55:38
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 00:10:37
 * @Description: 对http请求进行封装，在发送http请求前展示loading框，在接收到http结果后隐藏loading框
 */
import http from '@/utils/http'

export default function useHttp() {
    // var arr = []

    // 添加请求拦截器，在请求发出之前展示 loading
    http.interceptors.request.use(
        config => {
            // console.log(config)
            return config
        },
        err => {
            return Promise.reject(err)
        }
    )

    // 添加响应拦截器，在响应后隐藏 loading
    http.interceptors.response.use(
        response => {
            return response
        },
        err => {
            return Promise.reject(err)
        }
    )
}
