<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 11:01:27
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 14:24:21
 * @Description: 用户信息页面
-->
<template>
    <!-- S 用户信息 -->
    <div class="setting_view">
        <!-- 菜单列表 -->
        <ul class="menu_list">
            <router-link
                to="/userInfo/profile"
                custom
                v-slot="{ navigate, isActive }"
            >
                <li
                    @click="navigate"
                    :class="isActive ? 'current' : ''"
                    class="menu_item"
                >
                    <i class="iconfont icon-renyuanguanli"></i>
                    <span>个人资料</span>
                </li>
            </router-link>
            <router-link
                to="/userInfo/account"
                custom
                v-slot="{ navigate, isActive }"
            >
                <li
                    @click="navigate"
                    :class="isActive ? 'current' : ''"
                    class="menu_item"
                >
                    <i class="iconfont icon-shezhizhongxin"></i>
                    <span>账号设置</span>
                </li>
            </router-link>
            <router-link
                to="/userInfo/blogManage"
                custom
                v-slot="{ navigate, isActive }"
            >
                <li
                    @click="navigate"
                    :class="isActive ? 'current' : ''"
                    class="menu_item"
                >
                    <i class="iconfont icon-dangan"></i>
                    <span>博客管理</span>
                </li>
            </router-link>
            <li class="go_back" @click="goBack">
                <i class="iconfont icon-Exit-"></i>
                <span>返回个人主页</span>
            </li>
        </ul>
        <!-- 设置信息 -->
        <div class="setting_profile">
            <router-view
                @updateUserInfo="updateUserInfo"
                @showMessageBox="showMessageBox"
            ></router-view>
        </div>
    </div>
    <!-- E 用户信息 -->
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
export default {
    setup(_, { emit }) {
        const store = useStore()
        const router = useRouter()

        onMounted(() => {
            // 修改导航栏placeholder
            emit('changePageLocation', 5)
        })

        /* customEvent 更新用户信息 */
        const updateUserInfo = () => {
            emit('updateUserInfo')
        }
        /* customEvent 显示消息框 */
        const showMessageBox = args => {
            emit('showMessageBox', {
                message: args.message,
                type: args.type,
            })
        }

        /* click 返回个人主页 */
        const goBack = () => {
            router.push(`/center/${store.state.userId}`)
        }
        return {
            updateUserInfo,
            showMessageBox,
            goBack,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 白色背景颜色 */
$bg_white_color: #fff;

/* 白色字体颜色 */
$white_color: #fff;

/* 蓝色背景颜色 */
$bg_blue_color: #62aec5;

/* 所有字体图标 */
.iconfont {
    margin-right: 10px;
}

/* 左边当前选中菜单项 */
.current {
    background-color: rgba($color: $bg_blue_color, $alpha: 0.7);
    color: $white_color;
}

/* 用户信息模块
----------------------------------------------------------------*/
.setting_view {
    display: flex;
    height: 475px;
    margin-top: 160px;
}

/* 左边菜单栏
----------------------------------------------------------------*/
.menu_list {
    position: relative;
    width: 200px;
    margin-right: 15px;
    padding: 10px;
    background-color: rgba($color: $bg_white_color, $alpha: 0.85);
    font-size: 15px;

    /* 左边菜单栏 列表项 */
    .menu_item {
        height: 48px;
        padding-left: 30px;
        line-height: 48px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
            background-color: rgba($color: $bg_blue_color, $alpha: 0.7);
            color: $white_color;
        }
    }

    /* 左边菜单栏 返回个人主页 */
    .go_back {
        position: absolute;
        left: 0;
        bottom: 30px;
        width: 160px;
        height: 48px;
        margin: 0 10px;
        padding: 0 20px;
        background-color: rgba($color: $bg_blue_color, $alpha: 0.7);
        color: $white_color;
        text-align: center;
        line-height: 48px;
        cursor: pointer;
    }
}

/* 右边设置信息 
----------------------------------------------------------------*/
.setting_profile {
    flex: 1;
    padding: 0 20px;
    background-color: rgba($color: $bg_white_color, $alpha: 0.85);
}
</style>
