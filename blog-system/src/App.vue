<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-12 01:06:45
 * @Description: 根组件
-->
<template>
    <navbar
        v-if="isLogin"
        @changeSearchEntry="changeSearchEntry"
        @showMessageBox="showMessageBox"
    ></navbar>
    <router-view
        :pageSize="pageSize"
        :userInfoList="userInfoList"
        :searchContent="searchContent"
        @showMessageBox="showMessageBox"
    ></router-view>
    <footers v-if="isLogin"></footers>
    <loading v-show="isLoading"></loading>
    <!-- 消息提示框 -->
    <message-box
        :message="message"
        :messageId="messageId"
        :type="messageType"
    ></message-box>
    <ul class="cs">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
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
        })

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
        /* customEvent 显示消息提示框 */
        const showMessageBox = args => {
            let date = new Date()
            data.message = args.message
            data.messageType = args.type
            data.messageId = date.getTime()
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
            showMessageBox,
        }
    },
}
</script>

<style lang="scss">
body {
    width: 1170px;
    margin: 0 auto;
    padding: 0 15px;
    // background-color: #f2f3f5;
    // background-color: ;
    // background-color: rgba($color: #b6e3f6, $alpha: 0.85);
    background-color: transparent;
    // background-color: transparent;
    // opacity: 0.8;
}

html {
    // background-color: skyblue;
    // background: url(@/assets/bg.webp)
    //     no-repeat fixed;
    background: url(https://pic3.zhimg.com/v2-3afda695650a99e5c7349b26745090ca_r.jpg)
        no-repeat fixed;
    background-size: 100vw 100vh;
}
.cs {
    position: absolute;
    top: 120px;
    left: 50px;
    li {
        display: block;
        width: 120px;
        height: 30px;
        margin-bottom: 15px;

        &:nth-child(1) {
            background-color: #cbe5d9;
        }
        &:nth-child(2) {
            background-color: #d9cbe5;
        }
        &:nth-child(3) {
            background-color: #e5d9cb;
        }
        &:nth-child(4) {
            background-color: #cbe5e0;
        }
        &:nth-child(5) {
            background-color: #e5cbe1;
        }
        &:nth-child(6) {
            background-color: #cbe5eb;
        }
        &:nth-child(7) {
            background-color: #f8bbd0;
        }
        &:nth-child(8) {
            background-color: #e1bee7;
        }
        &:nth-child(9) {
            background-color: #a5d6a7;
        }
        &:nth-child(10) {
            background-color: #2e7d32;
        }
        &:nth-child(11) {
            background-color: #ffcc80;
        }
        &:nth-child(12) {
            background-color: #ff5722;
        }
        &:nth-child(13) {
            background-color: #d2691e;
        }
    }
}
</style>
