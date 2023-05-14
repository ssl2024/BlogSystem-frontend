<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 11:51:20
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 14:37:49
 * @Description: 用户信息页-用户信息模块
-->
<template>
    <!-- S 用户信息模块 -->
    <div class="profile_setting">
        <!-- 标题 -->
        <div class="setting_title">个人资料</div>
        <!-- 用户信息列表项 -->
        <ul class="setting_list">
            <!-- 头像 -->
            <li class="setting_avatar">
                <span>头像</span>
                <img :src="user.avatar" alt="用户头像" />
                <input
                    type="text"
                    v-model.trim="user.avatar"
                    ref="userAvatar"
                />
                <span @click="updateUserAvatar">修改头像</span>
            </li>
            <!-- 用户名 -->
            <li class="setting_item">
                <span>用户名</span>
                <input type="text" v-model="user.nickname" />
            </li>
        </ul>
        <!-- 保存修改按钮 -->
        <div class="setting_btn" @click="updateUser">保存修改</div>
    </div>
    <!-- E 用户信息模块 -->
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useStore } from 'vuex'

import http from '@/utils/http'
export default {
    setup(_, { emit }) {
        const store = useStore()

        const data = reactive({
            /* 用户信息 */
            user: {},
        })

        /* DOM 用户头像输入框 */
        const userAvatar = ref(null)

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
            if (userAvatar.value.style.width === '') {
                userAvatar.value.style.width = 370 + 'px'
                userAvatar.value.style.marginLeft = 15 + 'px'
                userAvatar.value.style.paddingLeft = 15 + 'px'
                userAvatar.value.style.border = 1 + 'px'
            } else {
                userAvatar.value.style.width = ''
                userAvatar.value.style.marginLeft = ''
                userAvatar.value.style.paddingLeft = ''
                userAvatar.value.style.border = ''
            }
        }
        /* click 保存修改 */
        const updateUser = () => {
            updateUserInfo().then(res => {
                if (res.data.code === 20031) {
                    // 更新用户信息
                    emit("updateUserInfo")
                    // 更新导航栏的用户昵称和头像
                    emit('showMessageBox', {
                        message: '修改信息成功',
                        type: 'success',
                    })
                } else {
                    emit('showMessageBox', {
                        message: '修改信息失败',
                        type: 'error',
                    })
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
            userAvatar,
            updateUserAvatar,
            updateUser,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #b3e2f2;

/* 用户信息页--用户信息模块 
----------------------------------------------------------------*/
.profile_setting {
    position: relative;
    width: 895px;
    height: 475px;

    /* 用户信息 标题 */
    .setting_title {
        height: 55px;
        font-size: 22px;
        font-weight: 600;
        line-height: 55px;
        border-bottom: 1px solid $border_line;
    }

    /* 用户信息 列表 */
    .setting_list {
        padding: 15px 0;
        font-size: 14px;
        line-height: 55px;

        /* 用户信息 列表--用户头像 */
        .setting_avatar {
            display: flex;
            height: 100px;
            margin-bottom: 10px;
            font-size: 14px;
            align-items: center;
            :nth-child(1) {
                width: 80px;
            }
            :nth-child(2) {
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
            :nth-child(3) {
                width: 0px;
                height: 33px;
                margin-left: 0px;
                padding-left: 0;
                border: 0px solid #c2c8d1;
                border-radius: 5px;
                outline: none;
                transition: all 0.3s;
                &:hover {
                    border: 1px solid #8491a2;
                }
                &:focus {
                    border: 1px solid #b4e5f4;
                }
            }
            :nth-child(4) {
                width: 80px;
                height: 35px;
                margin-left: 15px;
                text-align: center;
                line-height: 35px;
                cursor: pointer;
                transition: all 0.1s;
                &:hover {
                    color: #5db5cb;
                }
            }
        }

        /* 用户信息 列表--列表项 */
        .setting_item {
            display: flex;
            border-top: 1px solid $border_line;
            border-bottom: 1px solid $border_line;
            align-items: center;

            /* 用户信息 列表--列表项(标题) */
            :nth-child(1) {
                width: 80px;
            }

            /* 用户信息 列表--列表项(用户昵称) */
            :nth-child(2) {
                width: 370px;
                height: 33px;
                margin-right: 15px;
                padding-left: 15px;
                border: 1px solid #c2c8d1;
                border-radius: 5px;
                outline: none;
                &:hover {
                    border: 1px solid #8491a2;
                }
                &:focus {
                    border: 1px solid #b4e5f4;
                }
            }
        }
    }
    /* 用户信息 保存修改 */
    .setting_btn {
        position: absolute;
        left: 30px;
        bottom: 30px;
        width: 100px;
        height: 35px;
        background-color: rgba($color: #1e80ff, $alpha: 0.7);
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.2s;
        &:hover {
            background-color: rgba($color: #1e80ff, $alpha: 1);
        }
    }
}
</style>
