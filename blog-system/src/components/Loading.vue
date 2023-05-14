<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-08 19:16:32
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 15:50:47
 * @Description: 加载框组件
-->
<template>
    <!-- 加载框组件 -->
    <div class="loading">
        <div class="loading_spinner"></div>
        <span class="loading_tips">加载中...</span>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped="scoped">
/* 加载框组件
----------------------------------------------------------------*/
.loading {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.3);
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /* 加载框 转轮 */
    .loading_spinner {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 4px solid rgba(255, 255, 255, 0.5);
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
    }

    /* 加载框 提示文字 */
    .loading_tips {
        margin-top: 5px;
        color: #f6f6f6;
        font-size: 18px;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
