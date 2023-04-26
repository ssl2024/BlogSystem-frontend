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
    props: {
        pageSize: {
            type: Number,
            default: 5,
        },
    },
    setup(props) {
        const route = useRoute()

        const data = reactive({
            /* 文章列表 */
            entryList: [],
            /* 当前页码 */
            currentPage: 1,
            /* 每页条数 */
            pageSize: props.pageSize,
        })
        onMounted(() => {
            // 分页获取用户收藏的博客
            // 先获取该用户收藏的博客id数据
            getLikeBlogIdList()
                .then(res => {
                    if (res.data.code === 20041) {
                        let arr = []
                        // 遍历返回数据，收集博客id
                        res.data.data.forEach(item => {
                            arr.push(item.blogId)
                        })
                        // 获取用户收藏的博客列表
                        return getUserLikeBlogList(arr)
                    }
                })
                .then(res => {
                    if (res.data.code === 20041) {
                        data.entryList = res.data.data.records
                    }
                })
        })

        /* http 获取收藏博客id列表 */
        const getLikeBlogIdList = () => {
            return http.get(`/collects/list/${route.params.id}`)
        }
        /* http 获取用户收藏的博客列表 */
        const getUserLikeBlogList = arr => {
            return http.post(`/blogs/${data.currentPage}/${data.pageSize}`, {
                id: arr,
            })
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
