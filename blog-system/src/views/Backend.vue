<template>
    <div>
        <div>后端</div>
        <div class="container">
            <div class="list_container">
                <list-header></list-header>
                <div class="list_wrap">
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                    <blog></blog>
                </div>
            </div>
            <div class="aside"></div>
        </div>
    </div>
</template>

<script>
import blog from '@/components/Blog'
import listHeader from '@/components/ListHeader'

export default {
    components: {
        blog,
        listHeader,
    },
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    .list_container {
        width: 820px;
    }
    .aside {
        width: 350px;
        background: yellow;
    }
}
</style>
