<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 23:53:57
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 14:06:19
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
                    :authorName="authorInfo.get(item.authorId)"
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
            /* 存储关注页面博客用户id 及其信息 */
            authorInfo: new Map(),
        })

        onMounted(() => {
            // 修改导航栏placeholder
            emit('changePageLocation', 0)
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

        /* watch 导航栏搜索内容 */
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

        /* watch 文章列表 */
        watch(
            () => data.entryList,
            () => {
                // 遍历文章列表，获取对应的用户id
                data.entryList.forEach(item => {
                    // 向 map 中添加没有的用户信息
                    if (!data.authorInfo.has(item.authorId)) {
                        data.authorInfo.set(item.authorId, null)
                    }
                })
                // 遍历用户id集合，获取对应的用户昵称
                for (const item of data.authorInfo.keys()) {
                    // 判断 map 中是否有对应的昵称信息，防止重复发送 http 请求
                    if (data.authorInfo.get(item) === null) {
                        getUserInfo(item).then(res => {
                            if (res.data.code === 20041) {
                                data.authorInfo.set(
                                    res.data.data.id,
                                    res.data.data.nickname
                                )
                            }
                        })
                    }
                }
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
        /* http 获取用户信息 */
        const getUserInfo = userId => {
            return http.get(`/users/${userId}`)
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
/* 博客区域 */
.list_container {
    display: flex;
    margin-top: 125px;

    /* 博客列表 */
    .list_wrap {
        width: 870px;
    }
}
/* 侧边栏 */
.aside {
    width: 300px;
}
</style>
