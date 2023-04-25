<template>
    <div>
        <blog v-for="item in entryList" :key="item.id" :entry="item"></blog>
    </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useRoute } from 'vue-router'

import http from '@/utils/http'

import blog from '@/components/Blog'
export default {
    components: {
        blog,
    },
    setup() {
        const route = useRoute()

        const data = reactive({
            /* 文章列表 */
            entryList: [],
            /* 当前页码 */
            currentPage: 1,
            /* 每页条数 */
            pageSize: 5,
        })
        onMounted(() => {
            // 分页获取用户点赞的博客
            getLikeBlogIdList().then(res => {
                if (res.data.code === 20041) {
                    let arr = []
                    res.data.data.forEach(item => {
                        arr.push(item.blogId)
                    })
                    return arr
                }
            })
        })

        /* 获取点赞博客id列表 */
        const getLikeBlogIdList = () => {
            return http.get(`/likes/list/${route.params.id}`)
        }
        /* 获取用户点赞的博客列表 */
        const getUserLikeBlogList = () => {
            // return http.get()
        }
        return {
            ...toRefs(data),
            getLikeBlogIdList,
            getUserLikeBlogList,
        }
    },
}
</script>

<style></style>
