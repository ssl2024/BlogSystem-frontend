<template>
    <div>个人主页</div>
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
                <div class="follow_item">
                    <span>粉丝</span>
                    <span>123</span>
                </div>
            </div>
            <div class="user_profile">
                <div class="profile_header">
                    <span>个人成就</span>
                </div>
                <div class="browse_count">
                    <i class="iconfont icon-good"></i>
                    <span>文章被点赞</span>
                    <span>1234</span>
                </div>
                <div class="like_count">
                    <i class="iconfont icon-good"></i>
                    <span>文章被点赞</span>
                    <span>1234</span>
                </div>
                <div class="follow_count">
                    <i class="iconfont icon-good"></i>
                    <span>文章被点赞</span>
                    <span>1234</span>
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
                            <i class="iconfont icon-remen"></i>
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
                            点赞
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
export default {
    setup() {
        const data = reactive({
            isConcerned: false,
        })
        return {
            ...toRefs(data),
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
$border_line: #e8e8ed;
$bg_color: #fff;
.user_page {
    display: flex;

    .aside {
        width: 250px;
        margin-right: 20px;

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
            height: 150px;
            margin-top: 10px;
            background-color: $bg_color;
            flex-direction: column;
            justify-content: space-around;

            .profile_header {
                height: 40px;
                border-bottom: 1px solid $border_line;
                font-size: 17px;
                line-height: 35px;
                font-weight: 600;
                text-align: center;
            }

            [class$='count'] {
                display: flex;
                padding-left: 20px;
                font-size: 15px;
            }
        }
    }
    .list_wrap {
        // display: none;
        // width: 100%;
        flex: 1;
        background-color: greenyellow;
        .list_header {
            display: flex;
            height: 48px;
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
                    border: 1px solid transparent;
                    border-radius: 5px;
                    outline: none;
                    &:hover {
                        border-color: skyblue;
                    }
                    &:focus {
                        border-color: salmon;
                    }
                }
                .search_btn {
                    display: flex;
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    width: 37px;
                    height: 37px;
                    background-color: steelblue;
                    border-radius: 5px;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
}

.current {
    background-color: skyblue;
    color: floralwhite;
}
</style>
