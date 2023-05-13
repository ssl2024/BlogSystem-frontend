<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 23:53:57
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 01:00:30
 * @Description: 关注页面
-->
<template>
    <!-- S 关注模块 -->
    <div class="container">
        <!-- 博客列表 -->
        <div class="list_container">
            <!-- 博客列表 -->
            <div class="list_wrap">
                <blog
                    v-for="item in entryList"
                    :key="item.id"
                    :entry="item"
                ></blog>
                <pagination
                    v-if="isShowPagination"
                    :currentPage="currentPage"
                    :pages="pages"
                    @prevPage="prevPage"
                    @nextPage="nextPage"
                ></pagination>
            </div>
        </div>
        <!-- 默认内容组件 -->
        <default-content
            message="你暂未关注博主或你关注的博主暂未发表文章哦"
            v-if="total === 0"
        ></default-content>
        <!-- 侧边栏 -->
        <div class="aside"></div>
    </div>
    <!-- S 关注模块 -->
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'

import http from '@/utils/http'

import blog from '@/components/Blog'
export default {
    components: {
        blog,
    },
    props: {
        pageSize: {
            type: Number,
            required: true,
        },
        searchContent: {
            type: String,
            default: '',
        },
    },
    setup(props, { emit }) {
        const store = useStore()

        const data = reactive({
            /* 文章列表 */
            entryList: [],
            /* 当前页 */
            currentPage: 1,
            /* 当前页博客数量 */
            pageSize: props.pageSize,
            /* 一共多少页 */
            pages: 1,
            /* 一共多少条 */
            total: 1,
            /* 搜索内容 */
            searchContent: '',
            /* 当前用户所关注用户的id列表 */
            userIdList: [],
            /* 当前登录的用户id */
            loginUserId: store.state.userId,
            /**
             * 是否显示分页按钮
             * true  显示
             * false 不显示
             */
            isShowPagination: false,
        })

        onMounted(() => {
            // 获取当前登录用户关注的用户id列表
            getFollowIdList(data.loginUserId).then(res => {
                if (res.data.code === 20041) {
                    // 处理数据，获取其中的用户id列表
                    res.data.data.forEach(item => {
                        data.userIdList.push(item.followedUserId)
                    })
                    // 判断用户是否有关注博主
                    if (data.userIdList.length > 0) {
                        // 根据用户id获取其发表的博客列表
                        getBlogList(
                            data.userIdList,
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
                        // 用户没有关注博主
                        data.total = 0
                    }
                }
            })
        })

        watch(
            () => props.searchContent,
            () => {
                data.searchContent = props.searchContent
                let title =
                    data.searchContent != '' ? [data.searchContent] : null
                // 修改当前页码为 1
                data.currentPage = 1
                getBlogList(
                    data.userIdList,
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
        )

        /* 显示消息框 */
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
                return showMessageBox({
                    message: '已经是第一页',
                    type: 'warning',
                })
            }
            data.currentPage--
            let title = data.searchContent != '' ? [data.searchContent] : null
            getBlogList(
                data.userIdList,
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
            // 判断是否为最后一页
            if (data.currentPage === data.pages) {
                return showMessageBox({
                    message: '已经是最后一页',
                    type: 'warning',
                })
            }
            data.currentPage++
            let title = data.searchContent != '' ? [data.searchContent] : null
            getBlogList(
                data.userIdList,
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

        /* http 根据id获取关注的用户id列表 */
        const getFollowIdList = userId => {
            return http.get(`/follows/follow/${userId}`)
        }
        /* http 根据用户id列表获取博客列表*/
        const getBlogList = (authorIds, currentPage, pageSize, title) => {
            return http.post(`/blogs/${currentPage}/${pageSize}`, {
                title,
                authorId: authorIds,
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
.list_container {
    display: flex;
    margin-top: 125px;

    /* 关注页面 文章内容 */
    .list_wrap {
        width: 870px;
    }
}
.aside {
    width: 300px;
}
</style>
