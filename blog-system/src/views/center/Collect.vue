<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-11 19:52:18
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 01:18:30
 * @Description: 用户主页-收藏模块
-->
<template>
    <!-- S 收藏模块 -->
    <div class="collect_wrap">
        <!-- 收藏列表 -->
        <div class="collect_list">
            <!-- 博客组件 -->
            <blog v-for="item in entryList" :key="item.id" :entry="item"></blog>
            <!-- 默认内容组件 -->
            <default-content
                v-if="total === 0"
                message="没有其喜欢的内容，所以他一个都没收藏"
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
    <!-- E 收藏模块 -->
</template>

<script>
import { reactive, onMounted, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'

import http from '@/utils/http'

import blog from '@/components/Blog'
export default {
    components: {
        blog,
    },
    props: {
        pageSize: {
            type: Number,
            default: 5,
        },
        searchContent: {
            type: String,
            default: '',
        },
    },
    setup(props, { emit }) {
        const route = useRoute()

        const data = reactive({
            /* 文章列表 */
            entryList: [],
            /* 当前页码 */
            currentPage: 1,
            /* 每页条数 */
            pageSize: props.pageSize,
            /* 一共多少页 */
            pages: 1,
            /* 一共多少条 */
            total: 1,
            /* 用户收藏博客的id列表 */
            collectList: [],
            /* 搜索内容 */
            searchContent: '',
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
            // 分页获取用户收藏的博客
            // 先获取该用户收藏的博客id数据
            getCollectEntryIdList().then(res => {
                if (res.data.code === 20041) {
                    // 遍历返回数据，收集博客id
                    res.data.data.forEach(item => {
                        data.collectList.push(item.blogId)
                    })
                    // 判断用户是否有收藏的博客
                    if (data.collectList.length > 0) {
                        // 获取用户收藏的博客列表
                        getUserCollectEntryList(
                            data.collectList,
                            data.currentPage,
                            data.pageSize
                        ).then(res => {
                            if (res.data.code === 20041) {
                                data.entryList = res.data.data.records
                                data.pages = res.data.data.pages
                                data.total = res.data.data.total
                                data.isShowPagination =
                                    res.data.data.total > data.pageSize
                                        ? true
                                        : false
                            }
                        })
                    } else {
                        // 用户没有收藏的博客
                        data.total = 0
                    }
                }
            })
        })

        /* watch 搜索内容 */
        watch(
            () => props.searchContent,
            () => {
                data.searchContent = props.searchContent
                let title =
                    data.searchContent != '' ? [data.searchContent] : null
                // 修改当前页码为 1
                data.currentPage = 1
                getUserCollectEntryList(
                    data.collectList,
                    data.currentPage,
                    data.pageSize,
                    title
                ).then(res => {
                    if (res.data.code === 20041) {
                        data.entryList = res.data.data.records
                        data.pages = res.data.data.pages
                        data.isShowPagination =
                            res.data.data.total > data.pageSize ? true : false
                    }
                })
            }
        )

        /* click 上一页 */
        const prevPage = () => {
            // 判断是否是第一页
            if (data.currentPage === 1) {
                return emit('showMessageBox', {
                    message: '已经是第一页',
                    type: 'warning',
                })
            }
            data.currentPage--
            let title = data.searchContent != '' ? [data.searchContent] : null
            getUserCollectEntryList(
                data.collectList,
                data.currentPage,
                data.pageSize,
                title
            ).then(res => {
                if (res.data.code === 20041) {
                    data.entryList = res.data.data.records
                    data.pages = res.data.data.pages
                }
            })
        }
        /* click 下一页 */
        const nextPage = () => {
            // 判断是否是最后一页
            if (data.currentPage === data.pages) {
                return emit('showMessageBox', {
                    message: '已经是最后一页',
                    type: 'warning',
                })
            }
            data.currentPage++
            let title = data.searchContent != '' ? [data.searchContent] : null
            getUserCollectEntryList(
                data.collectList,
                data.currentPage,
                data.pageSize,
                title
            ).then(res => {
                if (res.data.code === 20041) {
                    data.entryList = res.data.data.records
                    data.pages = res.data.data.pages
                }
            })
        }

        /* http 获取收藏博客id列表 */
        const getCollectEntryIdList = () => {
            return http.get(`/collects/list/${route.params.id}`)
        }
        /* http 获取用户收藏的博客列表 */
        const getUserCollectEntryList = (
            ids,
            currentPage,
            pageSize,
            title = null
        ) => {
            return http.post(`/blogs/${currentPage}/${pageSize}`, {
                title,
                id: ids,
            })
        }
        return {
            ...toRefs(data),
            prevPage,
            nextPage,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
.collect_list {
    min-height: 625px;
}
</style>
