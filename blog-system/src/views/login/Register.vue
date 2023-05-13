<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-13 21:39:59
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 00:53:13
 * @Description: 登录页面-注册模块
-->
<template>
    <!-- S 注册模块 -->
    <div class="register_block">
        <!-- 标题 -->
        <div class="register_title">
            <span>注&nbsp;&nbsp;册</span>
        </div>
        <!-- 注册表单 -->
        <form class="register_form">
            <div class="register_account" :placeholder="accountPlaceholder">
                <input
                    type="text"
                    placeholder="请输入账号"
                    v-model.trim="account"
                    @change="accountChange"
                />
                <i
                    v-show="accountTips === 'success'"
                    class="flag_success iconfont icon-success"
                ></i>
                <i
                    v-show="accountTips === 'warn'"
                    class="flag_warn iconfont icon-warning"
                ></i>
            </div>
            <div class="register_pwd" :placeholder="pwdPlaceholder">
                <input
                    type="password"
                    placeholder="请输入密码"
                    ref="pwd"
                    v-model.trim="pwdText"
                    @change="pwdChange"
                />
                <i
                    v-show="!pwdState"
                    class="eyes iconfont icon-eye-close"
                    @click="changePwdState"
                ></i>
                <i
                    v-show="pwdState"
                    class="eyes iconfont icon-browse"
                    @click="changePwdState"
                ></i>
                <i
                    v-show="pwdTips === 'success'"
                    class="flag_success iconfont icon-success"
                ></i>
                <i
                    v-show="pwdTips === 'warn'"
                    class="flag_warn iconfont icon-warning"
                ></i>
            </div>
            <div class="register_rePwd">
                <input
                    type="password"
                    placeholder="请确认密码"
                    ref="rePwd"
                    v-model.trim="rePwdText"
                    @change="pwdChange"
                />
                <i
                    v-show="!rePwdState"
                    class="eyes iconfont icon-eye-close"
                    @click="changeRePwdState"
                ></i>
                <i
                    v-show="rePwdState"
                    class="eyes iconfont icon-browse"
                    @click="changeRePwdState"
                ></i>
                <i
                    v-show="pwdTips === 'success'"
                    class="flag_success iconfont icon-success"
                ></i>
                <i
                    v-show="pwdTips === 'warn'"
                    class="flag_warn iconfont icon-warning"
                ></i>
            </div>
            <div class="check_code" :placeholder="checkPlaceholder">
                <input
                    type="text"
                    placeholder="验证码"
                    v-model.trim="checkCode"
                />
                <captcha
                    :change="changeImgCode"
                    :contentWidth="120"
                    :contentHeight="47"
                    @click="changeImageCode"
                    @getCode="backImageCode"
                ></captcha>
            </div>
            <div class="register_btn" @click="register">立即注册</div>
        </form>
        <!-- 其他选项(登录) -->
        <div class="register_other">
            <div class="goBackLogin" @click="goBackLogin">返回登录</div>
        </div>
    </div>
    <!-- E 注册模块 -->
</template>

<script>
import { reactive, toRefs, ref, onUnmounted } from 'vue'

import http from '@/utils/http'
import md5 from 'md5'

