<template>
    <div class="blog_setting">
        <div class="setting_title">博客管理</div>
        <div class="manage_search">
            <div class="search_condition_list">
                <input
                    class="search_condition_item"
                    type="text"
                    placeholder="标题"
                    v-model.trim="searchTitle"
                />
                <input
                    class="search_condition_item"
                    type="text"
                    placeholder="类型"
                    v-model.trim="searchType"
                />
            </div>
            <div class="search_btn" @click="searchEntry">搜索</div>
        </div>
        <div class="manage_blog_block">
            <div class="blog_header">
                <div class="title_item">标题</div>
                <div class="title_item">类型</div>
                <div class="title_item">更新时间</div>
                <div class="title_item">操作</div>
            </div>
            <div class="blog_list">
                <div class="blog_item" v-for="item in entryList" :key="item.id">
                    <div class="blog_item_title">{{ item.title }}</div>
                    <div class="blog_item_type">{{ item.type }}</div>
                    <div class="blog_item_date">
                        {{ dateTime(item.createTime) }}
                    </div>
                    <div class="operate_btn">
                        <div
                            class="operate_update"
                            @click="blogUpdate(item.id)"
                        >
                            修改
                        </div>
                        <div
                            class="operate_delete"
                            @click="showConfirm(item.id)"
                        >
                            删除
                        </div>
                    </div>
                </div>
            </div>
            <div class="blog_pagination">
                <div class="pagination_list">
                    <div class="operate_prev" @click="prevPage">上一页</div>
                    <div class="operate_next" @click="nextPage">下一页</div>
                </div>
                <div class="operate_add" @click="addBlog">新增</div>
            </div>
        </div>
        <!-- 确认对话框 -->
        <confirm-dialog
            :confirmState="confirmState"
            @selectResult="selectResult"
        ></confirm-dialog>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import http from '@/utils/http'
import dateFormatter from '@/utils/dateFormatter'

