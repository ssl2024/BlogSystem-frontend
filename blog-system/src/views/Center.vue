<template>
    <div class="user_center">
        <div class="aside">
            <div class="user_info">
                <div class="user_avatar">
                    <img :src="userInfo.avatar" alt="用户头像" />
                </div>
                <div class="nickname">
                    <span>{{ userInfo.nickname }}</span>
                    <div v-if="!isCurrentUser" class="operate_btn">
                        <div
                            v-show="!isFollowed"
                            class="follow"
                            @click="addFollow"
                        >
                            <i class="iconfont icon-add"></i>
                            <span>关注</span>
                        </div>
                        <div
                            v-show="isFollowed"
                            class="followed"
                            @click="unFollow"
                        >
                            <i class="iconfont icon-select"></i>
                            <span>已关注</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="follow_block">
                <div class="follow_item" @click="showFollowList">
                    <span>关注</span>
                    <span>{{ userInfo.followList.length }}</span>
                </div>
                <div class="follow_item" @click="showFansList">
                    <span>粉丝</span>
                    <span>{{ fansCount(userInfo.fansList.length) }}</span>
                </div>
            </div>
            <div class="user_profile">
                <div class="profile_header">
                    <span>个人成就</span>
                </div>
                <div class="entry_count">
                    <i class="iconfont icon-dangan"></i>
                    <span>共发表博文 {{ userInfo.entryCount }} 篇</span>
                </div>
                <div class="browse_count">
                    <i class="iconfont icon-yudu"></i>
                    <span>博文被阅读 {{ userInfo.browsedCount }} 次</span>
                </div>
                <div class="like_count">
                    <i class="iconfont icon-dianzan1"></i>
                    <span>博文被点赞 {{ userInfo.likedCount }} 次</span>
                </div>
                <div class="follow_count">
                    <i class="iconfont icon-shoucang"></i>
                    <span>博文被收藏 {{ userInfo.likedCount }} 次</span>
                </div>
            </div>
        </div>
        <div class="list_wrap">
            <div class="list_header">
                <ul class="list_nav">
                    <router-link
                        :to="`/center/${currentShowUserId}`"
                        custom
                        v-slot="{ navigate, isActive }"
                    >
                        <li
                            class="nav_item"
                            @click="navigate"
                            :class="isActive ? 'current' : ''"
                        >
                            博文
                        </li>
                    </router-link>
                    <router-link
                        :to="`/center/${currentShowUserId}/like`"
                        custom
                        v-slot="{ navigate, isActive }"
                    >
                        <li
                            class="nav_item"
                            @click="navigate"
                            :class="isActive ? 'current' : ''"
                        >
                            赞过
                        </li>
                    </router-link>
                    <router-link
                        :to="`/center/${currentShowUserId}/collect`"
                        custom
                        v-slot="{ navigate, isActive }"
                    >
                        <li
                            class="nav_item"
                            @click="navigate"
                            :class="isActive ? 'current' : ''"
                        >
                            收藏
                        </li>
                    </router-link>
                    <router-link
                        :to="`/center/${currentShowUserId}/follow`"
                        custom
                        v-slot="{ navigate, isActive }"
                    >
                        <li
                            class="nav_item"
                            @click="navigate"
                            :class="isActive ? 'current' : ''"
                        >
                            关注
                        </li>
                    </router-link>
                    <router-link
                        :to="`/center/${currentShowUserId}/fans`"
                        custom
                        v-slot="{ navigate, isActive }"
                    >
                        <li
                            class="nav_item"
                            @click="navigate"
                            :class="isActive ? 'current' : ''"
                        >
                            粉丝
                        </li>
                    </router-link>
                </ul>
                <div class="list_search">
                    <input type="text" placeholder="搜TA的内容" />
                    <div class="search_btn">
                        <i class="iconfont icon-sousuo"></i>
                    </div>
                </div>
            </div>
            <ul class="list_entry">
                <router-view :pageSize="sidePageSize"></router-view>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import http from '@/utils/http'
