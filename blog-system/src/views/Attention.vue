<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 23:53:57
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-11 00:01:54
 * @Description: 关注页面
-->
<template>
    <div>
        <div class="container">
            <div class="content">
                <blog
                    v-for="item in entryList"
                    :key="item.id"
                    :entry="item"
                ></blog>
                <div class="list_pagination" v-if="isShowPagination">
                    <div class="operate_prev" @click="prevPage">上一页</div>
                    <span>{{ currentPage }} / {{ pages }}</span>
                    <div class="operate_next" @click="nextPage">下一页</div>
                </div>
            </div>
            <div class="aside"></div>
        </div>
        <!-- 消息提示框 -->
        <message-box
            :message="message"
            :messageId="messageId"
            :type="messageType"
        ></message-box>
    </div>
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
    setup(props) {
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
            /* 消息提示框内容 */
            message: '',
            /* 消息提示框id */
            messageId: -1,
            /* 消息提示框类型 */
            messageType: '',
        })

        onMounted(() => {
            // 获取当前登录用户关注的用户id列表
            getFollowIdList(data.loginUserId).then(res => {
                if (res.data.code === 20041) {
                    // 处理数据，获取其中的用户id列表
                    res.data.data.forEach(item => {
                        data.userIdList.push(item.followedUserId)
                    })
                    // 根据用户id获取其发表的博客列表
                    getBlogList(
                        data.userIdList,
                        data.currentPage,
                        data.pageSize
                    ).then(res => {
                        if (res.data.code === 20041) {
                            data.entryList = res.data.data.records
                            data.pages = res.data.data.pages
                            data.isShowPagination =
                                res.data.data.total > data.pageSize
                                    ? true
                                    : false
                        }
                    })
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

        /* 显示消息提示框 */
        const showMessageBox = (message, type) => {
            let date = new Date()
            data.message = message
            data.messageType = type
            data.messageId = date.getTime()
        }

        /* click 上一页 */
        const prevPage = () => {
            // 判断是否为第一页
            if (data.currentPage === 1) {
                return showMessageBox('已经是第一页', 'warning')
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
                return showMessageBox('已经是最后一页', 'warning')
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
.container {
    display: flex;

    /* 关注页面 文章内容 */
    .content {
        width: 870px;

        /* 关注页面 文章内容--分页 */
        .list_pagination {
            display: flex;
            margin-top: 15px;
            font-size: 13px;
            justify-content: space-between;
            align-items: center;

            /* 关注页面 文章内容--分页(上/下一页按钮) */
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
    }
    .aside {
        width: 300px;
    }
}
</style>
