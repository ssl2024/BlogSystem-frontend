<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 11:51:20
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-06 10:45:45
 * @Description: 个人资料
-->
<template>
    <div class="profile_setting">
        <div class="setting_title">个人资料</div>
        <ul class="setting_list">
            <li class="setting_avatar">
                <span>头像</span>
                <img :src="user.avatar" alt="用户头像" />
                <span @click="updateUserAvatar">修改头像</span>
            </li>
            <li class="setting_item">
                <span>用户名</span>
                <input type="text" v-model="user.nickname" />
            </li>
        </ul>
        <div class="setting_btn" @click="updateUser">保存修改</div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

import http from '@/utils/http'
export default {
    setup() {
        const store = useStore()

        const data = reactive({
            /* 用户信息 */
            user: {},
        })

        onMounted(() => {
            // 获取当前用户信息
            getUserInfo().then(res => {
                if (res.data.code === 20041) {
                    data.user = res.data.data
                }
            })
        })

        /* click 修改头像 */
        const updateUserAvatar = () => {
            console.log('点击了修改用户头像')
        }
        /* click 保存修改 */
        const updateUser = () => {
            updateUserInfo().then(res => {
                if (res.data.code === 20031) {
                    // 更新导航栏的用户昵称和头像
                    alert('修改成功')
                } else {
                    alert('修改失败')
                }
            })
        }

        /* http 获取当前用户信息 */
        const getUserInfo = () => {
            return http.get(`/users/${store.state.userId}`)
        }
        /* http 更新用户信息 */
        const updateUserInfo = () => {
            return http.put(`/users/`, data.user)
        }
        return {
            ...toRefs(data),
            updateUserAvatar,
            updateUser,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 个人信息页面--个人资料 
----------------------------------------------------------------*/
.profile_setting {
    position: relative;
    width: 895px;
    height: 475px;
    .setting_title {
        height: 55px;
        font-size: 22px;
        font-weight: 600;
        line-height: 55px;
        border-bottom: 1px solid $border_line;
    }

    /* 个人资料 列表 */
    .setting_list {
        padding: 15px 0;
        font-size: 14px;
        line-height: 55px;

        /* 个人资料 列表--用户头像 */
        .setting_avatar {
            display: flex;
            height: 100px;
            margin-bottom: 10px;
            font-size: 14px;
            align-items: center;

            /* 个人资料 列表--用户头像(标题) */
            :nth-child(1) {
                width: 80px;
            }
            /* 个人资料 列表--用户头像(头像) */
            :nth-child(2) {
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
            :nth-child(3) {
                width: 80px;
                height: 35px;
                margin-left: 15px;
                text-align: center;
                line-height: 35px;
                cursor: pointer;
                &:hover {
                    color: skyblue;
                }
            }
        }

        /* 个人资料 列表--列表项 */
        .setting_item {
            display: flex;
            border-top: 1px solid $border_line;
            border-bottom: 1px solid $border_line;
            align-items: center;

            /* 个人资料 列表--列表项(标题) */
            :nth-child(1) {
                width: 80px;
            }

            /* 个人资料 列表--列表项(用户昵称) */
            :nth-child(2) {
                width: 370px;
                height: 33px;
                margin-right: 15px;
                padding-left: 15px;
                border: 1px solid #c2c8d1;
                border-radius: 5px;
                outline: none;
                &:hover {
                    border: 1px solid salmon;
                }
                &:focus {
                    border: 1px solid skyblue;
                }
            }
        }
    }
    /* 个人资料 保存修改 */
    .setting_btn {
        position: absolute;
        left: 30px;
        bottom: 30px;
        width: 100px;
        height: 35px;
        background-color: #1e80ff;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
        border-radius: 5px;
    }
}
</style>
