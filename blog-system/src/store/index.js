/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:59
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-27 22:46:36
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
        /* 当前用户信息 */
        user: {
            // 用户id
            id: 19,
            // 用户账号
            account: '',
            // 用户昵称
            nickname: '',
            // 用户手机
            tel: '',
            // 用户邮箱
            email: '',
            // 用户类型
            type: '',
            // 用户头像URL
            avatar: '',
        },
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
        /* 更新 用户信息 */
        updateUser(state, user) {
            state.user = user
        },
    },
    actions: {},
    modules: {},
})
