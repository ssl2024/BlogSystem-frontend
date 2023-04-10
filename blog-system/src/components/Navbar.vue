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
            <router-link to="/recommend" custom v-slot="{ navigate, isActive }">
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
        <div class="center">
            <img src="https://iph.href.lu/40x40" alt="头像" />
        </div>
        <div class="profile">
            <div class="profile_top">个人信息</div>
            <div class="profile_mid">浏览关注信息</div>
            <div class="profile_bottom">
                <ul class="profile_border_bottom">
                    <li><i class="iconfont icon-user"></i>个人中心</li>
                    <li><i class="iconfont icon-xihuan"></i>个人信息</li>
                    <li>博客管理</li>
                    <li>注销登录</li>
                </ul>
            </div>
            <div></div>
        </div>
    </div>
</template>

<script>
export default {}
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
            height: 31px;
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
        top: 90px;
        z-index: 1;
        width: 200px;

        .profile_top {
            padding: 20px 0 12px;
            height: 85px;
            text-align: center;
        }

        .profile_mid {
            padding: 8px 0;
            height: 45px;
            text-align: center;
        }

        .profile_bottom {
            height: 200px;
            text-align: center;

            li {
                font-size: 14px;
                height: 45px;
                line-height: 45px;
                text-align: center;
            }
        }
    }
}

.currentItem {
    background-color: greenyellow;
}
</style>
