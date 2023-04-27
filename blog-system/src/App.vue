<template>
    <navbar v-if="isLogin"></navbar>
    <router-view :pageSize="pageSize"></router-view>
    <footers v-if="isLogin"></footers>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

import '@/assets/css/cssReset.css'
import navbar from '@/components/Navbar'
import footers from '@/components/Footer'
export default {
    components: {
        navbar,
        footers,
    },
    setup() {
        const store = useStore()

        const data = reactive({
            /* 首页中每页博客条数 */
            pageSize: 10,
        })

        /* computed 登录状态 */
        const isLogin = computed(() => {
            return store.state.isLogin
        })
        return {
            ...toRefs(data),
            isLogin,
        }
    },
}
</script>

<style lang="scss">
body,
html {
    width: 1170px;
    margin: 0 auto;
    padding: 0 15px;
    background-color: #f2f3f5;
}
</style>
