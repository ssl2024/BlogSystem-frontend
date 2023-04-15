<template>
    <div class="blog_setting">
        <div class="setting_title">博客管理</div>
        <div class="manage_search">
            <div class="search_condition_list">
                <input
                    class="search_condition_item"
                    type="text"
                    placeholder="标题"
                    v-model="searchTitle"
                />
                <input
                    class="search_condition_item"
                    type="text"
                    placeholder="类型"
                    v-model="searchType"
                />
            </div>
            <div class="search_btn" @click="searchBlog">搜索</div>
        </div>
        <div class="manage_blog_block">
            <div class="blog_header">
                <div class="title_item">标题</div>
                <div class="title_item">类型</div>
                <div class="title_item">更新时间</div>
                <div class="title_item">操作</div>
            </div>
            <div class="blog_list">
                <div class="blog_item">
                    <div class="blog_item_title">这是一个标题</div>
                    <div class="blog_item_type">这是博客类型</div>
                    <div class="blog_item_date">2023-04-15 21:08</div>
                    <div class="operate_btn">
                        <div class="operate_update" @click="blogUpdate">
                            修改
                        </div>
                        <div class="operate_delete" @click="blogDelete">
                            删除
                        </div>
                    </div>
                </div>
                <div class="blog_item">
                    <div class="blog_item_title">这是一个标题</div>
                    <div class="blog_item_type">这是博客类型</div>
                    <div class="blog_item_date">2023-04-15 21:08</div>
                    <div class="operate_btn">
                        <div class="operate_update" @click="blogUpdate">
                            修改
                        </div>
                        <div class="operate_delete" @click="blogDelete">
                            删除
                        </div>
                    </div>
                </div>
                <div class="blog_item">
                    <div class="blog_item_title">这是一个标题</div>
                    <div class="blog_item_type">这是博客类型</div>
                    <div class="blog_item_date">2023-04-15 21:08</div>
                    <div class="operate_btn">
                        <div class="operate_update" @click="blogUpdate">
                            修改
                        </div>
                        <div class="operate_delete" @click="blogDelete">
                            删除
                        </div>
                    </div>
                </div>
                <div class="blog_item">
                    <div class="blog_item_title">这是一个标题</div>
                    <div class="blog_item_type">这是博客类型</div>
                    <div class="blog_item_date">2023-04-15 21:08</div>
                    <div class="operate_btn">
                        <div class="operate_update" @click="blogUpdate">
                            修改
                        </div>
                        <div class="operate_delete" @click="blogDelete">
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
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    setup() {
        const data = reactive({
            /* 搜索标题 */
            searchTitle: '',
            /* 搜索类型 */
            searchType: '',
        })

        /* click 搜索按钮 */
        const searchBlog = () => {
            console.log('点击了搜索按钮')
        }
        /* click 修改 */
        const blogUpdate = () => {
            console.log('点击了修改')
        }
        /* click 删除 */
        const blogDelete = () => {
            console.log('点击了删除')
        }
        /* click 上一页 */
        const prevPage = () => {
            console.log('点击了上一页')
        }
        /* click 下一页 */
        const nextPage = () => {
            console.log('点击了下一页')
        }
        /* click 新增 */
        const addBlog = () => {
            console.log('点击了新增')
        }
        return {
            ...toRefs(data),
            searchBlog,
            blogUpdate,
            blogDelete,
            prevPage,
            nextPage,
            addBlog,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

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
                height: 33x;
                margin-right: 15px;
                padding-left: 15px;
                border: 1px solid #c2c8d1;
                border-radius: 5px;
                outline: none;
                &:hover {
                    border: 1px solid salmon;
                }
                &:focus {
                    border: 1px solid skyblue;
                }
            }
        }

        /* 博客管理 搜索栏--搜索按钮 */
        .search_btn {
            width: 80px;
            height: 35px;
            background-color: #5bc0de;
            color: #fff;
            font-size: 15px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            border-radius: 5px;
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

        /* 博客管理 博客展示--博客列表项 */
        .blog_item {
            display: flex;
            height: 45px;
            font-size: 15px;
            line-height: 45px;
            justify-content: space-between;
            &:nth-child(odd) {
                background-color: #f3f3f3;
            }
            &:nth-child(even) {
                background-color: #c2c8d1;
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
