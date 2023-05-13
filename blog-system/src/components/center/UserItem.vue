<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-26 15:26:02
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 01:57:48
 * @Description: 用户组件
-->
<template>
    <!-- S 用户组件 -->
    <div class="user_item" @click="toUserPage(user.id)">
        <!-- 用户信息 -->
        <div class="user_info">
            <!-- 头像 -->
            <div class="user_avatar">
                <img :src="user.avatar" alt="头像" />
            </div>
            <!-- 昵称 -->
            <div class="user_name">
                <span>{{ user.nickname }}</span>
            </div>
        </div>
        <!-- 用户状态(是否关注) -->
        <div v-if="!isCurrentUser" class="user_status">
            <div v-show="isFollowed" @click.stop="unFollow(user.id)">
                已关注
            </div>
            <div v-show="!isFollowed" @click.stop="addFollow(user.id)">
                关注
            </div>
        </div>
    </div>
    <!-- E 用户组件 -->
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import http from '@/utils/http'
export default {
    props: ['user'],
    setup(props, { emit }) {
        const store = useStore()
        const router = useRouter()

        const data = reactive({
            /* 当前登录用户的id */
            loginUserId: store.state.userId,
            /* 当前展示的用户信息 */
            user: props.user,
            /**
             * 当前用户对于当前用户项的关注状态
             * true  已经关注
             * false 没有关注
             */
            isFollowed: false,
            /**
             * 是否是当前用户
             * true  是当前用户(不展示关注/关注)
             * false 不是当前用户(展示关注/已关注)
             */
            isCurrentUser: false,
        })

        onMounted(() => {
            // 判断是不是查看当前用户的主页
            if (data.loginUserId == data.user.id) {
                // 是当前用户的主页
                data.isCurrentUser = true
            }
            // 不是当前用户的主页
            // 获取当前用户是否关注访问用户
            getFollowState(data.user.id).then(res => {
                if (res.data.code === 20041) {
                    data.isFollowed = res.data.data
                }
            })
        })

        /* click 关注 */
        const addFollow = userId => {
            http.post(`/follows`, {
                followedUserId: userId,
                followUserId: data.loginUserId,
            }).then(res => {
                if (res.data.code === 20011) {
                    data.isFollowed = true
                    emit('showMessageBox', {
                        message: '关注用户成功',
                        type: 'success',
                    })
                } else {
                    emit('showMessageBox', {
                        message: '关注用户失败',
                        type: 'error',
                    })
                }
            })
        }
        /* click 已关注 */
        const unFollow = userId => {
            http.delete(`/follows/${userId}/${data.loginUserId}`).then(res => {
                if (res.data.code === 20021) {
                    data.isFollowed = false
                    emit('showMessageBox', {
                        message: '取消关注成功',
                        type: 'success',
                    })
                } else {
                    emit('showMessageBox', {
                        message: '取消关注失败',
                        type: 'error',
                    })
                }
            })
        }
        /* click 用户 */
        const toUserPage = userId => {
            router.push(`/center/${userId}`)
        }

        /* http 获取当前登录用户是否关注展示用户 */
        const getFollowState = userId => {
            return http(`/follows/state/${userId}/${data.loginUserId}`)
        }
        return {
            ...toRefs(data),
            addFollow,
            unFollow,
            toUserPage,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #cbe5eb;

/* 背景颜色 */
// $bg_color: #fff;

/* 用户列表 列表项 */
.user_item {
    display: flex;
    height: 80px;
    padding: 5px 25px;
    border-bottom: 1px solid $border_line;
    background-color: rgba($color: #fefefe, $alpha: 0.8);
    cursor: pointer;
    justify-content: space-between;
    align-items: center;

    /* 用户列表 列表项--用户信息 */
    .user_info {
        display: flex;
        font-size: 16px;
        align-items: center;

        /* 用户列表 列表项--用户信息(头像) */
        img {
            width: 60px;
            height: 60px;
            margin-right: 10px;
            border-radius: 50%;
        }
    }

    /* 用户列表 列表项--用户状态 */
    .user_status {
        width: 90px;
        height: 30px;
        background-color: #92c452;
        color: #fff;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.2s;
        &:hover {
            background-color: #9cd74e;
        }
        span {
            display: block;
        }
    }
}
</style>
