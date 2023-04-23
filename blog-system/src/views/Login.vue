<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-13 00:46:55
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-04-22 17:02:32
 * @Description: 
-->
<template>
    <login v-show="store.state.loginState === 1"></login>
    <register v-show="store.state.loginState === 2"></register>
    <forget v-show="store.state.loginState === 3"></forget>
    <message-tips></message-tips>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

import messageTips from '@/components/login/MessageTips'

import login from '@/views/login/Login'
import register from '@/views/login/Register'
import forget from '@/views/login/Forget'
export default {
    components: {
        login,
        register,
        forget,
        messageTips,
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
