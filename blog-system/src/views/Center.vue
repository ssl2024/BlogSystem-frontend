<template>
    <div @click="toUserInfo(111)">跳转到个人信息修改</div>
    <div class="user_page">
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
                    <i class="iconfont icon-zanping"></i>
                    <span>博文被点赞</span>
                    <span>256</span>
                </div>
                <div class="follow_count">
                    <i class="iconfont icon-shoucang1"></i>
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
            isConcerned: false,
        })
        /* 去往用户资料 */
        const toUserInfo = id => {
            router.push(`/userInfo/${id}`)
        }
        /* 展示粉丝列表 */
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
$border_line: #e8e8ed;
$bg_color: #fff;

/* 个人主页博文导航栏当前选中项 */
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

.user_page {
    display: flex;

    .aside {
        width: 250px;
        margin-right: 10px;

        /* 给所有字体图标添加 margin-right */
        .iconfont {
            margin-right: 5px;
        }
        .user_info {
            display: flex;
            margin-bottom: 10px;
            padding: 25px 0;
            background-color: $bg_color;
            font-size: 18px;
            flex-direction: column;
            align-items: center;
            .user_avatar {
                display: flex;
                overflow: hidden;
                width: 100px;
                height: 100px;
                margin-bottom: 15px;
                border-radius: 50%;
            }
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
        .follow_block {
            display: flex;
            padding: 15px 25px;
            background-color: $bg_color;
            justify-content: space-around;
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
        .user_profile {
            display: flex;
            height: 200px;
            margin-top: 10px;
            padding: 10px 0;
            background-color: $bg_color;
            flex-direction: column;
            justify-content: space-around;

            .profile_header {
                height: 40px;
                border-bottom: 1px solid $border_line;
                font-size: 17px;
                font-weight: 600;
                text-align: center;
            }

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
    .list_wrap {
        flex: 1;
        .list_header {
            display: flex;
            position: relative;
            height: 48px;
            background-color: $bg_color;
            justify-content: space-between;
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
            .list_search {
                position: relative;
                padding: 5px 10px 0 0;
                input {
                    width: 250px;
                    height: 35px;
                    padding-left: 15px;
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
                .search_btn {
                    display: flex;
                    position: absolute;
                    top: 6px;
                    right: 11px;
                    width: 35px;
                    height: 35px;
                    background-color: #f2f3f5;
                    border-radius: 5px;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .list_entry {
            margin-top: 10px;
        }
    }
}
</style>
