<template>
    <div class="modal" v-show="confirmState">
        <div class="modal_content">
            <div class="modal_header">
                <h3>{{ title }}</h3>
                <button class="close_btn" @click="cancel">&times;</button>
            </div>
            <div class="modal_body">
                <p>{{ message }}</p>
            </div>
            <div class="modal_footer">
                <button class="btn cancel_btn" @click="cancel">取消</button>
                <button class="btn confirm_btn" @click="confirm">确定</button>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    props: {
        title: {
            type: String,
            default: '提示',
        },
        message: {
            type: String,
            default: '确定要执行此操作吗？',
        },
        confirmState: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, { emit }) {
        const data = reactive({
            /* 确认框标题 */
            title: props.title,
            /* 确认框内容 */
            message: props.message,
            /**
             * 确认框状态
             * true  显示
             * false 不显示
             */
            confirmState: props.confirmState,
        })

        /* click 取消 */
        const cancel = () => {
            emit('selectResult', false)
        }
        /* click 确定 */
        const confirm = () => {
            emit('selectResult', true)
        }
        return {
            ...toRefs(data),
            cancel,
            confirm,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 确认对话框组件
----------------------------------------------------------------*/
.modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    justify-content: center;
    align-items: center;

    /* 确认对话框 内容主体 */
    .modal_content {
        max-width: 500px;
        width: 100%;
        background-color: rgba($color: #fff, $alpha: 0.9);
        // color: rgba($color: #000000, $alpha: 0.7);
        border-radius: 5px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

        /* 确认对话框 内容主体--标题 */
        .modal_header {
            position: relative;
            padding: 20px;

            /* 确认对话框 内容主体--标题(标题内容) */
            h3 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }

            /* 确认对话框 内容主体--标题(关闭按钮) */
            .close_btn {
                position: absolute;
                top: 20px;
                right: 20px;
                border: none;
                background-color: transparent;
                color: #ccc;
                font-size: 30px;
                cursor: pointer;
                transition: 0.15s;
                &:hover {
                    color: #000;
                }
            }
        }

        /* 确认对话框 内容主体--提示内容 */
        .modal_body {
            padding: 20px;

            p {
                margin: 0;
                font-size: 18px;
                line-height: 24px;
            }
        }

        /* 确认对话框 内容主体--操作项(确认/取消) */
        .modal_footer {
            display: flex;
            padding: 20px;
            justify-content: flex-end;

            /* 确认对话框 内容主体--所有按钮 */
            .btn {
                padding: 10px 20px;
                border: none;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                border-radius: 5px;
                outline: none;
            }

            /* 确认对话框 内容主体--取消按钮 */
            .cancel_btn {
                margin-right: 10px;
                background-color: rgba($color: #e74c3c, $alpha: 0.7);
                color: #fff;
                transition: all 0.15s;
                &:hover {
                    background-color: rgba($color: #e74c3c, $alpha: 1);
                }
            }

            /* 确认对话框 内容主体--确认按钮 */
            .confirm_btn {
                background-color: rgba($color: #45b8cc, $alpha: 0.7);
                color: #fff;
                transition: all 0.15s;
                &:hover {
                    background-color: rgba($color: #45b8cc, $alpha: 1);
                }
            }
        }
    }
}
</style>
