<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-13 21:39:44
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 14:46:32
 * @Description: 登录页面-忘记密码模块
-->
<template>
    <!-- S 忘记密码模块 -->
    <div class="forget_block">
        <!-- 标题 -->
        <div class="forget_title">
            <span>找回密码</span>
        </div>
        <!-- 找回方式模块 -->
        <select-method
            v-show="findState === 1"
            :findMethod="findMethod"
            @changeFindMethod="changeFindMethod"
            @next="next"
        ></select-method>
        <!-- 重置密码模块 -->
        <reset-password v-show="findState === 2"></reset-password>
        <!-- 其他选项 -->
        <div class="forget_other">
            <div class="goBackLogin" @click="goBackLogin">返回登录</div>
        </div>
    </div>
    <!-- E 忘记密码模块 -->
</template>

<script>
import { reactive, toRefs } from 'vue'
import selectMethod from '@/views/login/forget/SelectMethod'
import resetPassword from '@/views/login/forget/ResetPassword'

export default {
    components: {
        selectMethod,
        resetPassword,
    },
    setup(_, { emit }) {
        const data = reactive({
            /**
             * 验证方式
             * 1 手机验证
             * 2 邮箱验证
             */
            findMethod: 1,
            /**
             * 找回密码状态
             * 1 选择找回方式
             * 2 重置密码
             */
            findState: 1,
        })


        /* customEvent 更改找回密码状态 */
        const next = () => {
            data.findState = 2
        }

        /* click 返回登录 */
        const goBackLogin = () => {
            emit('changeLoginState', { loginState: 1 })
        }
        /* click 验证方式中的 向下箭头 */
        const changeFindMethod = newState => {
            data.findMethod = newState
        }
        return {
            ...toRefs(data),
            next,
            goBackLogin,
            changeFindMethod,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 登录页面--忘记密码模块
----------------------------------------------------------------*/
.forget_block {
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    background-color: rgba($color: #b6e4f4, $alpha: 0.7);
    color: rgba($color: #000000, $alpha: 0.7);
    border-radius: 25px;
    transform: translate(-50%, -50%);

    /* 忘记密码 标题 */
    .forget_title {
        height: 60px;
        margin-bottom: 20px;
        font-size: 30px;
        font-weight: 600;
        text-align: center;
        line-height: 60px;
    }

    /* 忘记密码 其他操作(返回登录) */
    .forget_other {
        display: flex;
        font-size: 18px;
        div {
            cursor: pointer;
        }
    }
}
</style>
