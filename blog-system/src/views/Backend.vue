<template>
    <div class="container">
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
        </div>
        <div class="aside">
            <div class="hot_list">
                <div class="hot_list_header">热度榜单</div>
                <div class="hot_list_fields">
                    <span>排名</span>
                    <span>用户</span>
                    <span>热度</span>
                </div>
                <ul class="hot_list_data">
                    <li class="hot_item">
                        <div class="hot_sort">1</div>
                        <div class="user_info">
                            <span class="avatar">
                                <img
                                    src="https://iph.href.lu/40x40"
                                    alt="热度榜单用户头像"
                                />
                            </span>
                            <span>石松林_前端基础</span>
                        </div>
                        <div class="hot_score">789</div>
                    </li>
                    <li class="hot_item">
                        <div class="hot_sort">2</div>
                        <div class="user_info">
                            <span class="avatar">
                                <img
                                    src="https://iph.href.lu/40x40"
                                    alt="热度榜单用户头像"
                                />
                            </span>
                            <span>石松林_前端框架</span>
                        </div>
                        <div class="hot_score">600</div>
                    </li>
                    <li class="hot_item">
                        <div class="hot_sort">3</div>
                        <div class="user_info">
                            <span class="avatar">
                                <img
                                    src="https://iph.href.lu/40x40"
                                    alt="热度榜单用户头像"
                                />
                            </span>
                            <span>石松林_后端基础</span>
                        </div>
                        <div class="hot_score">499</div>
                    </li>
                    <li class="hot_item">
                        <div class="hot_sort">4</div>
                        <div class="user_info">
                            <img
                                src="https://iph.href.lu/40x40"
                                alt="热度榜单用户头像"
                            />
                            <span>石松林_后端框架</span>
                        </div>
                        <div class="hot_score">456</div>
                    </li>
                    <li class="hot_item">
                        <div class="hot_sort">5</div>
                        <div class="user_info">
                            <span class="avatar">
                                <img
                                    src="https://iph.href.lu/40x40"
                                    alt="热度榜单用户头像"
                                />
                            </span>
                            <span>这真是一个难做的项目</span>
                        </div>
                        <div class="hot_score">388</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

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
    },
    setup(props) {
        const data = reactive({
            /* 文章列表 */
            entryList: [],
            /* 当前页 */
            currentPage: 1,
            /* 当前页博客数量 */
            pageSize: props.pageSize,
            /* 后端在数据库中的分组号 */
            classify: 2,
        })

        /* change 博客类型 */
        const changeType = type => {
            getBlogListByType(type).then(res => {
                if (res.data.code === 20041) {
                    data.entryList = res.data.data.records
                }
            })
        }

        /* http 根据博客类型获取博客列表 */
        const getBlogListByType = type => {
            return http.post(`/blogs/${data.currentPage}/${data.pageSize}`, {
                type,
            })
        }
        return {
            ...toRefs(data),
            changeType,
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
                    border-radius: 50%;
                    margin-right: 2px;
                }
            }
        }
    }
}
</style>
