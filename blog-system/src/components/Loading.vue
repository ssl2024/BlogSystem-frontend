<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-08 19:16:32
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-08 22:31:45
 * @Description: Loading加载框
-->
<template>
    <div class="loading">
        <div class="loading_spinner"></div>
        <span class="loading_tips">加载中...</span>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped="scoped">
// 样式 1
.loading {
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 210px;
    height: 210px;
    border-radius: 25px;
    background-color: #4c4c4c;
    transform: translate(-50%, -50%);
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .loading_spinner {
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-top-color: #f6f6f6;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s ease-in-out infinite;
    }

    .loading_tips {
        margin-top: 5px;
        color: #f6f6f6;
        font-size: 18px;
    }
}

// 样式 2
// .loading {
//     display: flex;
//     position: fixed;
//     top: 0;
//     width: 1170px;
//     height: 100vh;
//     margin: 0 auto;
//     background-color: rgba(0, 0, 0, 0.3);
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;

//     .loading_spinner {
//         width: 40px;
//         height: 40px;
//         border-radius: 50%;
//         border: 4px solid rgba(255, 255, 255, 0.5);
//         border-top-color: white;
//         animation: spin 1s ease-in-out infinite;
//     }
//     .loading_tips {
//         margin-top: 5px;
//         color: #f6f6f6;
//         font-size: 18px;
//     }
// }

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
