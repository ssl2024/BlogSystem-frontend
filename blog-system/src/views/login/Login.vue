<template>
    <div class="login_block">
        <div class="login_title">
            <span>登&nbsp;&nbsp;录</span>
        </div>
        <form class="login_form">
            <div class="login_account">
                <input
                    type="text"
                    placeholder="请输入账号"
                    v-model.trim="account"
                />
            </div>
            <div class="login_pwd">
                <input
                    type="password"
                    placeholder="请输入密码"
                    ref="pwd"
                    v-model.lazy="pwdText"
                />
                <i
                    v-show="!pwdState"
                    class="iconfont icon-eye-close"
                    @click="changePwdState"
                ></i>
                <i
                    v-show="pwdState"
                    class="iconfont icon-browse"
                    @click="changePwdState"
                ></i>
            </div>
            <div class="login_btn" @click="login">登&nbsp;&nbsp;录</div>
        </form>
        <div class="login_other">
            <div class="forget_pwd" @click="forgetPwd">忘记密码</div>
            <div class="register" @click="register">注册账号</div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import md5 from 'md5'

import http from '@/utils/http'
export default {
    setup(_, { emit }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const data = reactive({
            /* 账号框 */
            account: '',
            /* 密码框 */
            pwdText: '',
            /**
             * 是否显示密码框
             * false 不显示
             * true  显示
             */
            pwdState: false,
        })

        /* DOM 密码框 */
        const pwd = ref()

        /* click 登录 */
        const login = () => {
            // 判断账号框和密码框是否为空
            if (data.account.length === 0 || data.pwdText.length === 0) {
                // 账号框 或 密码为空
                alert('账号或密码不能为空')
                return
            }
            http.post('/users/login', {
                account: data.account,
                pwd: md5(data.pwdText),
            }).then(res => {
                if (res.data.code === 20041) {
                    // 登录成功
                    alert('登录成功')
                    // 将 token 存入 vuex
                    store.commit('updateToken', res.data.data.token)
                    // 更新登录状态
                    store.commit('updateLoginState', true)
                    // 将 当前用户信息 存入 vuex
                    store.commit('updateUser', res.data.data.user)
                    // 跳转页面
                    if (route.query.redirect) {
                        router.push(route.query.redirect)
                    } else {
                        router.push('/rcommd')
                    }
                } else if (res.data.code === 20040) {
                    // 账号或密码错误
                    alert(res.data.msg)
                } else {
                    // 其他错误
                    alert('未知错误')
                }
            })
        }
        /* click 注册账号 */
        const register = () => {
            emit('changeLoginState', 2)
        }
        /* click 忘记密码 */
        const forgetPwd = () => {
            emit('changeLoginState', 3)
        }
        /* click 密码小眼睛 */
        const changePwdState = () => {
            data.pwdState = !data.pwdState
            pwd.value.type = data.pwdState ? 'text' : 'password'
        }
        return {
            ...toRefs(data),
            pwd,
            login,
            register,
            forgetPwd,
            changePwdState,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: skyblue;

/* 登录页面--登录
----------------------------------------------------------------*/
.login_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    background-color: #fff4ea;
    border-radius: 25px;
    transform: translate(-50%, -50%);

    /* 登录 标题 */
    .login_title {
        height: 60px;
        margin-bottom: 20px;
        font-size: 30px;
        font-weight: 600;
        text-align: center;
        line-height: 60px;
    }

    /* 登录 表单 */
    .login_form {
        /* 登录 表单--所有的输入框 */
        input {
            width: 350px;
            height: 45px;
            margin-bottom: 30px;
            padding-left: 20px;
            border: 1px solid $border_line;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
        }

        /* 登录 表单--密码框 */
        .login_pwd {
            position: relative;

            /* 登录 表单--密码框(小眼睛) */
            .iconfont {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
            }
        }

        /* 登录 登录按钮 */
        .login_btn {
            width: 375px;
            height: 50px;
            margin-bottom: 30px;
            border: 1px solid $border_line;
            background-color: #8f2b26;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            border-radius: 5px;
        }
    }

    /* 登录 其他选项(忘记密码/注册账号) */
    .login_other {
        display: flex;
        font-size: 18px;
        justify-content: space-between;
        div {
            cursor: pointer;
        }
    }
}
</style>
