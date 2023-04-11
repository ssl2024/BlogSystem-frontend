import { createRouter, createWebHistory } from 'vue-router'
import Attention from '@/views/Attention'
import Rcommd from '@/views/Rcommd'
import Foreend from '@/views/Foreend'
import Backend from '@/views/Backend'
import BlogDetail from '@/views/BlogDetail'
import Center from '@/views/Center'
import Entry from '@/views/center/Entry'
import Like from '@/views/center/Like'
import Follow from '@/views/center/Follow'

const routes = [
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
    },
    {
        path: '/blogDetail/:id',
        redirect: BlogDetail,
    },
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
    {
        path: '/:any',
        redirect: '/rcommd',
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
