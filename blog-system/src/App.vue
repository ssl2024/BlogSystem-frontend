<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 14:10:55
 * @Description: 根组件
-->
<template>
    <!-- 导航栏组件 -->
    <navbar
        v-if="isLogin"
        :updateUserTime="updateUserTime"
        :pageLocation="pageLocation"
        @changeSearchEntry="changeSearchEntry"
        @showMessageBox="showMessageBox"
    ></navbar>
    <!-- 展示的模块 -->
    <router-view
        :pageSize="pageSize"
        :userInfoList="userInfoList"
        :searchContent="searchContent"
        @updateUserInfo="updateUserInfo"
        @showMessageBox="showMessageBox"
        @changeFooterState="changeFooterState"
        @changePageLocation="changePageLocation"
    ></router-view>
    <!-- 页脚组件 -->
    <footers
        v-if="isLogin"
        v-show="isShowFooter"
        :htmlHeight="htmlHeight"
    ></footers>
    <!-- 加载框组件 -->
    <loading v-show="isLoading"></loading>
    <!-- 消息提示框组件 -->
    <message-box
        :message="message"
        :messageId="messageId"
        :type="messageType"
    ></message-box>
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, onUpdated } from 'vue'
import { useStore } from 'vuex'

import http from '@/utils/http'
import useHttp from '@/utils/useHttp'

import '@/assets/css/cssReset.css'
import navbar from '@/components/Navbar'
import footers from '@/components/Footer'
import loading from '@/components/Loading'
export default {
    components: {
        navbar,
        footers,
        loading,
    },
    setup() {
        const store = useStore()

        /**
         * loading 框是否显示
         * true  显示
         * false 不显示
         */
        const { isLoading } = useHttp()

        const data = reactive({
            /* 首页中每页博客条数 */
            pageSize: 10,
            /* 用户热榜信息列表 */
            userInfoList: [],
            /* 导航栏搜索框内容 */
            searchContent: '',
            /* 消息提示框内容 */
            message: '',
            /* 消息提示框id */
            messageId: -1,
            /* 消息提示框类型 */
            messageType: '',
            /* html标签高度 */
            htmlHeight: 0,
            /**
             * 是否显示页脚
             * true  显示
             * false 不显示
             */
            isShowFooter: true,
            /* 更新用户的时间戳(发生改变导航栏会重新获取头像和昵称) */
            updateUserTime: '',
            /**
             * 当前页面位置
             * 0    关注页面
             * 1    推荐页面
             * 2    前端页面
             * 3    后端页面
             * 4    用户主页
             * 5    个人信息页面
             */
            pageLocation: 1,
        })

        /* watch 用户登录状态 */
        watch(
            () => store.state.isLogin,
            () => {
                // 获取用户热榜信息(用户登录之后)
                getHotListInfo()
            }
        )

        onMounted(() => {
            // 获取用户热榜信息(浏览器F5刷新之后)
            getHotListInfo()
        })

        onUpdated(() => {
            // 每次更新之后获取 html 标签的高度
            data.htmlHeight = document.documentElement.offsetHeight
        })

        /* computed 登录状态 */
        const isLogin = computed(() => {
            return store.state.isLogin
        })

        /* 获取用户热榜信息 */
        const getHotListInfo = () => {
            // 判断用户是否登录
            if (store.state.isLogin) {
                getUserHotList().then(res => {
                    if (res.data.code === 20041) {
                        data.userInfoList = res.data.data
                    }
                })
            }
        }

        /* customEvent 导航栏搜索框 */
        const changeSearchEntry = searchContent => {
            data.searchContent = searchContent
        }
        /* customEvent 更新用户信息 */
        const updateUserInfo = () => {
            let date = new Date()
            data.updateUserTime = date.getTime()
        }
        /* customEvent 显示消息提示框 */
        const showMessageBox = args => {
            let date = new Date()
            data.message = args.message
            data.messageType = args.type
            data.messageId = date.getTime()
        }
        /* customEvent 改变页脚显示状态 */
        const changeFooterState = state => {
            data.isShowFooter = state
        }
        /* customEvent 改变当前页面位置 */
        const changePageLocation = location => {
            data.pageLocation = location
        }

        /* http 获取用户热榜 */
        const getUserHotList = () => {
            return http.get(`/users/list`)
        }
        return {
            isLoading,
            isLogin,
            ...toRefs(data),
            changeSearchEntry,
            updateUserInfo,
            showMessageBox,
            changeFooterState,
            changePageLocation,
        }
    },
}
</script>

<style lang="scss">
html {
    position: relative;
    background: url(@/assets/bg.jpg) no-repeat fixed;
    background-size: 100vw 100vh;
}

body {
    width: 1170px;
    margin: 0 auto;
    padding: 0 15px;
    background-color: transparent;
}
</style>
