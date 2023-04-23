/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-22 16:02:08
 * @Description:
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    /* 配置反向代理 */
    devServer: {
        port: 8080, // 配置端口号
        proxy: {
            // 方式 1
            '/users': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/blogs': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/types': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            // 方式 2  -->  防止重名出现
            // '/kerwin': {
            //     target: 'https://m.maoyan.com/', // 该路径会加在整个请求的最前面
            //     changeOrigin: true,
            //     pathRewrite: {
            //         // 路径重写
            //         '/kerwin': '',
            //     },
            // },
        },
    },
})
