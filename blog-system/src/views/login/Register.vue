<template>
    <div class="register_block">
        <div class="register_title">
            <span>注&nbsp;&nbsp;册</span>
        </div>
        <form class="register_form">
            <div class="register_account">
                <input type="text" placeholder="请输入账号" />
            </div>
            <div class="register_pwd">
                <input type="password" placeholder="请输入密码" ref="pwd" />
                <i
                    v-if="!pwdState"
                    class="iconfont icon-eye-close"
                    @click="changePwdState"
                ></i>
                <i
                    v-if="pwdState"
                    class="iconfont icon-browse"
                    @click="changePwdState"
                ></i>
            </div>
            <div class="register_rePwd">
                <input type="password" placeholder="请确认密码" ref="rePwd" />
                <i
                    v-if="!rePwdState"
                    class="iconfont icon-eye-close"
                    @click="changeRePwdState"
                ></i>
                <i
                    v-if="rePwdState"
                    class="iconfont icon-browse"
                    @click="changeRePwdState"
                ></i>
            </div>
            <div class="check_code">
                <input type="text" placeholder="验证码" />
                <img src="https://iph.href.lu/120x45" alt="验证码" />
            </div>
            <div class="register_btn" @click="register">立即注册</div>
        </form>
        <div class="register_other">
            <div class="goBackLogin" @click="goBackLogin">返回登录</div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import { useStore } from 'vuex'
export default {
    setup() {
        const store = useStore()

        const data = reactive({
            pwdState: false,
            rePwdState: false,
        })

        const pwd = ref()
        const rePwd = ref()

        /* 点击立即注册 */
        const register = () => {
            console.log('点击了注册按钮')
        }
        /* 点击返回登录 */
        const goBackLogin = () => {
            store.commit('changeLoginState', 1)
        }
        /* 点击密码小眼睛 */
        const changePwdState = () => {
            data.pwdState = !data.pwdState
            pwd.value.type = data.pwdState ? 'text' : 'password'
        }
        /* 点击再次输入密码小眼睛 */
        const changeRePwdState = () => {
            data.rePwdState = !data.rePwdState
            rePwd.value.type = data.rePwdState ? 'text' : 'password'
        }
        return {
            ...toRefs(data),
            pwd,
            rePwd,
            register,
            goBackLogin,
            changePwdState,
            changeRePwdState,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
.register_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    border-radius: 25px;
    background-color: #fff4ea;
    transform: translate(-50%, -50%);
    .register_title {
        height: 60px;
        margin-bottom: 20px;
        font-size: 30px;
        line-height: 60px;
        font-weight: 600;
        text-align: center;
    }
    .register_form {
        /* 登录表单中的所有输入框 */
        input {
            width: 350px;
            height: 45px;
            padding-left: 20px;
            border: 1px solid skyblue;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            margin-bottom: 30px;
        }
        .register_pwd,
        .register_rePwd {
            position: relative;
            .iconfont {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
            }
        }
        .check_code {
            display: flex;
            width: 375px;
            height: 45px;
            margin-bottom: 30px;
            justify-content: space-between;
            input {
                flex: 1;
                margin-right: 30px;
            }
            img {
                width: 120px;
                height: 45px;
            }
        }
        .register_btn {
            width: 375px;
            height: 50px;
            margin-bottom: 30px;
            border: 1px solid skyblue;
            background-color: #8f2b26;
            color: #fff;
            font-size: 18px;
            text-align: center;
            font-weight: 600;
            line-height: 50px;
            border-radius: 5px;
        }
    }
    .register_other {
        display: flex;
        font-size: 18px;
    }
}
</style>
