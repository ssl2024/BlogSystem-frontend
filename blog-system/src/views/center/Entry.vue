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
            // 分页获取用户发表的博客
            http.post(`/blogs/${data.currentPage}/${data.pageSize}`, {
                authorId: [route.params.id],
            }).then(res => {
                if (res.data.code === 20041) {
                    data.entryList = res.data.data.records
                }
            })
        })
        return {
            ...toRefs(data),
        }
    },
}
</script>

<style></style>
