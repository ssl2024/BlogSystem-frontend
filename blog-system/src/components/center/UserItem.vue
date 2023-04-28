<template>
    <div class="user_item" @click="toUserPage(user.id)">
        <div class="user_info">
            <div class="user_avatar">
                <img src="https://iph.href.lu/60x60" alt="头像" />
            </div>
            <div class="user_name">
                <span>{{ user.nickname }}</span>
            </div>
        </div>
        <div v-if="!isCurrentUser" class="user_status">
            <span v-show="isFollowed" @click.stop="unFollow(user.id)"
                >已关注</span
            >
            <span v-show="!isFollowed" @click.stop="addFollow(user.id)"
                >关注</span
            >
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import http from '@/utils/http'
export default {
    props: ['user'],
    setup(props) {
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
            http.get(`/follows/state/${data.user.id}/${data.loginUserId}`).then(
                res => {
                    if (res.data.code === 20041) {
                        data.isFollowed = res.data.data
                    }
                }
            )
        })

        /* click 关注 */
        const addFollow = userId => {
            http.post(`/follows`, {
                followedUserId: userId,
                followUserId: data.loginUserId,
            }).then(res => {
                if (res.data.code === 20011) {
                    data.isFollowed = true
                    alert('关注用户成功')
                } else {
                    alert('关注用户失败')
                }
            })
        }
        /* click 已关注 */
        const unFollow = userId => {
            http.delete(`/follows/${userId}/${data.loginUserId}`).then(res => {
                if (res.data.code === 20021) {
                    data.isFollowed = false
                    alert('取消关注成功')
                } else {
                    alert('取消关注失败')
                }
            })
        }
        /* click 用户 */
        const toUserPage = userId => {
            router.push(`/center/${userId}`)
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
$border_line: #e8e8ed;

/* 背景颜色 */
$bg_color: #fff;

/* 用户列表 列表项 */
.user_item {
    display: flex;
    height: 80px;
    padding: 5px 25px;
    border-top: 1px solid $border_line;
    border-bottom: 1px solid $border_line;
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
    }
}
</style>
