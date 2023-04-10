import { createRouter, createWebHistory } from 'vue-router'
import Attention from '@/views/Attention'
import Recommend from '@/views/Recommend'
import Foreend from '@/views/Foreend'
import Backend from '@/views/Backend'
import BlogDetail from '@/views/BlogDetail'

const routes = [
    {
        path: '/attention',
        component: Attention,
    },
    {
        path: '/recommend',
        component: Recommend,
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
        path: '/',
        redirect: '/recommend',
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
