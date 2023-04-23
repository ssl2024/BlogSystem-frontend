/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:59
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-23 20:25:19
 * @Description:
 */
import { createStore } from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

export default createStore({
    // plugins: [
    //     createPersistedState({
    //         storage: window.localStorage,
    //         reducer: state => {
    //             return {
    //                 // 设置需要持久化的 state(默认存储在localStorage中)
    //                 token: state.token,
    //             }
    //         },
    //     }),
    // ],
    state: {
        /**
         * 登录状态
         * 1 登录
         * 2 注册
         * 3 忘记密码
         */
        loginState: 1,
        /* 用户身份令牌 */
        token: '',
        /* 当前用户信息 */
        user: {
            // 用户id
            id: 19,
            // 用户账号
            account: "",
            // 用户昵称
            nickname: "",
            // 用户手机
            tel: "",
            // 用户邮箱
            email: "",
            // 用户类型
            type: "",
            // 用户头像URL
            avatar:""
            
        }
    },
    getters: {},
    mutations: {
        // 改变登录状态
        changeLoginState(state, loginState) {
            state.loginState = loginState
        },
        /* 更新 token */
        updateToken(state, token) {
            state.token = token
            localStorage.setItem('token', token)
        },
        /* 更新 用户信息 */
        updateUser(state,user) {
            state.user = user
        }
    },
    actions: {},
    modules: {},
})
