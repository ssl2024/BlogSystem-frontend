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

import Center from '@/views/Center'
import Entry from '@/views/center/Entry'
import Like from '@/views/center/Like'
import Follow from '@/views/center/Follow'
import Fans from '@/views/center/Fans'

const routes = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/attention',
        component: Attention,
    },
    {
        path: '/rcommd',
        component: Rcommd,
    },
    {
        path: '/foreend',
        component: Foreend,
    },
    {
        path: '/backend',
        component: Backend,
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
    },
    /* 个人资料 */
    {
        path: '/userInfo/:id',
        component: UserInfo,
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
                path: '/userInfo/:any',
                redirect: '/userInfo/profile',
            },
        ],
    },
    /* 个人主页 */
    {
        path: '/center',
        component: Center,
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
                path: '/center/:any',
                redirect: '/center/entry',
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

export default router
