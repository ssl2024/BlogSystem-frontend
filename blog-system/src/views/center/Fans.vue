<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 15:20:18
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 14:52:56
 * @Description: 用户主页-粉丝模块
-->
<template>
    <!-- S 粉丝模块 -->
    <div class="fans_wrap">
        <!-- 粉丝列表 -->
        <div class="fans_list">
            <!-- 用户组件 -->
            <user-item
                v-for="item in fansList"
                :key="item.id"
                :user="item"
                @showMessageBox="showMessageBox"
            ></user-item>
            <!-- 默认内容组件 -->
            <default-content
                v-if="total === 0"
                message="好看的皮囊千篇一律，有趣的灵魂万里挑一，快来关注他吧"
            ></default-content>
        </div>
        <!-- 分页组件 -->
        <pagination
            v-if="isShowPagination"
            :currentPage="currentPage"
            :pages="pages"
            @prevPage="prevPage"
            @nextPage="nextPage"
        ></pagination>
    </div>
    <!-- E 粉丝模块 -->
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'

import http from '@/utils/http'

import userItem from '@/components/center/UserItem'
export default {
    components: {
        userItem,
    },
    props: {
        pageSize: {
            type: Number,
            default: 5,
        },
    },
    setup(props, { emit }) {
        const route = useRoute()

        const data = reactive({
            /* 当前用户展示的粉丝列表 */
            fansList: [],
            /* 当前用户粉丝的id列表 */
            fansIdList: [],
            /* 当前页 */
            currentPage: 1,
            /* 每页显示条数 */
            pageSize: props.pageSize,
            /* 一共多少页 */
            pages: 1,
            /* 一共多少条 */
            total: 1,
            /**
             * 是否显示分页按钮
             * true  显示
             * false 不显示
             */
            isShowPagination: false,
        })

        onMounted(() => {
            // 清除搜索框内容
            emit('clearSearchInput')
            // 根据用户id获取粉丝列表
            getFansIdList().then(res => {
                // 对返回数据进行处理
                if (res.data.code === 20041) {
                    // 获取用户粉丝的id列表
                    res.data.data.forEach(item => {
                        data.fansIdList.push(item.followUserId)
                    })
                    // 判断用户是否有粉丝
                    if (data.fansIdList.length > 0) {
                        // 根据返回的粉丝id列表获取粉丝用户信息
                        getUserList(
                            data.currentPage,
                            data.pageSize,
                            data.fansIdList
                        ).then(res => {
                            if (res.data.code === 20041) {
                                data.fansList = res.data.data.records
                                data.pages = res.data.data.pages
                                data.total = res.data.data.total
                                data.isShowPagination =
                                    res.data.data.total > data.pageSize
                                        ? true
                                        : false
                            }
                        })
                    } else {
                        // 用户没有粉丝
                        data.total = 0
                    }
                }
            })
        })

        /* customEvent 显示消息框 */
        const showMessageBox = args => {
            emit('showMessageBox', {
                message: args.message,
                type: args.type,
            })
        }

        /* click 上一页 */
        const prevPage = () => {
            // 判断是否为第一页
            if (data.currentPage === 1) {
                return emit('showMessageBox', {
                    message: '已经是第一页',
                    type: 'warning',
                })
            }
            data.currentPage--
            getUserList(data.currentPage, data.pageSize, data.fansIdList).then(
                res => {
                    if (res.data.code === 20041) {
                        data.fansList = res.data.data.records
                        data.pages = res.data.data.pages
                    }
                }
            )
        }
        /* click 下一页 */
        const nextPage = () => {
            // 判断是否为最后一页
            if (data.currentPage === data.pages) {
                return emit('showMessageBox', {
                    message: '已经是最后一页',
                    type: 'warning',
                })
            }
            data.currentPage++
            getUserList(data.currentPage, data.pageSize, data.fansIdList).then(
                res => {
                    if (res.data.code === 20041) {
                        data.fansList = res.data.data.records
                        data.pages = res.data.data.pages
                    }
                }
            )
        }

        /* http 根据用户id获取粉丝id列表 */
        const getFansIdList = () => {
            return http.get(`/follows/fans/${route.params.id}`)
        }
        /* http 根据用户id列表获取用户 */
        const getUserList = (currentPage, pageSize, ids) => {
            return http.post(`/users/${currentPage}/${pageSize}`, {
                id: ids,
            })
        }
        return {
            ...toRefs(data),
            showMessageBox,
            prevPage,
            nextPage,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 粉丝列表 */
.fans_list {
    min-height: 460px;
}
</style>
