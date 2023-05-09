<template>
    <div class="container">
        <div class="logo">
            <img src="@/assets/user_logo.png" alt="logo" />
        </div>
        <ul class="nav">
            <router-link to="/attention" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'current' : ''">
                    关注
                </li>
            </router-link>
            <router-link to="/rcommd" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'current' : ''">
                    推荐
                </li>
            </router-link>
            <router-link to="/foreend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'current' : ''">
                    前端
                </li>
            </router-link>
            <router-link to="/backend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'current' : ''">
                    后端
                </li>
            </router-link>
        </ul>
        <div class="search">
            <input
                type="text"
                v-model.trim="searchContent"
                @keydown.enter="searchEntry"
            />
            <div class="search_icon" @click="searchEntry">
                <i class="iconfont icon-sousuo"></i>
            </div>
        </div>
        <div class="center" @mouseenter="showProfile">
            <img :src="user.avatar" v-show="!isShowProfile" alt="头像" />
        </div>
        <!-- 用户简介 -->
        <div class="profile" v-show="isShowProfile" @mouseleave="closeProfile">
            <div class="profile_top">
                <div class="user_avatar">
                    <img :src="user.avatar" alt="用户头像" />
                </div>
                <div class="user_nickname">
                    <span>{{ user.nickname }}</span>
                </div>
            </div>
            <div class="profile_mid">
                <div class="follow_btn" @click="toUserFollow(userId)">
                    <div>关注</div>
                    <div>{{ followCount }}</div>
                </div>
                <div class="fans_btn" @click="toUserFans(userId)">
                    <div>粉丝</div>
                    <div>{{ fansCount }}</div>
                </div>
            </div>
            <div class="profile_bottom">
                <ul class="profile_border_bottom">
                    <li @click="toUserPage(userId)">
                        <i class="iconfont icon-shouye1"></i>
                        <span>个人主页</span>
                    </li>
                    <li @click="toUserInfo">
                        <i class="iconfont icon-xingming"></i>
                        <span>个人信息</span>
                    </li>
                    <li @click="toBlogManage">
                        <i class="iconfont icon-xiangmuguanli"></i>
                        <span>博客管理</span>
                    </li>
                    <li @click="logout">
                        <i class="iconfont icon-tuichu"></i>
                        <span>注销登录</span>
                    </li>
                </ul>
            </div>
            <div></div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import http from '@/utils/http'
