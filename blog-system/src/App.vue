<template>
    <navbar></navbar>
    <router-view></router-view>
    <footers></footers>
</template>

<script>
import '@/assets/css/cssReset.css'
import navbar from '@/components/Navbar'
import footers from '@/components/Footer'

export default {
    components: {
        navbar,
        footers,
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
