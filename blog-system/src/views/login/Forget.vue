<template>
    <div class="forget_block">
        <div class="forget_title">
            <span>找回密码</span>
        </div>
        <select-method
            v-show="findState === 1"
            :findMethod="findMethod"
            @changeFindMethod="changeFindMethod"
            @next="next"
        ></select-method>
        <reset-password v-show="findState === 2"></reset-password>
        <div class="forget_other">
            <div class="goBackLogin" @click="goBackLogin">返回登录</div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import selectMethod from '@/views/login/forget/SelectMethod'
import resetPassword from '@/views/login/forget/ResetPassword'

export default {
    components: {
        selectMethod,
        resetPassword,
    },
    setup() {
        const store = useStore()
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

        /* click 返回登录 */
        const goBackLogin = () => {
            store.commit('changeLoginState', 1)
        }
        /* click 验证方式中的 向下箭头 */
        const changeFindMethod = newState => {
            data.findMethod = newState
        }
        /* 更改找回密码状态 */
        const next = () => {
            data.findState = 2
        }
        return {
            ...toRefs(data),
            goBackLogin,
            changeFindMethod,
            next,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 登录页面--忘记密码
----------------------------------------------------------------*/
.forget_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    background-color: #fff4ea;
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
    }
}
</style>
