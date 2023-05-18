<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-11 14:23:09
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 14:14:00
 * @Description: 用户主页
-->
<template>
    <!-- S 用户主页模块 -->
    <div class="user_center">
        <div class="aside">
            <!-- 用户个人信息 -->
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
            <!-- 用户关注粉丝 -->
            <div class="follow_block">
                <div
                    class="follow_item"
                    title="查看用户关注列表"
                    @click="showFollowList"
                >
                    <span>关注</span>
                    <span>{{ userInfo.followList.length }}</span>
                </div>
                <div
                    class="follow_item"
                    title="查看用户粉丝列表"
                    @click="showFansList"
                >
                    <span>粉丝</span>
                    <span>{{ fansCount(userInfo.fansList.length) }}</span>
                </div>
            </div>
            <!-- 用户简介 -->
            <div class="user_profile">
                <div class="profile_header">
                    <span>个人成就</span>
                </div>
                <div class="entry_count">
                    <i class="iconfont icon-yuedureading19-copy"></i>
                    <span>共发表博文 {{ userInfo.entryCount }} 篇</span>
                </div>
                <div class="browse_count">
                    <i class="iconfont icon-yuedujilu"></i>
                    <span>博文被阅读 {{ userInfo.browsedCount }} 次</span>
                </div>
                <div class="like_count">
                    <i class="iconfont icon-dianzan-mian"></i>
                    <span>博文被点赞 {{ userInfo.likedCount }} 次</span>
                </div>
                <div class="follow_count">
                    <i class="iconfont icon-shoucangku"></i>
                    <span>博文被收藏 {{ userInfo.likedCount }} 次</span>
                </div>
            </div>
        </div>
        <!-- /侧边栏模块 -->
        <div class="list_wrap">
            <!-- 博客导航栏 -->
            <div class="list_header">
                <!-- 博客导航栏列表项 -->
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
                <!-- 博客搜索框 -->
                <div class="list_search">
                    <input
                        type="text"
                        placeholder="搜TA的内容"
                        v-model.trim="searchText"
                        @keydown.enter="searchEntry"
                    />
                    <div class="search_btn" @click="searchEntry">
                        <i class="iconfont icon-sousuo"></i>
                    </div>
                </div>
            </div>
            <!-- 博客列表 -->
            <ul class="list_entry">
                <router-view
                    :pageSize="sidePageSize"
                    :searchContent="searchContent"
                    @showMessageBox="showMessageBox"
                    @clearSearchInput="clearSearchInput"
                ></router-view>
            </ul>
        </div>
        <!-- /博客列表模块 -->
    </div>
    <!-- E 用户主页模块 -->
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import http from '@/utils/http'
export default {
    setup(_, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const data = reactive({
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
            /* 搜索框文本内容 */
            searchText: '',
            /* 搜索内容 */
            searchContent: '',
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
        })

        onMounted(() => {
            // 修改导航栏placeholder
            emit('changePageLocation', 4)
            init(route.params.id)
        })

        /* watch 路径参数 */
        watch(
            () => route.params.id,
            () => {
                // 在路径参数发生改变的时候重新获取页面数据
                data.currentShowUserId = route.params.id
                init(route.params.id)
            }
        )

        /* computed 粉丝数量 */
        const fansCount = computed(() => {
            return fansCount => {
                return fansCount
            }
        })

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
                    showMessageBox({ message: err, type: 'error' })
                })
        }

        /* customEvent 显示消息框 */
        const showMessageBox = args => {
            emit('showMessageBox', {
                message: args.message,
                type: args.type,
            })
        }
        /* customEvent 清空搜索框文本内容 */
        const clearSearchInput = () => {
            data.searchText = ''
        }

        /* click 关注 */
        const addFollow = () => {
            addFollowInfo(data.currentShowUserId, data.currentLoginUserId).then(
                res => {
                    if (res.data.code === 20011) {
                        showMessageBox({
                            message: '关注用户成功',
                            type: 'success',
                        })
                        data.isFollowed = true
                        data.userInfo.fansList.length++
                    } else {
                        showMessageBox({
                            message: '关注用户失败',
                            type: 'error',
                        })
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
                    showMessageBox({ message: '取消关注成功', type: 'success' })
                    data.isFollowed = false
                    data.userInfo.fansList.length--
                } else {
                    showMessageBox({ message: '取消关注失败', type: 'error' })
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
        /* click 搜索 */
        const searchEntry = () => {
            data.searchContent = data.searchText
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
            showMessageBox,
            clearSearchInput,
            addFollow,
            unFollow,
            showFansList,
            showFollowList,
            searchEntry,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 背景颜色 */
$bg_color: #fff;

/* 个人主页 博文导航栏--当前选中项 */
.current::after {
    width: 60% !important; // 权重太低不得不用 !important
}

/* 个人主页页面
----------------------------------------------------------------*/
.user_center {
    display: flex;
    margin-top: 125px;
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
        background-color: rgba($color: $bg_color, $alpha: 0.85);
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
            img {
                width: 100%;
            }
        }

        /* 左边个人信息 用户信息--用户昵称 */
        .nickname {
            display: flex;
            text-align: center;
            flex-direction: column;
            align-items: center;
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
                background-color: rgba($color: $bg_color, $alpha: 0.8);
                color: #8a919f;
            }
        }
    }

    /* 左边个人信息 关注与粉丝 */
    .follow_block {
        display: flex;
        padding: 15px 25px;
        background-color: rgba($color: $bg_color, $alpha: 0.85);
        justify-content: space-around;

        /* 左边个人信息 关注与粉丝--列表项 */
        .follow_item {
            display: flex;
            font-size: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            flex-direction: column;
            transition: all 0.2s;
            &:hover {
                color: #47acbe;
            }
            &:first-child {
                padding-right: 45px;
                border-right: 1px solid $border_line;
            }
        }
    }

    /* 左边个人信息 个人成就 */
    .user_profile {
        display: flex;
        height: 200px;
        margin-top: 10px;
        padding: 10px 0;
        background-color: rgba($color: $bg_color, $alpha: 0.85);
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
                color: skyblue;
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
        background-color: rgba($color: $bg_color, $alpha: 0.85);
        justify-content: space-between;

        /* 右边列表项 页头--导航栏  */
        .list_nav {
            display: flex;
            width: 300px;

            /* 右边列表项 页头--导航栏(列表项) */
            .nav_item {
                flex: 1;
                position: relative;
                font-size: 16px;
                text-align: center;
                line-height: 48px;
                cursor: pointer;
                &:hover::after {
                    width: 60%;
                }
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background-color: #5db8cd;
                    transform: translateX(-50%);
                    transition: all 0.35s;
                }
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
                    border-color: #aabac7;
                }
                &:focus {
                    border-color: #b5e4f4;
                    ~ .search_btn {
                        background-color: rgba($color: #47acbf, $alpha: 0.4);
                        color: #fff;
                    }
                }
            }

            /* 右边列表项 页头--搜索栏(搜索图标) */
            .search_btn {
                display: flex;
                position: absolute;
                top: 6px;
                right: 11px;
                width: 40px;
                height: 35px;
                background-color: #f2f3f5;
                cursor: pointer;
                border-radius: 5px;
                justify-content: center;
                align-items: center;
                transition: all 0.3s;
            }
        }
    }

    /* 右边列表项 展示列表 */
    .list_entry {
        margin-top: 10px;
    }
}
</style>
