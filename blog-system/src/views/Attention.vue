<template>
    <div>
        <div class="container">
            <div class="content">
                <blog
                    v-for="item in entryList"
                    :key="item.id"
                    :entry="item"
                ></blog>
            </div>
            <div class="aside"></div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
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
            /* 当前页 */
            currentPage: 1,
            /* 当前页博客数量 */
            pageSize: 10,
        })

        onMounted(() => {
            // 获取当前登录用户关注的用户id列表
            getFollowIdList(store.state.user.id).then(res => {
                if (res.data.code === 20041) {
                    // 处理数据，获取其中的用户id列表
                    let userIdList = []
                    res.data.data.forEach(item => {
                        userIdList.push(item.followedUserId)
                    })
                    // 根据用户id获取其发表的博客列表
                    getBlogList(userIdList).then(res => {
                        if (res.data.code === 20041) {
                            data.entryList = res.data.data.records
                        }
                    })
                }
            })
        })

        /* http 根据id获取关注的用户id列表 */
        const getFollowIdList = id => {
            return http.get(`/follows/follow/${id}`)
        }
        /* http 根据用户id列表获取博客列表*/
        const getBlogList = authorIds => {
            return http.post(`/blogs/${data.currentPage}/${data.pageSize}`, {
                authorId: authorIds,
            })
        }
        return {
            ...toRefs(data),
            getFollowIdList,
            getBlogList,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
.container {
    display: flex;
    .content {
        width: 870px;
    }
    .aside {
        width: 300px;
    }
}
</style>
