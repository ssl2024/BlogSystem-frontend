<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-11 17:10:28
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 02:02:10
 * @Description: 默认内容组件
-->
<template>
    <!-- 默认内容组件 -->
    <div class="empty_blog" ref="defaultContent">
        <p>{{ message }}</p>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
export default {
    props: {
        message: {
            type: String,
            default: '这个人很懒，什么都没留下',
        },
        height: {
            type: Number,
            default: 230,
        },
    },
    setup(props) {
        const data = reactive({
            message: props.message,
        })

        /* DOM 默认内容 */
        const defaultContent = ref(null)

        onMounted(() => {
            defaultContent.value.style.height = props.height + 'px'
        })

        return {
            ...toRefs(data),
            defaultContent,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
.empty_blog {
    display: flex;
    height: 230px;
    background-color: rgba($color: #fefefe, $alpha: 0.8);
    color: #888;
    font-size: 20px;
    justify-content: center;
    align-items: center;
}
</style>
