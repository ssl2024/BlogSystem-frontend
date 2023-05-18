<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 23:05:24
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 14:53:50
 * @Description: 导航栏组件
-->
<template>
    <!-- S 导航栏组件 -->
    <div class="nav_wrapper">
        <div class="nav">
            <!-- logo -->
            <div class="logo">
                <img src="@/assets/user_logo.png" alt="logo" />
            </div>
            <!-- 导航列表 -->
            <ul class="nav_list">
                <router-link
                    to="/attention"
                    custom
                    v-slot="{ navigate, isActive }"
                >
                    <li @click="navigate" :class="isActive ? 'current' : ''">
                        关注
                    </li>
                </router-link>
                <router-link
                    to="/rcommd"
                    custom
                    v-slot="{ navigate, isActive }"
                >
                    <li @click="navigate" :class="isActive ? 'current' : ''">
                        推荐
                    </li>
                </router-link>
                <router-link
                    to="/foreend"
                    custom
                    v-slot="{ navigate, isActive }"
                >
                    <li @click="navigate" :class="isActive ? 'current' : ''">
                        前端
                    </li>
                </router-link>
                <router-link
                    to="/backend"
                    custom
                    v-slot="{ navigate, isActive }"
                >
                    <li @click="navigate" :class="isActive ? 'current' : ''">
                        后端
                    </li>
                </router-link>
            </ul>
            <!-- 搜索 -->
            <div class="search">
                <input
                    type="text"
                    :placeholder="placeholder"
                    v-model.trim="searchContent"
                    @keydown.enter="searchEntry"
                    @focus="
                        placeholder =
                            pageLocation <= 3 ? '你想知道些什么' : placeholder
                    "
                    @blur="placeholder = navPlaceholder"
                />
                <div class="search_icon" @click="searchEntry">
                    <i class="iconfont icon-sousuo"></i>
                </div>
            </div>
            <!-- 头像 -->
            <div class="center">
                <img
                    :src="user.avatar"
                    v-show="!isShowProfile"
                    ref="avatar"
                    alt="头像"
                />
            </div>
            <!-- 用户简介 -->
            <div class="profile" v-show="isShowProfile">
                <!-- 用户信息 -->
                <div class="profile_top">
                    <div class="user_avatar">
                        <img :src="user.avatar" alt="用户头像" />
                    </div>
                    <div class="user_nickname">
                        <span>{{ user.nickname }}</span>
                    </div>
                </div>
                <!-- 用户关注与粉丝 -->
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
                <!-- 用户菜单 -->
                <ul class="profile_bottom">
                    <!-- 用户主页 -->
                    <li @click="toUserPage(userId)">
                        <i class="iconfont icon-shouye1"></i>
                        <span>个人主页</span>
                    </li>
                    <!-- 用户信息 -->
                    <li @click="toUserInfo">
                        <i class="iconfont icon-xingming"></i>
                        <span>个人信息</span>
                    </li>
                    <!-- 博客管理 -->
                    <li @click="toBlogManage">
                        <i class="iconfont icon-xiangmuguanli"></i>
                        <span>博客管理</span>
                    </li>
                    <!-- 注销 -->
                    <li @click="logout">
                        <i class="iconfont icon-tuichu"></i>
                        <span>注销登录</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- /导航栏 -->
    </div>
    <!-- E 导航栏组件 -->
</template>

