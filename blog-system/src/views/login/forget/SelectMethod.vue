<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-14 01:29:25
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 00:49:11
 * @Description: 登录页面-忘记密码模块(找回方式)
-->
<template>
    <!-- S 找回方式模块 -->
    <form class="forget_form">
        <!-- 账号框 -->
        <div class="forget_account">
            <input type="text" placeholder="请输入账号" />
        </div>
        <!-- 验证方式 -->
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
        <!-- 下一步 -->
        <div class="forget_btn" @click="next">下一步</div>
    </form>
    <!-- E 找回方式模块 -->
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

        /* click 下一步 */
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
/* 字体颜色 */
$color: #fff;

/* 背景颜色 */
$bg_color: #fff;

/* 边框分隔线颜色 */
$border_line: skyblue;

/* 登录页面--忘记密码--找回方式
----------------------------------------------------------------*/
.forget_form {
    /* 找回方式 所有的输入框 */
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

    /* 找回方式 找回方式选择 */
    .find {
        display: flex;
        position: relative;
        height: 45px;
        margin-bottom: 30px;
        padding: 0 40px 0 20px;
        border: 1px solid $border_line;
        background-color: $bg_color;
        color: #757575;
        font-size: 15px;
        line-height: 45px;
        border-radius: 5px;
        justify-content: space-between;

        /* 找回方式 找回方式选择--当前找回方式 */
        .find_method {
            cursor: pointer;
        }

        /* 找回方式 找回方式选择--向下箭头 */
        .iconfont {
            position: absolute;
            top: 0px;
            right: 20px;
            cursor: pointer;
        }

        /* 找回方式 找回方式选择--找回方式列表 */
        .method_list {
            position: absolute;
            top: 110%;
            left: -2px;
            width: 375px;
            border: none;
            background-color: $bg_color;

            /* 找回方式 找回方式选择--找回方式列表(列表项) */
            .method_item {
                padding-left: 55px;
                border-top: 1px solid #f3f3f3;
                transition: all 0.3s;
                &:hover {
                    background-color: skyblue;
                    color: $color;
                }
            }
        }
    }

    /* 找回方式 下一步按钮 */
    .forget_btn {
        width: 375px;
        height: 50px;
        margin-bottom: 30px;
        background-color: #45b8cc;
        color: $color;
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
