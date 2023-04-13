<template>
    <form class="forget_form">
        <div class="forget_account">
            <input type="text" placeholder="请输入账号" />
        </div>
        <div class="find">
            <div class="find_tips">验证方式</div>
            <div
                class="find_method"
                @click="findMethodsState = !findMethodsState"
            >
                {{ findMethod === 1 ? '手机验证' : '邮箱验证' }}
            </div>
            <i
                class="iconfont icon-xiangxiajiantou"
                @click="findMethodsState = !findMethodsState"
            ></i>
            <ul
                v-show="findMethodsState"
                class="method_list"
                @click="changeMethod"
            >
                <li class="method_item">手机验证</li>
                <li class="method_item">邮箱验证</li>
            </ul>
        </div>
        <div class="forget_btn" @click="next">下一步</div>
    </form>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
    props: {
        findMethod: {
            type: Number,
            required: true,
        },
    },
    setup(props, { emit }) {
        const data = reactive({
            findMethodsState: false,
        })

        /* 点击下一步 */
        const next = () => {
            emit('next')
        }

        /* 切换验证方式 */
        const changeMethod = e => {
            emit('changeFindMethod', e.target.innerText === '手机验证' ? 1 : 2)
            data.findMethodsState = false
        }
        return {
            ...toRefs(props),
            ...toRefs(data),
            next,

            changeMethod,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
.forget_form {
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
    .find {
        display: flex;
        position: relative;
        height: 45px;
        margin-bottom: 30px;
        padding: 0 40px 0 20px;
        border: 1px solid skyblue;
        background-color: #fff;
        color: #757575;
        font-size: 15px;
        line-height: 45px;
        border-radius: 5px;
        justify-content: space-between;
        .find_method {
            cursor: pointer;
        }
        .iconfont {
            position: absolute;
            top: 0px;
            right: 20px;
            cursor: pointer;
        }
        .method_list {
            position: absolute;
            top: 110%;
            left: -2px;
            width: 375px;
            border: 1px solid #f3f3f3;
            background-color: #fff;
            .method_item {
                padding-left: 55px;
                border-top: 1px solid #f3f3f3;
                &:hover {
                    background-color: skyblue;
                    color: #fff;
                }
            }
        }
    }
    .forget_btn {
        width: 375px;
        height: 50px;
        margin-bottom: 30px;
        // border: 1px solid skyblue;
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
