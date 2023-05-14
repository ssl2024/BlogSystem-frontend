const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    /* 配置反向代理 */
    devServer: {
        port: 8080, // 配置端口号
        proxy: {
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
        },
    },
})
