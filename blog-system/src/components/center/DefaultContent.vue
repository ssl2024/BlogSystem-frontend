<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-11 17:10:28
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-11 17:34:01
 * @Description: 个人主页-默认显示内容
-->
<template>
    <div class="empty_blog">
        <p>{{ message }}</p>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    props: {
        message: {
            type: String,
            default: '这个人很懒，什么都没留下',
        },
    },
    setup(props) {
        const data = reactive({
            message: props.message,
        })
        return {
            ...toRefs(data),
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
