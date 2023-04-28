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
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/attention',
        component: Attention,
        meta: {
            required: true,
        },
    },
    {
        path: '/rcommd',
        component: Rcommd,
        meta: {
            required: true,
        },
    },
    {
        path: '/foreend',
        component: Foreend,
        meta: {
            required: true,
        },
    },
    {
        path: '/backend',
        component: Backend,
        meta: {
            required: true,
        },
        children: [
            {
                path: '/backend/hot',
                component: Backend,
            },
            {
                path: '/backend/new',
                component: Backend,
            },
        ],
    },
    {
        path: '/entryDetail/:id',
        component: EntryDetail,
        meta: {
            required: true,
        },
    },
    /* 个人资料 */
    {
        path: '/userInfo',
        component: UserInfo,
        meta: {
            required: true,
        },
        children: [
            {
                path: '/userInfo/profile',
                component: Profile,
            },
            {
                path: '/userInfo/account',
                component: Account,
            },
            {
                path: '/userInfo/blogManage',
                component: BlogManage,
            },
        ],
    },
    /* 个人主页 */
    {
        path: '/center',
        component: Center,
        meta: {
            required: true,
        },
        children: [
            // 个人主页 博文
            {
                path: '/center/:id',
                component: Entry,
            },
            // 个人主页 赞过
            {
                path: '/center/:id/like',
                component: Like,
            },
            // 个人主页 收藏
            {
                path: '/center/:id/collect',
                component: Collect,
            },
            // 个人主页 粉丝
            {
                path: '/center/:id/fans',
                component: Fans,
            },
            // 个人主页 关注
            {
                path: '/center/:id/follow',
                component: Follow,
            },
        ],
    },
    /* 博客编辑 */
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

// 设置全局路由拦截
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
                    // 携带当前用户想要去的路径参数(可通过 this.$route.query.redirect 获取)
                    redirect: to.fullPath,
                },
            })
        }
    } else {
        next()
    }
})

export default router
