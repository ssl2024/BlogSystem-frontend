<template>
    <div>
        <div>后端</div>
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
        width: 820px;
        background-color: red;
    }
    .aside {
        width: 350px;
        background-color: yellow;
    }
}
</style>
