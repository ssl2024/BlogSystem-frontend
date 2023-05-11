<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-11 19:52:00
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-11 17:41:46
 * @Description: 个人主页-用户点赞
-->
<template>
    <div>
        <div class="list">
            <blog v-for="item in entryList" :key="item.id" :entry="item"></blog>
            <default-content
                v-if="total === 0"
                message="没有其喜欢的内容，所以他一个都没点赞"
            ></default-content>
        </div>
        <div class="list_pagination" v-if="isShowPagination">
            <div class="operate_prev" @click="prevPage">上一页</div>
            <span>{{ currentPage }} / {{ pages }}</span>
            <div class="operate_next" @click="nextPage">下一页</div>
        </div>
    </div>
</template>

<script>
import { reactive, onMounted, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'

import http from '@/utils/http'

import blog from '@/components/Blog'
import defaultContent from '@/components/center/DefaultContent'
export default {
    components: {
        blog,
        defaultContent,
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
            /* 用户点赞博客的id列表 */
            likeList: [],
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
            // 分页获取用户点赞的博客
            // 先获取该用户点赞的博客id数据
            getLikeBlogIdList().then(res => {
                if (res.data.code === 20041) {
                    // 遍历返回数据，收集博客id
                    res.data.data.forEach(item => {
                        data.likeList.push(item.blogId)
                    })
                    // 判断用户是否有点赞的博客
                    if (data.likeList.length > 0) {
                        // 获取用户点赞的博客列表
                        getUserLikeBlogList(
                            data.likeList,
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
                        // 用户没有点赞的博客
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
                getUserLikeBlogList(
                    data.likeList,
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
            getUserLikeBlogList(
                data.likeList,
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
            getUserLikeBlogList(
                data.likeList,
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

        /* http 获取点赞博客id列表 */
        const getLikeBlogIdList = () => {
            return http.get(`/likes/list/${route.params.id}`)
        }
        /* http 获取用户点赞的博客列表 */
        const getUserLikeBlogList = (
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
.list {
    min-height: 625px;
}
.list_pagination {
    display: flex;
    margin-top: 15px;
    font-size: 13px;
    justify-content: space-between;
    align-items: center;

    [class^='operate'] {
        width: 105px;
        height: 35px;
        border: 1px solid skyblue;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
        border-radius: 5px;
    }
}
</style>
