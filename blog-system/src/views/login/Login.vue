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
                    v-model.trim="pwdText"
                    @keydown.enter="login"
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
import { reactive, toRefs, ref, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import md5 from 'md5'

import http from '@/utils/http'
export default {
    props: {
        user: {
            type: Object,
        },
    },
    setup(props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const data = reactive({
            /* 账号框 */
            account: props.user.account,
            /* 密码框 */
            pwdText: props.user.pwd,
            /**
             * 是否显示密码框
             * false 不显示
             * true  显示
             */
            pwdState: false,
            /* 定时器引用 */
            timeId: null,
        })

        /* DOM 密码框 */
        const pwd = ref()

        onUnmounted(() => {
            // 清除定时器
            data.timeId && clearTimeout(data.timeId)
        })

        watch(
            () => props.user,
            () => {
                data.account = props.user.account
                data.pwdText = props.user.pwd
            }
        )

        /* 在 url 后添加随机参数(暂未使用) */
        const addRandomQueryParam = url => {
            const randomParamName = 'nonce'
            const randomParamValue = Math.random()
            const separator = url.includes('?') ? '&' : '?'
            return `${url}${separator}${randomParamName}=${randomParamValue}`
        }

        /* click 登录 */
        const login = () => {
            // 判断账号框和密码框是否为空
            if (data.account === '' || data.pwdText === '') {
                // 账号框 或 密码为空
                return emit('showMessageBox', {
                    message: '账号或密码不能为空',
                    type: 'error',
                })
            }
            userLogin(data.account, md5(data.pwdText))
                .then(res => {
                    if (res.data.code === 20041) {
                        // 登录成功
                        emit('showMessageBox', {
                            message: '登录成功',
                            type: 'success',
                        })
                        setTimeout(() => {
                            // 将 token 存入 vuex
                            store.commit('updateToken', res.data.data.token)
                            // 更新登录状态
                            store.commit('updateLoginState', true)
                            // 将 当前用户id 存入 vuex
                            store.commit('updateUserId', res.data.data.user.id)
                            // 跳转页面
                            if (route.query.redirect) {
                                router.push(route.query.redirect)
                            } else {
                                router.push('/rcommd')
                            }
                        }, 1000)
                    } else if (res.data.code === 20040) {
                        // 账号或密码错误
                        emit('showMessageBox', {
                            message: '账号或密码错误',
                            type: 'error',
                        })
                    }
                })
                .catch(() => {
                    // 其他错误
                    emit('showMessageBox', {
                        message: '未知错误，请稍后重试',
                        type: 'error',
                    })
                })
        }
        /* click 注册账号 */
        const register = () => {
            emit('changeLoginState', { loginState: 2 })
        }
        /* click 忘记密码 */
        const forgetPwd = () => {
            return emit('showMessageBox', {
                message: '找回密码功能暂未实现，正努力开发中。。。',
                type: 'error',
            })
            // emit('changeLoginState', { loginState: 3 })
        }
        /* click 密码小眼睛 */
        const changePwdState = () => {
            data.pwdState = !data.pwdState
            pwd.value.type = data.pwdState ? 'text' : 'password'
        }

        /* http 用户登录 */
        const userLogin = (account, pwd) => {
            return http.post(`/users/login`, {
                account,
                pwd,
            })
        }
        return {
            ...toRefs(data),
            pwd,
            addRandomQueryParam,
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
$border_line: #b6e4f4;

/* 登录页面--登录
----------------------------------------------------------------*/
.login_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    background-color: rgba($color: #b6e4f4, $alpha: 0.7);
    color: rgba($color: #000000, $alpha: 0.7);
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
            width: 353px;
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
            background-color: #45b8cc;
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
