<template>
    <navbar></navbar>
    <router-view></router-view>
</template>

<script>
// import 'normalize.css/normalize.css'
import '@/assets/css/cssReset.css'
import navbar from '@/components/Navbar'

export default {
    components: {
        navbar,
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