export default {
    setup(_, { emit }) {
        const store = useStore()
        const router = useRouter()

        const data = reactive({
            /* 当前登录的用户id */
            userId: store.state.userId,
            /* 当前登录用户信息 */
            user: {},
            /* 当前登录用户粉丝数量 */
            fansCount: 0,
            /* 当前登录用户关注数量 */
            followCount: 0,
            /**
             * 是否显示用户简介
             * false 不显示
             * true  显示
             */
            isShowProfile: false,
            /* 搜索框内容 */
            searchContent: '',
        })

        onMounted(() => {
            // 获取当前用户的粉丝数量和关注数量
            http.all([
                getUserInfo(data.userId),
                getFansList(data.userId),
                getFollowList(data.userId),
            ]).then(res => {
                if (res[0].data.code === 20041) {
                    data.user = res[0].data.data
                }
                if (res[1].data.code === 20041) {
                    data.fansCount = res[1].data.data.length
                }
                if (res[2].data.code === 20041) {
                    data.followCount = res[2].data.data.length
                }
            })
        })
        /* mouseleave  */
        const closeProfile = () => {
            data.isShowProfile = false
        }

        /* mouseenter 右上角用户头像 */
        const showProfile = () => {
            data.isShowProfile = true
        }

        /* click 搜索 */
        const searchEntry = () => {
            emit('changeSearchEntry', data.searchContent)
        }
        /* click 个人主页 */
        const toUserPage = userId => {
            data.isShowProfile = false
            router.push(`/center/${userId}`)
        }
        /* click 个人信息 */
        const toUserInfo = () => {
            data.isShowProfile = false
            router.push(`/userInfo/profile`)
        }
        /* click 博客管理 */
        const toBlogManage = () => {
            data.isShowProfile = false
            router.push(`/userInfo/blogManage`)
        }
        /* click 粉丝 */
        const toUserFans = userId => {
            data.isShowProfile = false
            router.push(`/center/${userId}/fans`)
        }
        /* click 关注 */
        const toUserFollow = userId => {
            data.isShowProfile = false
            router.push(`/center/${userId}/follow`)
        }
        /* click 注销登录 */
        const logout = () => {
            // 发送 http 请求，删除在 redis 中的 token
            deleteToken().then(res => {
                if (res.data.code === 20021) {
                    // 修改 vuex 中的登录状态
                    store.commit('updateLoginState', false)
                    // 删除本地 vuex 持久化数据
                    sessionStorage.removeItem('vuex')
                    // 跳转到 login 页面
                    router.push('/login')
                }
            })
        }

        /* http 获取当前登录用户信息 */
        const getUserInfo = userId => {
            return http.get(`/users/${userId}`)
        }
        /* http 获取粉丝列表 */
        const getFansList = userId => {
            return http.get(`/follows/fans/${userId}`)
        }
        /* http 获取关注列表 */
        const getFollowList = userId => {
            return http.get(`/follows/follow/${userId}`)
        }
        /* http 删除后端token */
        const deleteToken = () => {
            return http.delete(`/users/logout`)
        }
        return {
            ...toRefs(data),
            searchEntry,
            toUserPage,
            toUserInfo,
            showProfile,
            closeProfile,
            toBlogManage,
            toUserFans,
            toUserFollow,
            logout,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 背景颜色 */
$bg_color: #fff;

/* 导航栏当前选中项 */
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

/* 导航栏组件
----------------------------------------------------------------*/
.container {
    display: flex;
    position: relative;
    margin-bottom: 20px;
    padding: 0 20px;
    background-color: $bg_color;

    /* 导航栏 网站logo */
    .logo {
        width: 80px;
        height: 44px;
        text-align: center;
        line-height: 44px;

        /* 导航栏 网站logo--logo图片 */
        img {
            height: 100%;
        }
    }

    /* 导航栏 导航栏列表 */
    .nav {
        display: flex;

        /* 导航栏 导航栏列表--列表项 */
        li {
            padding: 0 10px;
            width: 80px;
            height: 45px;
            font-size: 16px;
            text-align: center;
            line-height: 45px;
        }
    }

    /* 导航栏 搜索框 */
    .search {
        flex: 1;
        position: relative;
        padding: 0 30px;
        text-align: center;
        line-height: 45px;

        /* 导航栏 搜索框--搜索输入框 */
        input {
            width: 300px;
            height: 16px;
            padding: 8px 15px;
            border: 1px solid #c2c8d1;
            border-radius: 5px;
            outline: none;
            &:hover {
                border-color: salmon;
            }
            &:focus {
                border-color: skyblue;
            }
        }
        /* 导航栏 搜索框--搜索图标 */
        .search_icon {
            display: flex;
            position: absolute;
            top: 7px;
            right: 60px;
            width: 42px;
            height: 31px;
            background-color: #f2f3f5;
            cursor: pointer;
            border-radius: 5px;
            justify-content: center;
            align-items: center;
        }
    }

    /* 导航栏 用户头像 */
    .center {
        width: 200px;
        height: 45px;
        text-align: center;
        img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
        }
    }

    /* 导航栏 用户简介 */
    .profile {
        position: absolute;
        top: 50px;
        right: 20px;
        width: 180px;
        background-color: $bg_color;
        z-index: 1;

        /* 导航栏 用户简介--顶部 */
        .profile_top {
            position: relative;
            padding: 35px 0 15px;
            height: 20px;
            text-align: center;

            /* 导航栏 用户简介--顶部(用户头像) */
            .user_avatar {
                position: absolute;
                top: -40px;
                left: 50px;
                overflow: hidden;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                img {
                    width: 60px;
                    height: 60px;
                }
            }

            /* 导航栏 用户简介--顶部(用户昵称) */
            .user_nickname {
                font-size: 16px;
            }
        }

        /* 导航栏 用户简介--中间 */
        .profile_mid {
            display: flex;
            height: 45px;
            padding: 8px 0;
            border-top: 1px solid $border_line;
            font-size: 15px;
            text-align: center;
            justify-content: space-around;

            /* 导航栏 用户简介--中间(列表项) */
            [class$='btn'] {
                flex: 1;
                cursor: pointer;
                &:hover {
                    color: skyblue;
                }
                &:first-child {
                    border-right: 1px solid $border_line;
                }
            }
        }

        /* 导航栏 用户简介--底部 */
        .profile_bottom {
            border-bottom: 1px solid $border_line;

            /* 导航栏 用户简介--底部(菜单项) */
            li {
                height: 40px;
                padding: 0 20px;
                border-top: 1px solid $border_line;
                font-size: 14px;
                text-align: center;
                line-height: 40px;
                cursor: pointer;
                &:hover {
                    background-color: skyblue;
                }

                /* 导航栏 用户简介--底部(菜单项-字体图标) */
                .iconfont {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
