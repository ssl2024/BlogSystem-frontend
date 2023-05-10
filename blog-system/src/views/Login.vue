<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-13 00:46:55
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-10 23:57:45
 * @Description: 登录页面
-->
<template>
        <!-- 登录组件 -->
        <login
            v-if="loginState === 1"
            :user="user"
            @changeLoginState="changeLoginState"
            @showMessageBox="showMessageBox"
        ></login>
        <!-- 注册组件 -->
        <register
            v-if="loginState === 2"
            @changeLoginState="changeLoginState"
            @showMessageBox="showMessageBox"
        ></register>
        <!-- 忘记密码组件 -->
        <forget
            v-if="loginState === 3"
            @changeLoginState="changeLoginState"
        ></forget>
        <!-- 消息提示框 -->
        <message-box
            :message="message"
            :messageId="messageId"
            :type="messageType"
        ></message-box>
</template>

<script>
import { reactive, toRefs } from 'vue'

import login from '@/views/login/Login'
import register from '@/views/login/Register'
import forget from '@/views/login/Forget'
export default {
    components: {
        login,
        register,
        forget,
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
            /* 消息提示框内容 */
            message: '',
            /* 消息提示框id */
            messageId: -1,
            /* 消息提示框类型 */
            messageType: '',
            /* 用户信息 */
            user: {
                // 用户账号
                account: '',
                // 用户密码
                pwd: '',
            },
        })

        /* 显示消息提示框 */
        const showMessageBox = args => {
            let date = new Date()
            data.message = args.message
            data.messageType = args.type
            data.messageId = date.getTime()
        }

        /* customEvent 修改登录状态 */
        const changeLoginState = args => {
            data.loginState = args.loginState
            data.user.account = args.account
            data.user.pwd = args.pwd
        }
        return {
            ...toRefs(data),
            showMessageBox,
            changeLoginState,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
// .login_wrapper {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     background-color: skyblue;
// }
</style>
