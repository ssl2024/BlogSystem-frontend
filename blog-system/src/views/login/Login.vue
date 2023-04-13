<template>
    <div class="login_block">
        <div class="login_title">
            <span>登&nbsp;&nbsp;录</span>
        </div>
        <form class="login_form">
            <div class="login_account">
                <input type="text" placeholder="请输入账号" />
            </div>
            <div class="login_pwd">
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
export default {
    setup() {
        const store = useStore()

        const data = reactive({
            /**
             * 密码是否可见
             * false 不可见
             * true  可见
             */
            pwdState: false,
        })

        const pwd = ref()

        /* 点击登录 */
        const login = () => {
            console.log('点击了登录')
        }
        /* 点击注册账号 */
        const register = () => {
            store.commit('changeLoginState', 2)
        }
        /* 点击忘记密码 */
        const forgetPwd = () => {
            store.commit('changeLoginState', 3)
        }
        /* 点击密码小眼睛 */
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
.login_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    border-radius: 25px;
    background-color: #fff4ea;
    transform: translate(-50%, -50%);
    .login_title {
        height: 60px;
        margin-bottom: 20px;
        font-size: 30px;
        line-height: 60px;
        font-weight: 600;
        text-align: center;
    }
    .login_form {
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
        .login_pwd {
            position: relative;
            .iconfont {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
            }
        }
        .login_btn {
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
    .login_other {
        display: flex;
        font-size: 18px;
        justify-content: space-between;
    }
}
</style>
