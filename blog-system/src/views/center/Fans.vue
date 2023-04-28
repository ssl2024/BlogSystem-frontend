<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 15:20:18
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-28 16:14:14
 * @Description: 
-->
<template>
    <div class="fans_list">
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
            /* 粉丝列表 */
            fansList: [],
            /* 当前页 */
            currentPage: 1,
            /* 每页显示条数 */
            pageSize: props.pageSize,
        })
        onMounted(() => {
            // 根据用户id获取粉丝列表
            getFansIdList().then(res => {
                // 对返回数据进行处理
                if (res.data.code === 20041) {
                    // 获取用户粉丝的id列表
                    let fansIdList = []
                    res.data.data.forEach(item => {
                        fansIdList.push(item.followUserId)
                    })
                    // 根据返回的粉丝id列表获取粉丝用户信息
                    return getUserList(fansIdList).then(res => {
                        if (res.data.code === 20041) {
                            data.fansList = res.data.data.records
                        }
                    })
                }
            })
        })

        /* http 根据用户id获取粉丝id列表 */
        const getFansIdList = () => {
            return http.get(`/follows/fans/${route.params.id}`)
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
/* 个人主页页面--粉丝列表
----------------------------------------------------------------*/
.fans_list {
    background-color: #fff;
}
</style>
