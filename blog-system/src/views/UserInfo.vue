<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 11:01:27
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-28 15:59:17
 * @Description: 
-->
<template>
    <div class="setting_view">
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
                <i class="iconfont icon-zhuanruzijin"></i>
                <span>返回个人主页</span>
            </li>
        </ul>
        <div class="setting_profile">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter} from 'vue-router'
export default {
    setup() {
        const store = useStore()
        const router = useRouter()

        /* click 返回个人主页 */
        const goBack = () => {
            router.push(`/center/${store.state.userId}`)
        }
        return {
            goBack,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 背景颜色 */
$bg_color: #fff;

/* 当前选中背景色 */
$bg_check_color: #f0f0f5;

/* 所有字体图标 */
.iconfont {
    margin-right: 10px;
}

/* 左边当前选中菜单项 */
.current {
    background-color: $bg_check_color;
}

/* 用户信息页面
----------------------------------------------------------------*/
.setting_view {
    display: flex;
    height: 475px;
}

/* 左边菜单栏
----------------------------------------------------------------*/
.menu_list {
    position: relative;
    width: 200px;
    margin-right: 15px;
    padding: 10px;
    background-color: $bg_color;
    font-size: 15px;
    /* 左边菜单栏 列表项 */
    .menu_item {
        height: 48px;
        padding-left: 30px;
        line-height: 48px;
        cursor: pointer;
        &:hover {
            background-color: $bg_check_color;
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
        background-color: #e8f3ff;
        color: #1d7dfa;
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
    background-color: $bg_color;
}
</style>
