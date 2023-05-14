/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:59
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 16:01:54
 * @Description: Vuex 全局变量定义
 */
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
            reducer: state => {
                return {
                    // 设置需要持久化的 state(默认存储在localStorage中)
                    isLogin: state.isLogin,
                    token: state.token,
                    userId: state.userId,
                }
            },
        }),
    ],
    state: {
        /**
         * 当前用户是否已经登录
         * true  已登录
         * false 未登录
         */
        isLogin: false,
        /* 用户身份令牌 */
        token: '',
        /* 当前登录的用户id */
        userId: -1,
    },
    getters: {},
    mutations: {
        /* 更新 token */
        updateToken(state, token) {
            state.token = token
        },
        /* 更新登录状态 */
        updateLoginState(state, loginState) {
            state.isLogin = loginState
        },
        /* 更新登录用户id */
        updateUserId(state, userId) {
            state.userId = userId
        },
    },
    actions: {},
    modules: {},
})
