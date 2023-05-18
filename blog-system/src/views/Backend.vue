<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 23:56:23
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 14:12:47
 * @Description: 后端页面
-->
<template>
    <!-- S 后端模块 -->
    <div class="container">
        <!-- 博客列表 -->
        <div class="list_container">
            <!-- 博客分页组件 -->
            <list-header
                :classify="classify"
                @changeType="changeType"
            ></list-header>
            <!-- 博客列表 -->
            <div class="list_wrap">
                <blog
                    v-for="item in entryList"
                    :key="item.id"
                    :entry="item"
                    :authorName="authorInfo.get(item.authorId)"
                ></blog>
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
        <!-- 侧边栏 -->
        <div class="aside">
            <!-- 用户热榜 -->
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
                        :title="'查看 ' + item.nickname + ' 主页'"
                        v-for="(item, index) in userInfoList"
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
    </div>
    <!-- E 后端模块 -->
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
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
    setup(props, { emit }) {
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
            /* 存储后端页面博客用户id 及其信息 */
            authorInfo: new Map(),
        })

        onMounted(() => {
            // 修改导航栏placeholder
            emit('changePageLocation', 3)
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
                return showMessageBox({
                    message: '已经是第一页',
                    type: 'warning',
                })
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
                return showMessageBox({
                    message: '已经是最后一页',
                    type: 'warning',
                })
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
        /* http 获取用户信息 */
        const getUserInfo = userId => {
            return http.get(`/users/${userId}`)
        }
        return {
            ...toRefs(data),
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

/* 热度榜单边框颜色 */
$border_line: rgba(
    $color: #cbe5eb,
    $alpha: 0.4,
);

/* 后端页面 
----------------------------------------------------------------*/
.container {
    display: flex;
    margin-top: 125px;
}

/* 左边博客 
----------------------------------------------------------------*/
.list_container {
    width: 860px;
}

/* 右边侧边栏
----------------------------------------------------------------*/
.aside {
    flex: 1;
    padding: 0 20px;

    /* 右边侧边栏 热度榜单 */
    .hot_list {
        padding: 10px 0;
        border-top: 1px solid $border_line;
        border-bottom: 1px solid $border_line;
        background-color: rgba($color: $bg_color, $alpha: 0.1);
        border-radius: 5px;
        box-shadow: 0 4px 4px rgb(0 0 0 / 0.1), 0 2px 2px rgb(0 0 0 / 0.1);

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
            transition: all 0.2s;
            &:hover {
                background-color: rgba($color: $bg_color, $alpha: 0.7);
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
