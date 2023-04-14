<template>
    <login v-show="store.state.loginState === 1"></login>
    <register v-show="store.state.loginState === 2"></register>
    <forget v-show="store.state.loginState === 3"></forget>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

import login from '@/views/login/Login'
import register from '@/views/login/Register'
import forget from '@/views/login/Forget'
export default {
    components: {
        login,
        register,
        forget,
    },
    setup() {
        const store = useStore()
        const data = reactive({
            loginState: 1,
        })
        return {
            store,
            ...toRefs(data),
        }
    },
}
</script>

<style lang="scss" scoped="scoped"></style>
