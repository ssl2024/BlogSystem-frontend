<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-26 00:19:52
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-11 17:48:47
 * @Description: 个人主页-用户关注
-->
<template>
    <div>
        <div class="follow_list">
            <user-item
                v-for="item in followList"
                :key="item.id"
                :user="item"
                @showMessageBox="showMessageBox"
            ></user-item>
            <default-content
                v-if="total === 0"
                message="没有博主能够吸引他，所以他谁都没有关注"
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
import { onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'

import http from '@/utils/http'

import userItem from '@/components/center/UserItem'
import defaultContent from '@/components/center/DefaultContent'
export default {
    components: {
        userItem,
        defaultContent,
    },
    props: {
        pageSize: {
            type: Number,
            default: 5,
        },
    },
    setup(props, { emit }) {
        const route = useRoute()

        const data = reactive({
            /* 当前用户展示的关注列表 */
            followList: [],
            /* 当前用户的粉丝id列表 */
            followIdList: [],
            /* 当前页 */
            currentPage: 1,
            /* 每页显示条数 */
            pageSize: props.pageSize,
            /* 一共多少页 */
            pages: 1,
            /* 一共多少条 */
            total: 1,
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
            // 根据用户id获取关注列表
            getFansIdList().then(res => {
                // 对返回数据进行处理
                if (res.data.code === 20041) {
                    // 获取用户关注的id列表
                    res.data.data.forEach(item => {
                        data.followIdList.push(item.followedUserId)
                    })
                    // 判断用户是否有关注的用户
                    if (data.followIdList.length > 0) {
                        // 根据返回的关注id列表获取关注用户信息
                        getUserList(
                            data.currentPage,
                            data.pageSize,
                            data.followIdList
                        ).then(res => {
                            if (res.data.code === 20041) {
                                data.followList = res.data.data.records
                                data.pages = res.data.data.pages
                                data.total = res.data.data.total
                                data.isShowPagination =
                                    res.data.data.total > data.pageSize
                                        ? true
                                        : false
                            }
                        })
                    } else {
                        // 用户没有关注
                        data.total = 0
                    }
                }
            })
        })

        /* customEvent 显示消息框 */
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
                return emit('showMessageBox', {
                    message: '已经是第一页',
                    type: 'warning',
                })
            }
            data.currentPage--
            getUserList(
                data.currentPage,
                data.pageSize,
                data.followIdList
            ).then(res => {
                if (res.data.code === 20041) {
                    data.followList = res.data.data.records
                    data.pages = res.data.data.pages
                }
            })
        }
        /* click 下一页 */
        const nextPage = () => {
            // 判断是否为最后一页
            if (data.currentPage === data.pages) {
                return emit('showMessageBox', {
                    message: '已经是最后一页',
                    type: 'warning',
                })
            }
            data.currentPage++
            getUserList(
                data.currentPage,
                data.pageSize,
                data.followIdList
            ).then(res => {
                if (res.data.code === 20041) {
                    data.followList = res.data.data.records
                    data.pages = res.data.data.pages
                }
            })
        }

        /* http 根据用户id获取关注id列表 */
        const getFansIdList = () => {
            return http.get(`/follows/follow/${route.params.id}`)
        }
        /* http 根据用户id列表获取用户 */
        const getUserList = (currentPage, pageSize, ids) => {
            return http.post(`/users/${currentPage}/${pageSize}`, {
                id: ids,
            })
        }
        return {
            ...toRefs(data),
            showMessageBox,
            prevPage,
            nextPage,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 个人主页页面--关注列表
----------------------------------------------------------------*/
.follow_list {
    min-height: 460px;
    height: 460px;
    // background-color: rgba($color: #fff, $alpha: 0.85);
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
