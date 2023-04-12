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
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const goBack = () => {
            router.push('/center')
        }
        onMounted(() => {
            console.log('传递过来的参数', route.params)
        })
        return {
            goBack,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
$bg_color: #fff;

/* 所有字体图标添加 margin-right */
.iconfont {
    margin-right: 10px;
}

/* 左边当前选中菜单项 */
.current {
    background-color: #f0f0f5;
}
.setting_view {
    display: flex;
    height: 300px;
    .menu_list {
        position: relative;
        width: 200px;
        margin-right: 15px;
        padding: 10px;
        background-color: $bg_color;
        font-size: 15px;

        .menu_item {
            height: 48px;
            padding-left: 30px;
            line-height: 48px;

            &:hover {
                background-color: #f0f0f5;
            }
        }
        .go_back {
            position: absolute;
            left: 0;
            bottom: 30px;
            width: 160px;
            height: 48px;
            margin: 0 10px;
            padding: 0 20px;
            background-color: #e8f3ff;
            line-height: 48px;
            text-align: center;
            color: #1d7dfa;
        }
    }
    .setting_profile {
        flex: 1;
        padding: 0 20px;
        background-color: $bg_color;
    }
}
</style>
