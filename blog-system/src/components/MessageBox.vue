<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-05-10 01:13:54
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-17 15:30:27
 * @Description: 消息提示框组件
-->
<template>
    <!-- 消息提示框组件 -->
    <div v-if="show" class="message_box" :class="type">
        <i class="iconfont" :class="'icon-' + type"></i>
        <span>{{ message }}</span>
    </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'

export default {
    props: {
        message: {
            type: String,
            required: true,
        },
        messageId: {
            type: Number,
            default: -1,
        },
        type: {
            type: String,
            default: 'success',
        },
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

        watch(
            () => props.messageId,
            () => {
                if (props.messageId != -1) {
                    // 判断当前显示状态
                    if (show.value) {
                        // 显示中，销毁当前消息提示框，重新创建
                        show.value = false
                        clearTimeout(timer)
                        setTimeout(() => {
                            createMessageBox()
                        }, 0)
                    } else {
                        createMessageBox()
                    }
                }
            }
        )

        /* 创建消息提示框 */
        const createMessageBox = () => {
            show.value = true
            timer = setTimeout(() => {
                show.value = false
                clearTimeout(timer)
            }, props.duration)
        }

        return {
            show,
        }
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
    font-size: 14px;
    border-radius: 5px;
    opacity: 1;
    transform: translateX(-50%);
    justify-content: center;
    align-items: center;
    animation: show-message 3s ease-in-out forwards;

    /* 字体图标 */
    :first-child {
        margin-right: 10px;
    }
}

/* 成功样式 */
.success {
    background-color: #f0f9eb;
    color: #67c23a;
}

/* 警告样式 */
.warning {
    background-color: #fdf6ec;
    color: #e6a23c;
}

/* 失败样式 */
.error {
    background-color: #fef0f0;
    color: #f56c6c;
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
