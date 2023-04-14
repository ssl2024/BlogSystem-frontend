<template>
    <div @click="toUserInfo(111)">跳转到个人信息修改</div>
    <div class="user_center">
        <div class="aside">
            <div class="user_info">
                <div class="user_avatar">
                    <img src="https://iph.href.lu/100x100" alt="用户头像" />
                </div>
                <div class="nickname">
                    <span>石松林_前端基础</span>
                    <div class="operate_btn">
                        <div v-show="!isConcerned">
                            <i class="iconfont icon-add"></i>
                            <span>关注</span>
                        </div>
                        <div v-show="isConcerned">
                            <i class="iconfont icon-select"></i>
                            <span>已关注</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="follow_block">
                <div class="follow_item">
                    <span>关注</span>
                    <span>23</span>
                </div>
                <div class="follow_item" @click="showFansList">
                    <span>粉丝</span>
                    <span>123</span>
                </div>
            </div>
            <div class="user_profile">
                <div class="profile_header">
                    <span>个人成就</span>
                </div>
                <div class="entry_count">
                    <i class="iconfont icon-dangan"></i>
                    <span>共发表博文</span>
                    <span>34</span>
                </div>
                <div class="browse_count">
                    <i class="iconfont icon-yudu"></i>
                    <span>博文被阅读</span>
                    <span>1234</span>
                </div>
                <div class="like_count">
                    <i class="iconfont icon-dianzan1"></i>
                    <span>博文被点赞</span>
                    <span>256</span>
                </div>
                <div class="follow_count">
                    <i class="iconfont icon-shoucang"></i>
                    <span>博文被收藏</span>
                    <span>18</span>
                </div>
            </div>
        </div>
        <div class="list_wrap">
            <div class="list_header">
                <ul class="list_nav">
                    <router-link
                        to="/center/entry"
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
                        to="/center/like"
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
                        to="/center/follow"
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
                        to="/center/fans"
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
                <router-view></router-view>
            </ul>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
export default {
    setup() {
        const router = useRouter()

        const data = reactive({
            /**
             * 是否已经关注
             * false 没有关注
             * true  已经关注
             */
            isConcerned: false,
        })

        /* click 个人信息 */
        const toUserInfo = id => {
            router.push(`/userInfo/${id}`)
        }
        /* click 粉丝 */
        const showFansList = () => {
            router.push('/center/fans')
        }

        return {
            ...toRefs(data),
            toUserInfo,
            showFansList,
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
            display: flex;
            height: 30px;
            margin-top: 10px;
            background-color: #1e80ff;
            color: $bg_color;
            font-size: 15px;
            line-height: 28px;
            justify-content: space-around;
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
            flex-direction: column;
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
            span:nth-child(2) {
                width: 80px;
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
