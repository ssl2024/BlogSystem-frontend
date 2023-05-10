<template>
    <div class="container">
        <!-- 左边后端博文内容主体 -->
        <div class="list_container">
            <list-header
                :classify="classify"
                @changeType="changeType"
            ></list-header>
            <div class="list_wrap">
                <blog
                    v-for="item in entryList"
                    :key="item.id"
                    :entry="item"
                ></blog>
            </div>
            <div class="list_pagination" v-if="isShowPagination">
                <div class="operate_prev" @click="prevPage">上一页</div>
                <span>{{ currentPage }} / {{ pages }}</span>
                <div class="operate_next" @click="nextPage">下一页</div>
            </div>
        </div>
        <!-- 侧边栏热度榜单 -->
        <div class="aside">
            <div class="hot_list">
                <div class="hot_list_header">热度榜单</div>
                <div class="hot_list_fields">
                    <span>排名</span>
                    <span>用户</span>
                    <span>热度</span>
                </div>
                <ul class="hot_list_data">
                    <li
                        class="hot_item"
                        v-for="(item, index) in hotList(userInfoList)"
                        :key="item.id"
                        @click="toUserPage(item.id)"
                    >
                        <div class="hot_sort">{{ index + 1 }}</div>
                        <div class="user_info">
                            <span class="avatar">
                                <img
                                    :src="item.avatar"
                                    alt="热度榜单用户头像"
                                />
                            </span>
                            <span>{{ item.nickname }}</span>
                        </div>
                        <div class="hot_score">{{ item.hot }}</div>
                    </li>
                </ul>
            </div>
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
import { reactive, toRefs, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import http from '@/utils/http'

import blog from '@/components/Blog'
import listHeader from '@/components/ListHeader'
export default {
    components: {
        blog,
        listHeader,
    },
    props: {
        pageSize: {
            type: Number,
            required: true,
        },
        userInfoList: {
            type: Array,
            required: true,
        },
        searchContent: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const router = useRouter()

        const data = reactive({
            /* 文章列表 */
            entryList: [],
            /* 当前页 */
            currentPage: 1,
            /* 当前页博客数量 */
            pageSize: props.pageSize,
            /* 一共多少页 */
            pages: 1,
            /* 当前文章类型 */
            type: [],
            /* 搜索内容 */
            searchContent: '',
            /* 后端在数据库中的分组号 */
            classify: 2,
            /* 用户信息列表 */
            userInfoList: props.userInfoList,
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

        watch(
            () => props.searchContent,
            () => {
                data.searchContent = props.searchContent
                let title =
                    data.searchContent != '' ? [data.searchContent] : null
                // 修改当前页码为 1
                data.currentPage = 1
                getBlogListByType(
                    data.type,
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

        /* computed 用户热榜榜单 */
        const hotList = computed(() => {
            return list => {
                // 按照热度进行排序
                list.sort((a, b) => b.hot - a.hot)
                // 返回热度前5的用户信息
                return list.slice(0, 5)
            }
        })

        /* 显示消息提示框 */
        const showMessageBox = (message, type) => {
            let date = new Date()
            data.message = message
            data.messageType = type
            data.messageId = date.getTime()
        }

        /* change 博客类型 */
        const changeType = type => {
            // 在修改博客类型之后，重置当前页码为 1
            data.currentPage = 1
            data.type = type
            let title = data.searchContent != '' ? [data.searchContent] : null
            getBlogListByType(
                data.type,
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

        /* click 用户热榜榜单项 */
        const toUserPage = userId => {
            router.push(`/center/${userId}`)
        }
        /* click 上一页 */
        const prevPage = () => {
            // 判断是否为第一页
            if (data.currentPage === 1) {
                return showMessageBox('已经是第一页', 'warning')
            }
            data.currentPage--
            let title = data.searchContent != '' ? [data.searchContent] : null
            getBlogListByType(
                data.type,
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
            getBlogListByType(
                data.type,
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

        /* http 根据博客类型获取博客列表 */
        const getBlogListByType = (type, currentPage, pageSize, title) => {
            return http.post(`/blogs/${currentPage}/${pageSize}`, {
                type,
                title,
            })
        }
        return {
            ...toRefs(data),
            hotList,
            changeType,
            prevPage,
            nextPage,
            toUserPage,
        }
    },
}
</script>

<style lang="scss" scoped>
/* 背景颜色 */
$bg_color: #fff;

/* 后端页面 
----------------------------------------------------------------*/
.container {
    display: flex;
}

/* 左边博客 
----------------------------------------------------------------*/
.list_container {
    width: 860px;

    /* 左边博客 分页 */
    .list_pagination {
        display: flex;
        margin-top: 15px;
        font-size: 13px;
        justify-content: space-between;
        align-items: center;

        /* 左边博客 分页 上/下一页按钮 */
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

/* 右边侧边栏
----------------------------------------------------------------*/
.aside {
    flex: 1;
    padding: 0 20px;

    /* 右边侧边栏 热度榜单 */
    .hot_list {
        padding: 10px 0;
        background-color: $bg_color;

        /* 右边侧边栏 热度榜单--标题 */
        .hot_list_header {
            height: 40px;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            line-height: 40px;
        }

        /* 右边侧边栏 热度榜单--字段列表 */
        .hot_list_fields {
            display: flex;
            height: 40px;
            padding: 0 20px;
            font-size: 14px;
            line-height: 40px;
            justify-content: space-between;
        }

        /* 右边侧边栏 热度榜单--榜单项 */
        .hot_item {
            display: flex;
            height: 60px;
            padding: 0 25px;
            line-height: 40px;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            &:hover {
                background-color: #f3f3f3;
            }

            /* 右边侧边栏 热度榜单--榜单项(用户信息) */
            .user_info {
                overflow: hidden;
                width: 135px;
                white-space: nowrap;
                text-overflow: ellipsis;

                /* 右边侧边栏 热度榜单--榜单想(用户信息-用户头像) */
                img {
                    width: 40px;
                    height: 40px;
                    margin-right: 4px;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>
