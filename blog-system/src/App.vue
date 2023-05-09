<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-10 02:07:25
 * @Description: 
-->
<template>
    <button @click="showMessage">点击</button>
    <navbar v-if="isLogin" @changeSearchEntry="changeSearchEntry"></navbar>
    <router-view
        :pageSize="pageSize"
        :userInfoList="userInfoList"
        :searchContent="searchContent"
    ></router-view>
    <footers v-if="isLogin"></footers>
    <loading v-show="isLoading"></loading>
    <message-tips :message="message"></message-tips>
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
import messageTips from '@/components/MessageTips.vue'
export default {
    components: {
        navbar,
        footers,
        loading,
        messageTips,
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
            /* 显示消息 */
            message: '',
        })

        watch(
            () => store.state.isLogin,
            () => {
                // 获取用户热榜信息(用户登录之后)
                getHotListInfo()
            }
        )

        const showMessage = () => {
            let r = Math.random()
            data.message = '这是需要显示的内容' + r
        }

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
            showMessage,
        }
    },
}
</script>

<style lang="scss">
body,
html {
    width: 1170px;
    margin: 0 auto;
    padding: 0 15px;
    background-color: #f2f3f5;
}
</style>
