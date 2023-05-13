<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 11:51:43
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 01:47:09
 * @Description: 用户信息页-账号设置模块
-->
<template>
    <!-- S 账号设置模块 -->
    <div class="account_setting">
        <!-- 标题 -->
        <div class="setting_title">账号设置</div>
        <!-- 设置列表项 -->
        <ul class="setting_list">
            <!-- 手机 -->
            <li class="setting_item">
                <span>手机</span>
                <span>未绑定</span>
                <span @click="bindTel">绑定</span>
            </li>
            <!-- 邮箱 -->
            <li class="setting_item">
                <span>邮箱</span>
                <span>未绑定</span>
                <span @click="bindEmail">绑定</span>
            </li>
            <!-- 密码 -->
            <li class="setting_item">
                <span>密码</span>
                <span></span>
                <span @click="resetPwd">修改</span>
            </li>
        </ul>
    </div>
    <!-- E 账号设置模块 -->
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    setup(_, { emit }) {
        const data = reactive({})

        /* click 绑定(手机) */
        const bindTel = () => {
            emit('showMessageBox', {
                message: '暂不支持绑定手机，努力开发中',
                type: 'error',
            })
        }
        /* click 绑定(邮箱) */
        const bindEmail = () => {
            emit('showMessageBox', {
                message: '暂不支持绑定邮箱，努力开发中',
                type: 'error',
            })
        }
        /* click 重置密码 */
        const resetPwd = () => {
            emit('showMessageBox', {
                message: '暂不支持修改密码，努力开发中',
                type: 'error',
            })
        }

        return {
            ...toRefs(data),
            bindTel,
            bindEmail,
            resetPwd,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: rgba(
    $color: #b3e2f2,
    $alpha: 1,
);

/* 个人信息页面--账号设置 
----------------------------------------------------------------*/
.account_setting {
    /* 账号设置 标题 */
    .setting_title {
        height: 55px;
        border-bottom: 1px solid $border_line;
        font-size: 22px;
        font-weight: 600;
        line-height: 55px;
    }

    /* 账号设置 列表 */
    .setting_list {
        height: 55px;
        font-size: 14px;
        line-height: 55px;

        /* 账号设置 列表--列表项 */
        .setting_item {
            display: flex;
            border-bottom: 1px solid $border_line;
            justify-content: space-around;
            :nth-child(1) {
                width: 80px;
            }
            :nth-child(2) {
                flex: 1;
                color: #666;
            }
            :nth-child(3) {
                width: 40px;
                color: rgba($color: #1989fa, $alpha: 0.8);
                cursor: pointer;
                transition: all 0.2s;
                &:hover {
                    color: rgba($color: #0080ff, $alpha: 1);
                }
            }
        }
    }
}
</style>
