<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-13 00:46:55
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-27 22:56:35
 * @Description: 登录页面
-->
<template>
    <login
        v-show="loginState === 1"
        @changeLoginState="changeLoginState"
    ></login>
    <register
        v-show="loginState === 2"
        @changeLoginState="changeLoginState"
    ></register>
    <forget
        v-show="loginState === 3"
        @changeLoginState="changeLoginState"
    ></forget>
    <message-tips></message-tips>
</template>

<script>
import { reactive, toRefs } from 'vue'

import messageTips from '@/components/login/MessageTips'

import login from '@/views/login/Login'
import register from '@/views/login/Register'
import forget from '@/views/login/Forget'
export default {
    components: {
        login,
        register,
        forget,
        messageTips,
    },
    setup() {
        const data = reactive({
            /**
             * 登录状态
             * 1 登录
             * 2 注册
             * 3 忘记密码
             */
            loginState: 1,
        })

        /* customEvent 修改登录状态 */
        const changeLoginState = state => {
            data.loginState = state
        }
        return {
            ...toRefs(data),
            changeLoginState,
        }
    },
}
</script>

<style lang="scss" scoped="scoped"></style>
