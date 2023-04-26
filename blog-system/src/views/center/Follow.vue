<template>
    <div class="follow_list">
        <user-item
            v-for="item in fansList"
            :key="item.id"
            :user="item"
        ></user-item>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'

import http from '@/utils/http'

import userItem from '@/components/center/UserItem'
export default {
    components: {
        userItem,
    },
    props: {
        pageSize: {
            type: Number,
            default: 5,
        },
    },
    setup(props) {
        const route = useRoute()

        const data = reactive({
            /* 关注列表 */
            fansList: [],
            /* 当前页 */
            currentPage: 1,
            /* 每页显示条数 */
            pageSize: props.pageSize,
        })
        onMounted(() => {
            // 根据用户id获取关注列表
            getFansIdList().then(res => {
                // 对返回数据进行处理
                if (res.data.code === 20041) {
                    // 获取用户关注的id列表
                    let followIdList = []
                    res.data.data.forEach(item => {
                        followIdList.push(item.followedUserId)
                    })
                    // 根据返回的关注id列表获取关注用户信息
                    return getUserList(followIdList).then(res => {
                        if (res.data.code === 20041) {
                            data.fansList = res.data.data.records
                        }
                    })
                }
            })
        })

        /* http 根据用户id获取关注id列表 */
        const getFansIdList = () => {
            return http.get(`/follows/follow/${route.params.id}`)
        }

        /* http 根据用户id列表获取用户 */
        const getUserList = ids => {
            return http.post(`/users/${data.currentPage}/${data.pageSize}`, {
                id: ids,
            })
        }

        return {
            ...toRefs(data),
            getFansIdList,
            getUserList,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 个人主页页面--关注列表
----------------------------------------------------------------*/
.follow_list {
    background-color: #fff;
}
</style>
