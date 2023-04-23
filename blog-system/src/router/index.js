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
import Follow from '@/views/center/Follow'
import Fans from '@/views/center/Fans'

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
            // {
            //     path: '/backend/',
            //     redirect: '/backend/hot',
            // },
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
        path: '/userInfo/:id',
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
            {
                path: '/userInfo/:any',
                redirect: '/userInfo/profile',
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
            {
                path: '/center/entry',
                component: Entry,
            },
            {
                path: '/center/like',
                component: Like,
            },
            {
                path: '/center/follow',
                component: Follow,
            },
            {
                path: '/center/fans',
                component: Fans,
            },
            {
                path: '/center/',
                redirect: '/center/entry',
            },
            {
                path: '/center/:id',
                redirect: '/center/entry',
            },
        ],
    },
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
    // {
    //     path: '/:any',
    //     redirect: '/rcommd',
    // },
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
        if (localStorage.getItem('token')) {
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