<script>
import {
    onMounted,
    onUnmounted,
    reactive,
    toRefs,
    ref,
    watch,
    computed,
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import http from '@/utils/http'
export default {
    props: {
        updateUserTime: String,
        pageLocation: {
            type: Number,
            required: true,
        },
    },
    setup(props, { emit }) {
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
            /* 搜索框placeholder */
            placeholder: '搜索推荐',
            /* 定时器引用 */
            timeId: null,
        })

        /* DOM 用户头像 */
        const avatar = ref(null)

        onMounted(() => {
            // 绑定 document 的点击事件
            document.addEventListener('click', handleClick)
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

        onUnmounted(() => {
            // 清除定时器
            data.timeId && clearTimeout(data.timeId)
            // 解绑 document 的点击事件
            document.removeEventListener('click', handleClick)
        })

        /* watch 更新用户信息 */
        watch(
            () => props.updateUserTime,
            () => {
                getUserInfo(data.userId).then(res => {
                    if (res.data.code === 20041) {
                        data.user = res.data.data
                    }
                })
            }
        )

        /* watch 切换页面 */
        watch(
            () => props.pageLocation,
            () => {
                // 清空搜索框内容
                data.searchContent = ''
                // 判断页面位置
                switch (props.pageLocation) {
                    case 0:
                        data.placeholder = '搜索关注'
                        break
                    case 1:
                        data.placeholder = '搜索推荐'
                        break
                    case 2:
                        data.placeholder = '搜索前端'
                        break
                    case 3:
                        data.placeholder = '搜索后端'
                        break
                    default:
                        data.placeholder = '不能全局搜索哦'
                        break
                }
            }
        )

        /* computed 导航栏blur后placeholder */
        const navPlaceholder = computed(() => {
            let placeholder = ''
            switch (props.pageLocation) {
                case 0:
                    placeholder = '搜索关注'
                    break
                case 1:
                    placeholder = '搜索推荐'
                    break
                case 2:
                    placeholder = '搜索前端'
                    break
                case 3:
                    placeholder = '搜索后端'
                    break
                default:
                    placeholder = '不能全局搜索哦'
            }
            return placeholder
        })

        /* click document */
        const handleClick = event => {
            // 判断是否显示用户简介
            if (event.target === avatar.value) {
                data.isShowProfile = true
            } else {
                data.isShowProfile = false
            }
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
                    emit('showMessageBox', {
                        message: '注销成功',
                        type: 'success',
                    })
                    data.timeId = setTimeout(() => {
                        // 修改 vuex 中的登录状态
                        store.commit('updateLoginState', false)
                        // 删除本地 vuex 持久化数据
                        sessionStorage.removeItem('vuex')
                        // 跳转到 login 页面
                        router.push('/login')
                    }, 1000)
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
            avatar,
            navPlaceholder,
            searchEntry,
            toUserPage,
            toUserInfo,
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

/* 透明背景色 */
$bg_color: transparent;

/* 白色字体颜色 */
$white_color: #fff;

/* 导航栏当前选中项 */
.current {
    background-color: rgba($color: #b4e2f2, $alpha: 0.7);
    color: $white_color;
    border-radius: 5px;
    &::after {
        opacity: 0;
    }
}
/* 导航栏整体样式 */
.nav_wrapper {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 93px;
    border-top: 1px solid rgba($color: #47acbf, $alpha: 0.1);
    border-bottom: 1px solid rgba($color: #47acbf, $alpha: 0.1);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.1);
    justify-content: center;
    align-items: center;
}

/* 导航栏组件
----------------------------------------------------------------*/
.nav {
    display: flex;
    position: relative;
    width: 1330px;
    padding: 0 20px;
    background-color: $bg_color;
    align-items: center;

    /* 导航栏 网站logo */
    .logo {
        display: flex;
        width: 120px;
        height: 72px;
        margin-right: 30px;
        text-align: center;
        align-items: center;
        img {
            width: 100%;
        }
    }

    /* 导航栏 导航栏列表 */
    .nav_list {
        display: flex;

        /* 导航栏 导航栏列表--列表项 */
        li {
            position: relative;
            width: 75px;
            height: 40px;
            margin-right: 7px;
            font-size: 14px;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            transition: all 0.4s ease-out;
            &:hover {
                color: $white_color;
                &::after {
                    height: 100%;
                    border-radius: 5px;
                }
            }

            &::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 0px;
                background-color: rgba($color: #b4e2f2, $alpha: 0.7);
                z-index: -1;
                transition: all 0.4s;
            }
        }
    }

    /* 导航栏 搜索框 */
    .search {
        flex: 1;
        position: relative;
        padding-left: 60px;
        line-height: 45px;

        /* 导航栏 搜索框--搜索输入框 */
        input {
            width: 320px;
            height: 18px;
            padding: 8px 15px;
            border: 1px solid #c2c8d1;
            border-radius: 5px;
            outline: none;
            transition: all 0.3s;
            &:hover {
                border-color: #999;
            }
            &:focus {
                width: 375px;
                border-color: #b8e3f4;
                ~ .search_icon {
                    right: 124px;
                    background-color: rgba($color: #47acbf, $alpha: 0.4);
                    color: $white_color;
                }
            }
        }

        /* 导航栏 搜索框--搜索图标 */
        .search_icon {
            display: flex;
            position: absolute;
            top: 6px;
            right: 181px;
            width: 42px;
            height: 34px;
            background-color: #f2f3f5;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            justify-content: center;
            align-items: center;
        }
    }

    /* 导航栏 用户头像 */
    .center {
        width: 260px;
        height: 45px;
        img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
        }
    }

    /* 导航栏 用户简介 */
    .profile {
        position: absolute;
        top: 70px;
        right: 155px;
        width: 180px;
        background-color: rgba($color: $white_color, $alpha: 0.9);
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
            border-top: 1px solid $border_line;
            font-size: 15px;
            text-align: center;
            justify-content: space-around;
            /* 导航栏 用户简介--中间(列表项) */
            [class$='btn'] {
                flex: 1;
                height: 45px;
                padding: 8px 0;
                cursor: pointer;
                transition: all 0.3s;
                &:hover {
                    background-color: rgba($color: #62aec5, $alpha: 0.7);
                    color: $white_color;
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
                transition: all 0.3s;
                &:hover {
                    background-color: rgba($color: #62aec5, $alpha: 0.7);
                    color: $white_color;
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
