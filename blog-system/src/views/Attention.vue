<template>
    <div>
        <div>关注</div>
        <div class="container">
            <div class="content">
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
            <div class="aside"></div>
        </div>
    </div>
</template>

<script>
import blog from '@/components/Blog'
export default {
    components: {
        blog,
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
