<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-12 01:31:23
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 15:56:15
 * @Description: 分页组件
-->
<template>
    <!-- 分页组件 -->
    <div class="list_pagination">
        <div class="operate_prev" @click="prevPage">上一页</div>
        <span class="page_number">{{ currentPage }} / {{ pages }}</span>
        <div class="operate_next" @click="nextPage">下一页</div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    props: {
        currentPage: {
            type: Number,
        },
        pages: {
            type: Number,
        },
    },
    setup(props, { emit }) {
        const data = reactive({
            currentPage: props.currentPage,
            pages: props.currentPage,
        })

        /* click 上一页 */
        const prevPage = () => {
            emit('prevPage')
        }
        /* click 下一页 */
        const nextPage = () => {
            emit('nextPage')
        }
        return {
            ...toRefs(data),
            prevPage,
            nextPage,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 分页组件
----------------------------------------------------------------*/
.list_pagination {
    display: flex;
    padding: 5px;
    border: 1px solid rgba($color: #cbe5eb, $alpha: 0.4);
    background-color: transparent;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 4px 4px rgb(0 0 0 / 0.1), 0 2px 2px rgb(0 0 0 / 0.1);
    font-size: 13px;
    justify-content: space-between;
    align-items: center;

    /* 分页 上/下一页按钮 */
    [class^='operate'] {
        position: relative;
        width: 120px;
        height: 45px;
        background-color: rgba($color: #fefefe, $alpha: 0.8);
        text-align: center;
        line-height: 45px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s;
        &:hover {
            background-color: rgba($color: #45b8cc, $alpha: 0.7);
            color: #fff;
        }
    }

    /* 分页 页码 */
    .page_number {
        color: #fff;
        opacity: 0.8;
    }
}
</style>