import captcha from '@/components/Captcha'
export default {
    components: {
        captcha,
    },
    setup(_, { emit }) {
        const data = reactive({
            /* 账号框 */
            account: '',
            /* 密码框 */
            pwdText: '',
            /* 再次数据密码框 */
            rePwdText: '',
            /* 账号框提示信息 */
            accountPlaceholder: '',
            /* 密码框提示信息 */
            pwdPlaceholder: '',
            /* 验证码框提示信息 */
            checkPlaceholder: '',
            /**
             * 账号状态提示
             * success 成功
             * warn    警告
             * */
            accountTips: '',
            /**
             * 密码状态提示
             * success 成功
             * warn    警告
             */
            pwdTips: '',
            /**
             * 密码框状态: 是否显示密码框中的密码
             * false 不显示，password
             * true  显示，text
             */
            pwdState: false,
            /**
             * 确认密码框状态: 是否显示确认密码框中的密码
             * false 不显示，password
             * true  显示，text
             */
            rePwdState: false,
            /* 验证码刷新 */
            changeImgCode: false,
            /* 加密后的验证码值 */
            imgCode: '',
            /* 验证码框 */
            checkCode: '',
            /* 定时器引用 */
            timeId: null,
        })

        /* DOM 密码框 */
        const pwd = ref()
        /* DOM 确认密码框 */
        const rePwd = ref()

        onUnmounted(() => {
            // 清除定时器
            data.timeId && clearTimeout(data.timeId)
        })

        /* change 账号输入框 */
        const accountChange = () => {
            // 判断账号是否符合要求(6-12位字母或数字)
            if (matches(data.account, /[a-zA-Z0-9]{6,12}/, 12)) {
                // 正则验证通过
                accountState(data.account).then(res => {
                    if (res.data.code == '10020') {
                        // 当前账号已存在
                        data.accountTips = 'warn'
                        data.accountPlaceholder = '当前用户已存在'
                    } else if (res.data.code == '10021') {
                        // 当前账号不存在
                        data.accountTips = 'success'
                        data.accountPlaceholder = ''
                        data.accountTips = 'success'
                    } else {
                        // 其他错误
                        console.log(res.data)
                        emit('showMessageBox', {
                            message: '未知错误，请稍后再试',
                            type: 'error',
                        })
                    }
                })
            } else {
                // 正则验证失败
                data.accountTips = 'warn'
                data.accountPlaceholder =
                    '账号不符合要求，长度为6~12位且只能为字母或数字'
            }
        }
        /* change 密码框改变 */
        const pwdChange = () => {
            if (data.pwdText.length == 0 || data.rePwdText.length == 0) {
                // 两个密码框有一个为空
                return
            }
            if (data.rePwdText != data.pwdText) {
                // 两次密码不一致
                data.pwdTips = 'warn'
                data.pwdPlaceholder = '两次密码不一致'
                return
            }
            // 判断账号是否符合要求(6-16位字母数字.)
            if (matches(data.pwdText, /[a-zA-Z0-9]{6,16}/, 16)) {
                // 正则验证通过
                data.pwdTips = 'success'
                data.pwdPlaceholder = ''
            } else {
                // 正则验证失败
                data.pwdTips = 'warn'
                data.pwdPlaceholder =
                    '密码不符合要求，密码只能为6-16位字母数字或小数点'
            }
        }
        /* click 立即注册 */
        const register = () => {
            // 判断账号框和密码框是否符合要求(success)
            if (data.accountTips != 'success' || data.pwdTips != 'success') {
                return emit('showMessageBox', {
                    message: '账号或密码不符合规则，请修改',
                    type: 'warning',
                })
            }
            // 判断验证码是否相同
            if (md5(data.checkCode.toUpperCase()) != data.imgCode) {
                // 验证码错误
                data.checkPlaceholder = '验证码错误'
                // 刷新验证码
                return changeImageCode()
            }
            data.checkPlaceholder = ''
            // 注册信息
            registerUser({
                account: data.account,
                pwd: md5(data.pwdText),
            }).then(res => {
                if (res.data.code == '20011') {
                    // 注册成功返回登录页面
                    emit('showMessageBox', {
                        message: res.data.msg,
                        type: 'success',
                    })
                    data.timeId = setTimeout(() => {
                        goBackLogin()
                    }, 1000)
                } else if (res.data.code == '20010') {
                    // 注册失败
                    emit('showMessageBox', {
                        message: res.data.msg,
                        type: 'error',
                    })
                } else {
                    // 其他错误
                    emit('showMessageBox', {
                        message: '未知错误，请稍后再试',
                        type: 'error',
                    })
                }
            })
        }
        /* click 返回登录 */
        const goBackLogin = () => {
            // 切换到登录页面同时携带账号和密码
            emit('changeLoginState', {
                loginState: 1,
                account: data.account,
                pwd: data.pwdText,
            })
        }
        /* click 密码框小眼睛 */
        const changePwdState = () => {
            data.pwdState = !data.pwdState
            pwd.value.type = data.pwdState ? 'text' : 'password'
        }
        /* click 确认密码框小眼睛 */
        const changeRePwdState = () => {
            data.rePwdState = !data.rePwdState
            rePwd.value.type = data.rePwdState ? 'text' : 'password'
        }
        /* click 点击验证码图片 / 验证码错误 */
        const changeImageCode = () => {
            data.changeImgCode = !data.changeImgCode
        }
        /* 接收组件返回加密后的验证码值 */
        const backImageCode = code => {
            data.imgCode = code
        }
        /**
         * 正则表达式判断
         * param1 需要判断的字符串
         * param2 正则表达式
         * param3 字符串的最大长度(可选)
         * return 布尔值
         *  */
        const matches = (str, reg, maxLen = -1) => {
            // 没有指定最大长度
            if (maxLen == -1) {
                return reg.test(str)
            } else {
                return reg.test(str) && str.length < maxLen
            }
        }

        /* http 查询账号是否存在 */
        const accountState = account => {
            return http.get(`/users/query/${account}`)
        }

        /* http 注册用户 */
        const registerUser = user => {
            return http.post(`/users`, user)
        }
        return {
            ...toRefs(data),
            pwd,
            rePwd,
            accountChange,
            pwdChange,
            register,
            goBackLogin,
            changePwdState,
            changeRePwdState,
            matches,
            changeImageCode,
            backImageCode,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #b6e4f4;

/* 登录页面--注册
----------------------------------------------------------------*/
.register_block {
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    background-color: rgba($color: #b6e4f4, $alpha: 0.7);
    color: rgba($color: #000000, $alpha: 0.7);
    border-radius: 25px;
    transform: translate(-50%, -50%);

    /* 注册 标题 */
    .register_title {
        height: 60px;
        margin-bottom: 20px;
        font-size: 30px;
        font-weight: 600;
        text-align: center;
        line-height: 60px;
    }

    /* 注册 表单 */
    .register_form {
        /* 注册 表单--所有的输入框 */
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

        /* 注册 表单--提示标记 */
        [class^='flag'] {
            position: absolute;
            top: 5px;
            right: -30px;
            font-size: 20px;
        }

        /* 注册 表单--警告标记 */
        .flag_warn {
            color: #faad14;
        }

        /* 注册 表单--成功标记 */
        .flag_success {
            color: #52c41a;
        }

        /* 注册 表单--注册框 */
        .register_account {
            position: relative;

            /* 注册 表单--注册框(提示信息) */
            &::before {
                content: attr(placeholder);
                position: absolute;
                left: 15px;
                bottom: 0;
                height: 30px;
                line-height: 30px;
            }
        }
        /* 注册 表单--密码框和确认密码框 */
        .register_pwd,
        .register_rePwd {
            position: relative;

            /* 注册 表单--密码框(提示信息) */
            &::before {
                content: attr(placeholder);
                position: absolute;
                left: 15px;
                bottom: 0;
                height: 30px;
                line-height: 30px;
            }

            /* 注册 表单--密码框和确认密码框(小眼睛) */
            .eyes {
                position: absolute;
                top: 10px;
                right: 30px;
                font-size: 20px;
                cursor: pointer;
            }
        }

        /* 注册 表单--验证码 */
        .check_code {
            display: flex;
            position: relative;
            width: 375px;
            height: 45px;
            margin-bottom: 30px;
            justify-content: space-between;

            /* 注册 表单--验证码(提示信息) */
            &::before {
                content: attr(placeholder);
                position: absolute;
                left: 15px;
                bottom: -30px;
                height: 30px;
                line-height: 30px;
            }

            /* 注册 表单--验证码(输入框) */
            input {
                flex: 1;
                margin-right: 30px;
            }

            /* 注册 表单--验证码(验证码图片) */
            img {
                width: 120px;
                height: 45px;
            }
        }

        /* 注册 表单--立即注册按钮 */
        .register_btn {
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
            opacity: 0.8;
            transition: all 0.3s;
            &:hover {
                opacity: 1;
            }
        }
    }

    /* 注册 其他选项(返回登录) */
    .register_other {
        display: flex;
        font-size: 18px;
        div {
            cursor: pointer;
        }
    }
}
</style>
