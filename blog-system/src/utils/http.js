/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-20 01:18:10
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 02:17:27
 * @Description: 对axios请求进行封装，给每次请求添加token以及同时发送多个axios请求
 */
import axios from 'axios'

const http = axios.create({
    baseURL: '',
    timeout: 10000,
})

http.interceptors.request.use(config => {
    // 获取 sessionStorage 中保存的 token
    const vuexStr = window.sessionStorage.getItem('vuex')
    if (vuexStr) {
        // 解析成 JSON 对象
        const vuexObj = JSON.parse(vuexStr)
        const token = vuexObj.token
        // 将 token 添加到请求头中
        if (token) {
            config.headers.token = token
        }
    }
    return config
})

/* 同时发送多个 axios 请求 */
http.all = requests => {
    return axios.all(requests)
}

export default http
