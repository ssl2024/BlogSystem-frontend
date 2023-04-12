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
            <input type="text" />
            <div class="search_icon">
                <i class="iconfont icon-sousuo"></i>
            </div>
        </div>
        <div class="center" @click="toggleProfile">
            <img src="https://iph.href.lu/40x40" alt="头像" />
        </div>
        <div class="profile" v-show="showProfile">
            <div class="profile_top">
                <div class="user_avatar">
                    <img src="https://iph.href.lu/60x60" alt="用户头像" />
                </div>
                <div class="user_nickname">
                    <span>石松林_前端基础</span>
                </div>
            </div>
            <div class="profile_mid">
                <div class="fans" @click="toFansList">
                    <div>粉丝</div>
                    <div>23</div>
                </div>
                <div class="follow">
                    <div>关注</div>
                    <div>23</div>
                </div>
                <div class="like">
                    <div>获赞</div>
                    <div>23</div>
                </div>
            </div>
            <div class="profile_bottom">
                <ul class="profile_border_bottom">
                    <li @click="toUserPage">
                        <i class="iconfont icon-shouye1"></i>
                        <span>个人主页</span>
                    </li>
                    <li @click="toUserInfo(234)">
                        <i class="iconfont icon-xingming"></i>
                        <span>个人信息</span>
                    </li>
                    <li>
                        <i class="iconfont icon-xiangmuguanli"></i>
                        <span>博客管理</span>
                    </li>
                    <li>
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
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
export default {
    setup() {
        const router = useRouter()
        const data = reactive({
            showProfile: false,
        })
        /* 切换显示用户简介 */
        const toggleProfile = () => {
            data.showProfile = !data.showProfile
        }
        /* 去往用户主页 */
        const toUserPage = () => {
            router.push('/center')
        }
        /* 去往用户信息 */
        const toUserInfo = id => {
            router.push(`/userInfo/${id}`)
        }
        /* 去往用户粉丝列表 */
        const toFansList = () => {
            router.push('/center/fans')
        }
        return {
            ...toRefs(data),
            toUserPage,
            toUserInfo,
            toggleProfile,
            toFansList,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
$border_line: #f3f3f3;
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

.container {
    // padding: 0 20px;
    display: flex;
    position: relative;
    margin-bottom: 20px;
    padding: 0 20px;
    background-color: $bg_color;
    .logo {
        width: 80px;
        height: 44px;

        line-height: 44px;
        text-align: center;
        img {
            // width: 100%;
            height: 100%;
        }
    }
    .nav {
        display: flex;
        li {
            padding: 0 10px;
            width: 80px;
            height: 45px;
            font-size: 16px;
            text-align: center;
            line-height: 45px;
        }
    }
    .search {
        position: relative;
        flex: 1;
        padding: 0 30px;

        text-align: center;
        line-height: 45px;

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
        .search_icon {
            display: flex;
            position: absolute;
            top: 7px;
            right: 60px;
            width: 42px;
            height: 32px;
            border-radius: 5px;
            background-color: #f2f3f5;
            justify-content: center;
            align-items: center;
        }
    }
    .center {
        width: 200px;
        height: 40px;

        text-align: center;
    }
    .profile {
        position: absolute;
        right: 20px;
        top: 50px;
        z-index: 1;
        width: 180px;
        background-color: $bg_color;

        .profile_top {
            position: relative;
            padding: 35px 0 15px;
            height: 20px;
            text-align: center;
            .user_avatar {
                position: absolute;
                top: -40px;
                left: 50px;
                overflow: hidden;
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
            .user_nickname {
                font-size: 16px;
            }
        }

        .profile_mid {
            display: flex;
            height: 45px;
            padding: 8px 8px;
            border-top: 1px solid $border_line;
            font-size: 13px;
            text-align: center;
            justify-content: space-around;
        }

        .profile_bottom {
            border-bottom: 1px solid $border_line;
            li {
                height: 40px;
                padding: 0 20px;
                border-top: 1px solid $border_line;
                font-size: 14px;
                text-align: center;
                line-height: 40px;
                &:hover {
                    background-color: skyblue;
                }
                .iconfont {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
