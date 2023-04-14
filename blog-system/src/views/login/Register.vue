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
            <div class="register_rePwd">
                <input type="password" placeholder="请确认密码" ref="rePwd" />
                <i
                    v-show="!rePwdState"
                    class="iconfont icon-eye-close"
                    @click="changeRePwdState"
                ></i>
                <i
                    v-show="rePwdState"
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

        /* DOM 密码框 */
        const pwd = ref()
        /* DOM 确认密码框 */
        const rePwd = ref()

        /* click 立即注册 */
        const register = () => {
            console.log('点击了注册按钮')
        }
        /* click 返回登录 */
        const goBackLogin = () => {
            store.commit('changeLoginState', 1)
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
/* 边框分隔线颜色 */
$border_line: skyblue;

/* 登录页面--注册
----------------------------------------------------------------*/
.register_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    background-color: #fff4ea;
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
            width: 350px;
            height: 45px;
            margin-bottom: 30px;
            padding-left: 20px;
            border: 1px solid $border_line;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
        }

        /* 注册 表单--密码框和确认密码框 */
        .register_pwd,
        .register_rePwd {
            position: relative;

            /* 注册 表单--密码框和确认密码框(小眼睛) */
            .iconfont {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
            }
        }

        /* 注册 表单--验证码 */
        .check_code {
            display: flex;
            width: 375px;
            height: 45px;
            margin-bottom: 30px;
            justify-content: space-between;

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

    /* 注册 其他选项(返回登录) */
    .register_other {
        display: flex;
        font-size: 18px;
    }
}
</style>