export default {
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const data = reactive({
            /**
             * 是否是当前用户
             * true  是当前用户(不展示关注/关注)
             * false 不是当前用户(展示关注/已关注)
             */
            isCurrentUser: false,
            /**
             * 当前用户对于访问用户的关注状态
             * true  已经关注
             * false 没有关注
             */
            isFollowed: false,
            /* 侧边栏每页条数 */
            sidePageSize: 5,
            /* 当前页面展示的用户id */
            currentShowUserId: route.params.id,
            /* 当前登录的用户id */
            currentLoginUserId: store.state.userId,
            /* 当前页面展示的用户信息 */
            userInfo: {
                // 用户昵称
                nickname: '',
                // 用户头像
                avatar: '',
                // 用户发表的博文数量
                entryCount: 0,
                // 博文被阅读的次数
                browsedCount: 0,
                // 博文被点赞的次数
                likedCount: 0,
                // 博文被收藏的次数
                collectedCount: 0,
                // 粉丝列表
                fansList: [],
                // 关注列表
                followList: [],
            },
        })

        onMounted(() => {
            init(route.params.id)
        })

        watch(
            () => route.params.id,
            () => {
                // 在路径参数发生改变的时候重新获取页面数据
                data.currentShowUserId = route.params.id
                init(route.params.id)
            }
        )

        /* init 页面数据初始化 */
        const init = userId => {
            // 判断是不是查看当前用户的主页
            if (store.state.userId == userId) {
                // 是当前用户的主页
                data.isCurrentUser = true
            } else {
                // 不是当前用户的主页
                data.isCurrentUser = false
            }
            // 获取当前展示用户的相关信息
            http.all([
                getFollowState(userId),
                getUserInfo(userId),
                getFansList(userId),
                getFollowList(userId),
                getUserAchievement(userId),
            ])
                .then(res => {
                    // 赋值操作
                    if (res[0].data.code === 20041) {
                        data.isFollowed = res[0].data.data
                    }
                    if (res[1].data.code === 20041) {
                        data.userInfo.nickname = res[1].data.data.nickname
                        data.userInfo.avatar = res[1].data.data.avatar
                    }
                    if (res[2].data.code === 20041) {
                        data.userInfo.fansList = res[2].data.data
                    }
                    if (res[3].data.code === 20041) {
                        data.userInfo.followList = res[3].data.data
                    }
                    if (res[4].data.code === 20041) {
                        data.userInfo.entryCount = res[4].data.data.entryCount
                        data.userInfo.browsedCount =
                            res[4].data.data.browsedCount
                        data.userInfo.likedCount = res[4].data.data.likedCount
                        data.userInfo.collectedCount =
                            res[4].data.data.collectedCount
                    }
                })
                .catch(err => {
                    alert(err)
                })
        }

        /* computed 粉丝数量 */
        const fansCount = computed(() => {
            return fansCount => {
                return fansCount
            }
        })

        /* click 关注 */
        const addFollow = () => {
            addFollowInfo(data.currentShowUserId, data.currentLoginUserId).then(
                res => {
                    if (res.data.code === 20011) {
                        data.isFollowed = true
                        data.userInfo.fansList.length++
                    } else {
                        alert('关注用户失败')
                    }
                }
            )
        }
        /* click 已关注 */
        const unFollow = () => {
            deleteFollowInfo(
                data.currentShowUserId,
                data.currentLoginUserId
            ).then(res => {
                if (res.data.code === 20021) {
                    data.isFollowed = false
                    data.userInfo.fansList.length--
                } else {
                    alert('取消关注失败')
                }
            })
        }
        /* click 粉丝数 */
        const showFansList = () => {
            router.push(`/center/${data.currentShowUserId}/fans`)
        }
        /* click 关注数 */
        const showFollowList = () => {
            router.push(`/center/${data.currentShowUserId}/follow`)
        }

        /* http 添加关注 */
        const addFollowInfo = (followedUserId, followUserId) => {
            return http.post(`/follows`, {
                followedUserId,
                followUserId,
            })
        }
        /* http 取消关注 */
        const deleteFollowInfo = (followedUserId, followUserId) => {
            return http.delete(`/follows/${followedUserId}/${followUserId}`)
        }
        /* http 获取当前登录用户是否关注展示用户 */
        const getFollowState = userId => {
            return http.get(
                `/follows/state/${userId}/${data.currentLoginUserId}`
            )
        }
        /* http 获取当前展示用户的昵称和头像 */
        const getUserInfo = userId => {
            return http.get(`/users/${userId}`)
        }
        /* http 获取当前展示用户的粉丝列表 */
        const getFansList = userId => {
            return http.get(`/follows/fans/${userId}`)
        }
        /* http 获取当前展示用户的关注列表 */
        const getFollowList = userId => {
            return http.get(`/follows/follow/${userId}`)
        }
        /* http 获取当前展示用户的个人成就 */
        const getUserAchievement = userId => {
            return http.get(`/blogs/count/${userId}`)
        }
        return {
            ...toRefs(data),
            fansCount,
            addFollow,
            unFollow,
            showFansList,
            showFollowList,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 背景颜色 */
$bg_color: #fff;

/* 个人主页-博文导航栏-当前选中项 */
.current {
    position: relative;
    &::after {
        content: '';
        display: block;
        position: absolute;
        left: 20%;
        bottom: 0;
        width: 60%;
        height: 2px;
        background-color: #b6d7a8;
    }
}

/* 个人主页页面
----------------------------------------------------------------*/
.user_center {
    display: flex;
}

/* 左边个人信息
----------------------------------------------------------------*/
.aside {
    width: 250px;
    margin-right: 10px;

    /* 左边个人信息 所有字体图标 */
    .iconfont {
        margin-right: 5px;
    }

    /* 左边个人信息 用户信息 */
    .user_info {
        display: flex;
        margin-bottom: 10px;
        padding: 25px 0;
        background-color: $bg_color;
        font-size: 18px;
        flex-direction: column;
        align-items: center;

        /* 左边个人信息 用户信息--用户头像 */
        .user_avatar {
            display: flex;
            overflow: hidden;
            width: 100px;
            height: 100px;
            margin-bottom: 15px;
            border-radius: 50%;
        }

        /* 左边个人信息 用户信息--关注按钮 */
        .operate_btn {
            width: 108px;
            height: 30px;
            margin-top: 10px;
            font-size: 15px;
            text-align: center;
            line-height: 28px;
            cursor: pointer;
            /* 左边个人信息 用户信息--关注按钮(关注) */
            .follow {
                background-color: #1e80ff;
                color: $bg_color;
            }
            /* 左边个人信息 用户信息--关注按钮(已关注) */
            .followed {
                background-color: #f2f3f5;
                color: #8a919f;
            }
        }
    }

    /* 左边个人信息 关注与粉丝 */
    .follow_block {
        display: flex;
        padding: 15px 25px;
        background-color: $bg_color;
        justify-content: space-around;

        /* 左边个人信息 关注与粉丝--列表项 */
        .follow_item {
            display: flex;
            font-size: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            flex-direction: column;
            &:first-child {
                padding-right: 45px;
                border-right: 1px solid $border_line;
            }
            &:hover {
                color: #1e80ff;
            }
        }
    }

    /* 左边个人信息 个人成就 */
    .user_profile {
        display: flex;
        height: 200px;
        margin-top: 10px;
        padding: 10px 0;
        background-color: $bg_color;
        flex-direction: column;
        justify-content: space-around;

        /* 左边个人信息 个人成就--标题 */
        .profile_header {
            height: 40px;
            border-bottom: 1px solid $border_line;
            font-size: 17px;
            font-weight: 600;
            text-align: center;
        }

        /* 左边个人信息 个人成就--列表项 */
        [class$='count'] {
            display: flex;
            padding: 5px 0 5px 30px;
            font-size: 16px;
            line-height: 20px;

            .iconfont {
                color: #7bb9ff;
            }

            /* 个人成就下面数据中间的字体 */
            span:last-child {
                margin: 0 10px 0 5px;
            }
        }
    }
}

/* 右边列表项
----------------------------------------------------------------*/
.list_wrap {
    flex: 1;

    /* 右边列表项 页头 */
    .list_header {
        display: flex;
        position: relative;
        height: 48px;
        background-color: $bg_color;
        justify-content: space-between;

        /* 右边列表项 页头--导航栏  */
        .list_nav {
            display: flex;
            width: 300px;
            .nav_item {
                flex: 1;
                font-size: 16px;
                text-align: center;
                line-height: 48px;
            }
        }

        /* 右边列表项 页头--搜索栏 */
        .list_search {
            position: relative;
            padding: 5px 10px 0 0;

            /* 右边列表项 页头--搜索栏(搜索框) */
            input {
                width: 250px;
                height: 35px;
                padding-left: 15px;
                border: 1px solid $border_line;
                border-radius: 5px;
                outline: none;
                &:hover {
                    border-color: salmon;
                }
                &:focus {
                    border-color: skyblue;
                }
            }

            /* 右边列表项 页头--搜索栏(搜索图标) */
            .search_btn {
                display: flex;
                position: absolute;
                top: 6px;
                right: 11px;
                width: 35px;
                height: 35px;
                background-color: #f2f3f5;
                cursor: pointer;
                border-radius: 5px;
                justify-content: center;
                align-items: center;
            }
        }
    }

    /* 右边列表项 展示列表 */
    .list_entry {
        margin-top: 10px;
    }
}
</style>
