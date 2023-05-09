<template>
    <div v-if="show" class="message_box">
        <i class="iconfont icon-chenggong2"></i>
        <span>{{ message }}</span>
    </div>
</template>

<script>
import { ref, watchEffect, onUnmounted } from 'vue'

export default {
    props: {
        message: String,
        duration: {
            type: Number,
            default: 3000, // 默认显示3秒
        },
    },
    setup(props) {
        /**
         * 是否显示消息提示框
         * true  显示
         * false 不显示
         */
        const show = ref(false)
        /* 定时器引用 */
        let timer = null

        onUnmounted(() => {
            // 如果存在定时器则清除定时器
            timer && clearTimeout(timer)
        })

        watchEffect(() => {
            if (props.message) {
                // 创建消息提示框
                show.value = true
                // 如果存在定时器则清除定时器
                timer && clearTimeout(timer)
                // 在一定的延迟时间后卸载消息提示框
                timer = setTimeout(() => {
                    show.value = false
                }, props.duration)
            }
        })

        return { show }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 消息提示框组件
----------------------------------------------------------------*/
.message_box {
    display: flex;
    position: fixed;
    left: 50%;
    width: 380px;
    height: 45px;
    background-color: #f0f9eb;
    color: #67c23a;
    font-size: 14px;
    border-radius: 5px;
    opacity: 1;
    transform: translateX(-50%);
    justify-content: center;
    align-items: center;
    animation: show-message 3s ease-in-out forwards;

    :first-child {
        margin-right: 10px;
    }
}

@keyframes show-message {
    0% {
        opacity: 0;
        top: -30px;
    }
    10% {
        opacity: 1;
        top: 30px;
    }
    90% {
        opacity: 1;
        top: 30px;
    }
    100% {
        opacity: 0;
        top: -30px;
    }
}
</style>
