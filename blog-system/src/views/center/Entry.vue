<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-11 19:51:45
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-23 22:11:56
 * @Description: 
-->
<template>
    <div>
        <blog v-for="item in entryList" :key="item.id" :entry="item"></blog>
    </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'

import http from '@/utils/http'

import blog from '@/components/Blog'
export default {
    components: {
        blog,
    },
    setup() {
        const store = useStore()

        const data = reactive({
            /* 文章列表 */
            entryList: [],
            currentPage: 1,
            pageSize: 5,
        })
        onMounted(() => {
            http.post(`/blogs/${data.currentPage}/${data.pageSize}`, {
                authorId: store.state.user.id,
            }).then(res => {
                if (res.data.code === 20041) {
                    data.entryList = res.data.data.records
                } else {
                    alert('当前用户发表的博客查询失败')
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
