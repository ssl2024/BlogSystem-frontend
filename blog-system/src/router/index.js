import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    /* 登录页面 */
    {
        path: '/login',
        component: () => import('@/views/Login'),
    },
    /* 关注页面 */
    {
        path: '/attention',
        component: () => import('@/views/Attention'),
        meta: {
            required: true,
        },
    },
    /* 推荐也买你 */
    {
        path: '/rcommd',
        component: () => import('@/views/Rcommd'),
        meta: {
            required: true,
        },
    },
    /* 前端页面 */
    {
        path: '/foreend',
        component: () => import('@/views/Foreend'),
        meta: {
            required: true,
        },
    },
    /* 后端页面 */
    {
        path: '/backend',
        component: () => import('@/views/Backend'),
        meta: {
            required: true,
        },
    },
    /* 博客详情页 */
    {
        path: '/entryDetail/:id',
        component: () => import('@/views/EntryDetail'),
        meta: {
            required: true,
        },
    },
    /* 用户信息页 */
    {
        path: '/userInfo',
        component: () => import('@/views/UserInfo'),
        meta: {
            required: true,
        },
        children: [
            // 简介模块
            {
                path: '/userInfo/profile',
                component: () => import('@/views/userInfo/Profile'),
            },
            // 账号模块
            {
                path: '/userInfo/account',
                component: () => import('@/views/userInfo/Account'),
            },
            // 博客管理模块
            {
                path: '/userInfo/blogManage',
                component: () => import('@/views/userInfo/BlogManage'),
            },
        ],
    },
    /* 用户主页 */
    {
        path: '/center',
        component: () => import('@/views/Center'),
        meta: {
            required: true,
        },
        children: [
            // 博文模块
            {
                path: '/center/:id',
                component: () => import('@/views/center/Entry'),
            },
            // 赞过模块
            {
                path: '/center/:id/like',
                component: () => import('@/views/center/Like'),
            },
            // 收藏模块
            {
                path: '/center/:id/collect',
                component: () => import('@/views/center/Collect'),
            },
            // 粉丝模块
            {
                path: '/center/:id/fans',
                component: () => import('@/views/center/Fans'),
            },
            // 关注模块
            {
                path: '/center/:id/follow',
                component: () => import('@/views/center/Follow'),
            },
        ],
    },
    /* 博客发布页面 */
    {
        path: '/edit',
        component: () => import('@/views/Edit'),
        children: [
            {
                path: '/edit/:id',
                component: () => import('@/views/Edit'),
            },
        ],
    },
    {
        path: '/',
        redirect: '/rcommd',
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

/* 全局路由拦截 */
router.beforeEach((to, from, next) => {
    // 判断要访问的路径是否需要进行验证
    if (to.meta.required) {
        // 查看本地是否有 token
        if (sessionStorage.getItem('vuex')) {
            next()
        } else {
            next({
                path: '/login',
                query: {
                    // 携带当前用户想要去的路径参数(可通过 route.query.redirect 获取)
                    redirect: to.fullPath,
                },
            })
        }
    } else {
        next()
    }
})

export default router
