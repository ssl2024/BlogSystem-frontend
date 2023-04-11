<template>
    <div class="container">
        <div class="logo">
            <img src="https://iph.href.lu/80x44" alt="logo" />
        </div>
        <ul class="nav">
            <router-link to="/attention" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    <i class="iconfont icon-wodeguanzhu"></i>
                    关注
                </li>
            </router-link>
            <router-link to="/rcommd" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    <i class="iconfont icon-remen"></i>
                    推荐
                </li>
            </router-link>
            <router-link to="/foreend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    前端
                </li>
            </router-link>
            <router-link to="/backend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    后端
                </li>
            </router-link>
        </ul>
        <div class="search">
            <input type="text" />
            <div class="search_icon">
                <i class="iconfont icon-sousuo1"></i>
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
                    <i class="iconfont icon-wode"></i>
                    <span>冷躲我三天</span>
                </div>
            </div>
            <div class="profile_mid">
                <div class="fans">
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
                        <i class="iconfont icon-user"></i>
                        <span>个人主页</span>
                    </li>
                    <li>
                        <i class="iconfont icon-xihuan"></i>
                        <span>个人信息</span>
                    </li>
                    <li>
                        <i class="iconfont icon-xihuan"></i>
                        <span>博客管理</span>
                    </li>
                    <li>
                        <i class="iconfont icon-xihuan"></i>
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
        /* 切换显示个人简介 */
        const toggleProfile = () => {
            data.showProfile = !data.showProfile
        }
        /* 去往个人主页 */
        const toUserPage = () => {
            router.push('/center')
        }
        return {
            ...toRefs(data),
            toUserPage,
            toggleProfile,
        }
    },
}
</script>

<style lang="scss" scoped>
.container {
    padding: 0 20px;
    display: flex;
    position: relative;
    .logo {
        width: 80px;
        height: 44px;

        line-height: 44px;
        text-align: center;
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
            height: 15px;
            padding: 8px 15px;
            border: 1px solid red;

            border-radius: 5px;
            outline: none;

            &:hover {
                border-color: gold;
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
            background-color: sandybrown;
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
        background-color: #fff;

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
            border-top: 1px solid #f3f3f3;
            font-size: 13px;
            text-align: center;
            justify-content: space-around;
        }

        .profile_bottom {
            border-bottom: 1px solid #f3f3f3;
            li {
                height: 40px;
                padding: 0 20px;
                border-top: 1px solid #f3f3f3;
                font-size: 14px;
                line-height: 45px;
                &:hover {
                    background-color: skyblue;
                }
                .iconfont {
                    margin-right: 8px;
                }
            }
        }
    }
}

.currentItem {
    background-color: greenyellow;
}
</style>
