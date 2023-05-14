<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 15:40:34
 * @Description: 根组件
-->
<template>
    <!-- 导航栏组件 -->
    <navbar
        v-if="isLogin"
        :updateUserTime="updateUserTime"
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
            /* 用户信息列表 */
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
                // 获取所有用户信息
                getUserIdList().then(res => {
                    if (res.data.code === 20041) {
                        // 对用户信息列表进行清空
                        data.userInfoList = []
                        res.data.data.forEach(item => {
                            let tempObj = {
                                id: item.id,
                                nickname: item.nickname,
                                avatar: item.avatar,
                            }
                            getUserAchievement(item.id).then(res => {
                                if (res.data.code === 20041) {
                                    // 计算用户的受欢迎程序
                                    /*
                                    1. 发表博客数量 30热度
                                    2. 被浏览次数   1热度
                                    3. 被点赞次数   5热度
                                    4. 被收藏次数   5热度
                                */
                                    let hot = 0
                                    hot += res.data.data.entryCount * 30
                                    hot += res.data.data.browsedCount * 1
                                    hot += res.data.data.likedCount * 5
                                    hot += res.data.data.collectedCount * 5
                                    tempObj.hot = hot
                                }
                            })
                            data.userInfoList.push(tempObj)
                        })
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

        /* http 获取用户列表 */
        const getUserIdList = () => {
            return http.get(`/users`)
        }
        /* http 获取用户的个人成就 */
        const getUserAchievement = userId => {
            return http.get(`/blogs/count/${userId}`)
        }
        return {
            isLoading,
            isLogin,
            ...toRefs(data),
            changeSearchEntry,
            updateUserInfo,
            showMessageBox,
            changeFooterState,
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
