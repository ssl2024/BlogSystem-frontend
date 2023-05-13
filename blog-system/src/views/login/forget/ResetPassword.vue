<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-14 01:41:50
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 00:48:46
 * @Description: 登录页面-忘记密码模块(重置密码)
-->
<template>
    <!-- S 重置密码模块 -->
    <form class="forget_form">
        <!-- 验证方式 -->
        <div class="validation_method">
            <span class="method_info">157****6364</span>
            <span class="check_code" @click="sendCheckCode">发送验证码</span>
        </div>
        <!-- 验证码 -->
        <div class="check_code">
            <input type="text" placeholder="验证码" />
        </div>
        <!-- 输入密码框 -->
        <div class="forget_pwd">
            <input type="password" placeholder="请输入新密码" ref="newPwd" />
            <i
                v-show="!newPwdState"
                class="iconfont icon-eye-close"
                @click="changeNewPwdState"
            ></i>
            <i
                v-show="newPwdState"
                class="iconfont icon-browse"
                @click="changeNewPwdState"
            ></i>
        </div>
        <!-- 确认密码框 -->
        <div class="forget_pwd">
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
        <!-- 完成 -->
        <div class="forget_btn" @click="forget">完&nbsp;&nbsp;成</div>
    </form>
    <!-- E 重置密码模块 -->
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
export default {
    setup() {
        const data = reactive({
            /**
             * 新密码框内容是否可见
             * false 不可见
             * true  可见
             */
            newPwdState: false,
            /**
             * 确认密码框内容是否可见
             * false 不可见
             * true  可见
             */
            rePwdState: false,
        })

        const newPwd = ref()
        const rePwd = ref()

        /* click 新密码小眼睛 */
        const changeNewPwdState = () => {
            data.newPwdState = !data.newPwdState
            newPwd.value.type = data.newPwdState ? 'text' : 'password'
        }

        /* click 确认密码小眼睛 */
        const changeRePwdState = () => {
            data.rePwdState = !data.rePwdState
            rePwd.value.type = data.rePwdState ? 'text' : 'password'
        }

        /* click 发送验证码 */
        const sendCheckCode = () => {
            console.log('点击了发送验证码')
        }
        return {
            ...toRefs(data),
            newPwd,
            rePwd,
            changeNewPwdState,
            changeRePwdState,
            sendCheckCode,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: skyblue;

/* 登录页面--忘记密码--重置密码
----------------------------------------------------------------*/
.forget_form {
    /* 重置密码 所有的输入框 */
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

    /* 重置密码 验证方式框 */
    .validation_method {
        display: flex;
        position: relative;
        width: 353px;
        height: 45px;
        margin-bottom: 30px;
        padding-left: 20px;
        border: 1px solid $border_line;
        background-color: #fff;
        color: #757575;
        font-size: 16px;
        line-height: 45px;
        border-radius: 5px;

        /* 重置密码 验证方式框--发送验证码 */
        .check_code {
            position: absolute;
            top: 0;
            right: 20px;
            cursor: pointer;
        }
    }

    /* 重置密码 新密码和确认密码框 */
    .forget_pwd {
        position: relative;

        /* 重置密码 新密码和确认密码框--小眼睛 */
        .iconfont {
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 20px;
            cursor: pointer;
        }
    }

    /* 重置密码 完成按钮 */
    .forget_btn {
        width: 375px;
        height: 50px;
        margin-bottom: 30px;
        background-color: #45b8cc;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        line-height: 50px;
        border-radius: 5px;
        opacity: 0.8;
        transition: all 0.3s;
        &:hover {
            opacity: 1;
        }
    }
}
</style>
