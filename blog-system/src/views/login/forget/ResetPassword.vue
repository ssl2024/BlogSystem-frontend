<template>
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
</template>

<script>
export default {}
</script>

<style lang="scss" scoped="scoped">
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
</style>
