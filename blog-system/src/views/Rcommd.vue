<template>
    <div>
        <div>推荐</div>
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

<style lang="scss" scoped>
.container {
    display: flex;
    .content {
        width: 870px;
        background-color: red;
    }
    .aside {
        width: 300px;
        background-color: yellow;
    }
}
</style>
