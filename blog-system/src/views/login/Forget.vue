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
        /* 点击返回登录 */
        const goBackLogin = () => {
            store.commit('changeLoginState', 1)
        }
        /* 更改验证方式 */
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
.forget_block {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 30px 70px;
    border-radius: 25px;
    background-color: #fff4ea;
    transform: translate(-50%, -50%);
    .forget_title {
        height: 60px;
        margin-bottom: 20px;
        font-size: 30px;
        line-height: 60px;
        font-weight: 600;
        text-align: center;
    }
    // .forget_form {
    //     /* 登录表单中的所有输入框 */
    //     input {
    //         width: 350px;
    //         height: 45px;
    //         padding-left: 20px;
    //         border: 1px solid skyblue;
    //         font-size: 16px;
    //         border-radius: 5px;
    //         outline: none;
    //         margin-bottom: 30px;
    //     }
    //     .find {
    //         display: flex;
    //         position: relative;
    //         height: 50px;
    //         margin-bottom: 30px;
    //         padding: 0 40px 0 20px;
    //         border: 1px solid skyblue;
    //         background-color: #fff;
    //         color: #757575;
    //         font-size: 15px;
    //         line-height: 50px;
    //         border-radius: 5px;
    //         justify-content: space-between;
    //         .find_method {
    //             cursor: pointer;
    //         }
    //         .iconfont {
    //             position: absolute;
    //             top: 0px;
    //             right: 20px;
    //             cursor: pointer;
    //         }
    //         .method_list {
    //             position: absolute;
    //             top: 110%;
    //             left: -2px;
    //             width: 375px;
    //             border: 1px solid #f3f3f3;
    //             background-color: #fff;
    //             .method_item {
    //                 padding-left: 55px;
    //                 border-top: 1px solid #f3f3f3;
    //                 &:hover {
    //                     background-color: skyblue;
    //                     color: #fff;
    //                 }
    //             }
    //         }
    //     }
    //     .forget_btn {
    //         width: 375px;
    //         height: 50px;
    //         margin-bottom: 30px;
    //         // border: 1px solid skyblue;
    //         background-color: #8f2b26;
    //         color: #fff;
    //         font-size: 18px;
    //         text-align: center;
    //         font-weight: 600;
    //         line-height: 50px;
    //         border-radius: 5px;
    //     }
    // }
    .forget_other {
        display: flex;
        font-size: 18px;
    }
}
</style>
