/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-20 01:18:10
 * @Description: 对数据请求的封装
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

// 在发送请求之前拦截 -- showLoading

// 在成功后拦截 -- hideLoading

export default http
