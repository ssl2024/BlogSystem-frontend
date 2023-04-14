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

        /* DOM 密码框 */
        const pwd = ref()

        /* click 登录 */
        const login = () => {
            console.log('点击了登录')
        }
        /* click 注册账号 */
        const register = () => {
            store.commit('changeLoginState', 2)
        }
        /* click 忘记密码 */
        const forgetPwd = () => {
            store.commit('changeLoginState', 3)
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
            border-radius: 5px;
        }
    }

    /* 登录 其他选项(忘记密码/注册账号) */
    .login_other {
        display: flex;
        font-size: 18px;
        justify-content: space-between;
    }
}
</style>
