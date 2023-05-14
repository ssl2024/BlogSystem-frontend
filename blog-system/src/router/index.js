import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login'
import Attention from '@/views/Attention'
import Rcommd from '@/views/Rcommd'
import Foreend from '@/views/Foreend'
import Backend from '@/views/Backend'
import EntryDetail from '@/views/EntryDetail'

import UserInfo from '@/views/UserInfo'
import Profile from '@/views/userInfo/Profile'
import Account from '@/views/userInfo/Account'
import BlogManage from '@/views/userInfo/BlogManage'

import Center from '@/views/Center'
import Entry from '@/views/center/Entry'
import Like from '@/views/center/Like'
import Collect from '@/views/center/Collect'
import Fans from '@/views/center/Fans'
import Follow from '@/views/center/Follow'

import Edit from '@/views/Edit'

const routes = [
    /* 登录页面 */
    {
        path: '/login',
        component: Login,
    },
    /* 关注页面 */
    {
        path: '/attention',
        component: Attention,
        meta: {
            required: true,
        },
    },
    /* 推荐也买你 */
    {
        path: '/rcommd',
        component: Rcommd,
        meta: {
            required: true,
        },
    },
    /* 前端页面 */
    {
        path: '/foreend',
        component: Foreend,
        meta: {
            required: true,
        },
    },
    /* 后端页面 */
    {
        path: '/backend',
        component: Backend,
        meta: {
            required: true,
        },
    },
    /* 博客详情页 */
    {
        path: '/entryDetail/:id',
        component: EntryDetail,
        meta: {
            required: true,
        },
    },
    /* 用户信息页 */
    {
        path: '/userInfo',
        component: UserInfo,
        meta: {
            required: true,
        },
        children: [
            // 简介模块
            {
                path: '/userInfo/profile',
                component: Profile,
            },
            // 账号模块
            {
                path: '/userInfo/account',
                component: Account,
            },
            // 博客管理模块
            {
                path: '/userInfo/blogManage',
                component: BlogManage,
            },
        ],
    },
    /* 用户主页 */
    {
        path: '/center',
        component: Center,
        meta: {
            required: true,
        },
        children: [
            // 博文模块
            {
                path: '/center/:id',
                component: Entry,
            },
            // 赞过模块
            {
                path: '/center/:id/like',
                component: Like,
            },
            // 收藏模块
            {
                path: '/center/:id/collect',
                component: Collect,
            },
            // 粉丝模块
            {
                path: '/center/:id/fans',
                component: Fans,
            },
            // 关注模块
            {
                path: '/center/:id/follow',
                component: Follow,
            },
        ],
    },
    /* 博客发布页面 */
    {
        path: '/edit',
        component: Edit,
        children: [
            {
                path: '/edit/:id',
                component: Edit,
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
