<template>
    <div>博客详情页</div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
export default {
    setup() {
        const route = useRoute()
        onMounted(() => {
            console.log(route.params)
        })
    },
}
</script>

<style></style>
