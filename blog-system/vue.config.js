/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-09 14:32:03
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
            /* 用户相关 */
            '/users': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            /* 博客相关 */
            '/blogs': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            /* 博客类型相关 */
            '/types': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            /* 用户关注与粉丝 */
            '/follows': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            /* 点赞文章 */
            '/likes': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            /* 收藏文章 */
            '/collects': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            /* 评论文章 */
            '/comments': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            // 方式 2  -->  防止重名出现
            // '/ssl': {
            //     target: 'https://baidu.com/', // 该路径会加在整个请求的最前面
            //     changeOrigin: true,
            //     pathRewrite: {
            //         // 路径重写
            //         '/ssl': '',
            //     },
            // },
        },
    },
})