import confirmDialog from '@/components/ConfirmDialog'
export default {
    components: {
        confirmDialog,
    },
    setup(_, { emit }) {
        const router = useRouter()
        const store = useStore()

        const data = reactive({
            /* 搜索标题 */
            searchTitle: '',
            /* 搜索类型 */
            searchType: '',
            /* 当前页码 */
            currentPage: 1,
            /* 每页条数 */
            pageSize: 4,
            /* 一共多少页 */
            pages: 1,
            /* 文章列表 */
            entryList: [],
            /**
             * 是否点击了搜索按钮
             * true  点击了搜索
             * false 没有点击搜索
             */
            isClickSearch: false,
            /* 确认框显示状态 */
            confirmState: false,
            /* 当前要删除的博客id */
            entryId: null,
        })

        onMounted(() => {
            getEntryList()
        })

        /* 获取文章列表 */
        const getEntryList = (title = '', type = '') => {
            // 搜索条件处理
            title = title !== '' ? [title] : null
            type = type !== '' ? [type] : null
            getLoginUserEntryList(
                data.currentPage,
                data.pageSize,
                title,
                type
            ).then(res => {
                data.entryList = res.data.data.records
                data.pages = res.data.data.pages
            })
        }

        /* computed 文章时间 */
        const dateTime = computed(() => {
            return item => {
                return dateFormatter(item)
            }
        })

        /* customEvent 确认框 */
        const selectResult = res => {
            // 判断用户选择的操作
            if (!res) {
                // 取消操作，隐藏确认框
                emit('showMessageBox', { message: '取消删除', type: 'error' })
                return (data.confirmState = false)
            }
            // 确认操作，删除博客
            deleteEntry(data.entryId).then(res => {
                if (res.data.code === 20021) {
                    emit('showMessageBox', {
                        message: '删除成功',
                        type: 'success',
                    })
                    // 隐藏确认框
                    data.confirmState = false
                    // 删除当前博客对应的所有评论数据
                    deleteCommentsByEntryId(data.entryId)
                    // 删除当前博客对应的所有点赞数据
                    deleteLikesByEntryId(data.entryId)
                    // 删除当前博客对应的所有收藏数据
                    deleteCollectsByEntryId(data.entryId)
                    // 如果当前页只剩下最后一条数据
                    if (data.entryList.length === 1) {
                        // click 上一页
                        prevPage()
                    }
                    // 重新请求数据
                    // 判断是否点击了搜索按钮
                    if (data.isClickSearch) {
                        getEntryList(data.searchTitle, data.searchType)
                    } else {
                        getEntryList()
                    }
                } else {
                    emit('showMessageBox', {
                        message: '删除失败，请重试',
                        type: 'error',
                    })
                }
            })
        }

        /* click 搜索按钮 */
        const searchEntry = () => {
            data.currentPage = 1
            data.isClickSearch = true
            getEntryList(data.searchTitle, data.searchType)
        }
        /* click 修改 */
        const blogUpdate = id => {
            router.push(`/edit/${id}`)
        }
        /* click 删除 */
        const showConfirm = entryId => {
            // 传递被删除的文章id
            data.entryId = entryId
            // 显示确认框
            data.confirmState = true
        }
        /* click 上一页 */
        const prevPage = () => {
            if (data.currentPage > 1) {
                data.currentPage--
                // 判断是否点击了搜索按钮
                if (data.isClickSearch) {
                    getEntryList(data.searchTitle, data.searchType)
                } else {
                    getEntryList()
                }
            } else {
                emit('showMessageBox', {
                    message: '已经是第一页',
                    type: 'warning',
                })
            }
        }
        /* click 下一页 */
        const nextPage = () => {
            if (data.currentPage < data.pages) {
                data.currentPage++
                // 判断是否点击了搜索按钮
                if (data.isClickSearch) {
                    getEntryList(data.searchTitle, data.searchType)
                } else {
                    getEntryList()
                }
            } else {
                emit('showMessageBox', {
                    message: '已经是最后一页',
                    type: 'warning',
                })
            }
        }
        /* click 新增 */
        const addBlog = () => {
            router.push('/edit')
        }

        /* http 获取登录用户发表的博客 */
        const getLoginUserEntryList = (
            currentPage,
            pageSize,
            title = null,
            type = null
        ) => {
            return http.post(`/blogs/${currentPage}/${pageSize}`, {
                title,
                type,
                authorId: [store.state.userId],
            })
        }
        /* http 删除博客 */
        const deleteEntry = entryId => {
            return http.delete(`/blogs/${entryId}`)
        }
        /* http 根据博客id删除评论列表 */
        const deleteCommentsByEntryId = entryId => {
            return http.delete(`/comments/clear/${entryId}`)
        }
        /* http 根据博客id删除对应点赞列表 */
        const deleteLikesByEntryId = entryId => {
            return http.delete(`/likes/${entryId}`)
        }
        /* http 根据博客id删除对应收藏列表 */
        const deleteCollectsByEntryId = entryId => {
            return http.delete(`/collects/${entryId}`)
        }
        return {
            ...toRefs(data),
            dateTime,

            getEntryList,
            selectResult,
            searchEntry,
            blogUpdate,
            showConfirm,
            prevPage,
            nextPage,
            addBlog,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: rgba(
    $color: #b3e2f2,
    $alpha: 1,
);

/* 新增按钮颜色 */
$color_update: skyblue;

/* 删除按钮颜色 */
$color_delete: salmon;

/* 分页按钮颜色 */
$color_pagination: #35bcb5;

/* 个人信息页面--博客管理 
----------------------------------------------------------------*/
.blog_setting {
    /* 博客管理 标题 */
    .setting_title {
        height: 55px;
        border-bottom: 1px solid $border_line;
        font-size: 22px;
        font-weight: 600;
        line-height: 55px;
    }

    /* 博客管理 搜索栏 */
    .manage_search {
        display: flex;
        margin: 15px 0;
        padding: 20px;
        border: 1px solid $border_line;
        border-radius: 5px;
        justify-content: space-between;

        /* 博客管理 搜索栏--搜索列表 */
        .search_condition_list {
            display: flex;

            /* 博客管理 搜索栏--搜索列表(所有输入框) */
            input {
                width: 180px;
                height: 33px;
                margin-right: 15px;
                padding-left: 15px;
                border: 1px solid #c2c8d1;
                border-radius: 5px;
                outline: none;
                &:hover {
                    border: 1px solid #8693a4;
                }
                &:focus {
                    border: 1px solid #b4e5f6;
                }
            }
        }

        /* 博客管理 搜索栏--搜索按钮 */
        .search_btn {
            width: 80px;
            height: 35px;
            background-color: rgba($color: #5bc0de, $alpha: 0.75);
            color: #fff;
            font-size: 15px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.15s;
            &:hover {
                background-color: rgba($color: #5bc0de, $alpha: 1);
            }
        }
    }

    /* 博客管理 博客展示 */
    .manage_blog_block {
        padding: 15px 20px;
        border: 1px solid $border_line;
        border-radius: 5px;

        /* 博客管理 博客展示--页头 */
        .blog_header {
            display: flex;
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            justify-content: space-between;

            /* 博客管理 博客展示--页头(标题项) */
            .title_item {
                flex: 1;
            }
        }

        /* 博客管理 博客展示--博客列表 */
        .blog_list {
            min-height: 180px;
        }

        /* 博客管理 博客展示--博客列表项 */
        .blog_item {
            display: flex;
            height: 45px;
            font-size: 15px;
            line-height: 45px;
            justify-content: space-between;
            &:nth-child(odd) {
                background-color: rgba($color: #b4e5f3, $alpha: 0.7);
            }
            &:nth-child(even) {
                background-color: rgba($color: #e2f4ff, $alpha: 0.7);
            }

            /* 博客管理 博客展示--博客列表项(标题/类型/日期) */
            [class^='blog_item'] {
                width: 213px;
                text-align: center;
            }

            /* 博客管理 博客展示--博客列表项(标题) */
            .blog_item_title {
                overflow: hidden;
                width: 173px;
                padding: 0 20px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            /* 博客管理 博客展示--博客列表项(操作按钮) */
            .operate_btn {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;

                /* 博客管理 博客展示--博客列表项(操作按钮-修改/删除) */
                [class^='operate'] {
                    width: 60px;
                    height: 30px;
                    background-color: #fff;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-radius: 4px;

                    /* 博客管理 博客展示--博客列表项(修改) */
                    &:nth-child(1) {
                        margin-right: 5px;
                        border: 1px solid $color_update;
                        color: $color_update;
                    }

                    /* 博客管理 博客展示--博客列表项(删除) */
                    &:nth-child(2) {
                        border: 1px solid $color_delete;
                        color: $color_delete;
                    }
                }
            }
        }

        /* 博客管理 博客展示--分页 */
        .blog_pagination {
            display: flex;
            margin-top: 15px;
            font-size: 15px;
            justify-content: space-between;

            /* 博客管理 博客展示--分页(操作按钮-上一页/下一页/新增) */
            [class^='operate'] {
                width: 70px;
                height: 30px;
                border: 1px solid $color_pagination;
                color: $color_pagination;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.25s;
                &:hover {
                    border: 1px solid transparent;
                    background-color: rgba($color: #b4e2f2, $alpha: 0.7);
                    color: #fff;
                }

                &:first-child {
                    margin-right: 10px;
                }
            }

            /* 博客管理 博客展示--分页(分页操作项列表) */
            .pagination_list {
                display: flex;
            }
        }
    }
}
</style>
