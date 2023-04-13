import { createStore } from 'vuex'

export default createStore({
    state: {
        /**
         * 登录状态
         * 1 登录
         * 2 注册
         * 3 忘记密码
         */
        loginState: 3,
    },
    getters: {},
    mutations: {
        changeLoginState(state, newLoginState) {
            state.loginState = newLoginState
        },
    },
    actions: {},
    modules: {},
})
