/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-20 01:18:10
 * @Description: 对数据请求的封装
 */
import axios from 'axios'
const http = axios.create({
    baseURL: '',
    timeout: 10000,
    headers: {
        token: localStorage.getItem('token'),
    },
})

// 在发送请求之前拦截 -- showLoading

// 在成功后拦截 -- hideLoading

export default http
