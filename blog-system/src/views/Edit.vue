<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-20 22:00:29
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 01:28:52
 * @Description: 博客发布页面
-->
<template>
    <!-- S 博客发布 -->
    <div class="edit_wrap">
        <!-- 博客标题 -->
        <div class="edit_header">
            <div class="left_box">
                <input
                    type="text"
                    placeholder="请输入文章标题"
                    v-model.trim="entry.title"
                />
            </div>
            <div class="right_box">
                <div class="confirm_btn" @click="goBack">取消</div>
                <div class="confirm_btn" @click="dialogState = !dialogState">
                    {{ isPublish ? '发布' : '更新' }}
                </div>
            </div>
        </div>
        <!-- 博客内容 -->
        <v-md-editor
            v-model.lazy="entry.content"
            :height="height"
        ></v-md-editor>
        <!-- 博客分类与摘要 -->
        <div class="edit_dialog" v-show="dialogState">
            <div class="dialog_title">发布文章</div>
            <!-- 博客分类 -->
            <div class="entry_type">
                <span>选择分类：</span>
                <div
                    class="type_current"
                    @click="typeListState = !typeListState"
                >
                    <span>{{ entry.type }}</span>
                    <i class="iconfont icon-xiangxiajiantou"></i>
                </div>
                <ul
                    class="type_list"
                    v-show="typeListState"
                    @click="changeCurrentType"
                >
                    <li class="type_item" v-for="item in types" :key="item.id">
                        {{ item.type }}
                    </li>
                </ul>
            </div>
            <!-- 博客封面 -->
            <div class="entry_cover">
                <span>文章封面：</span>
                <input type="text" v-model.trim="entry.picture" />
            </div>
            <!-- 博客摘要 -->
            <div class="entry_abstract">
                <span>文章摘要：</span>
                <textarea
                    maxlength="150"
                    autocomplete="false"
                    rows="5"
                    v-model.trim="entry.blogAbstract"
                ></textarea>
            </div>
            <!-- 博客发布按钮 -->
            <div class="publish_btn">
                <div class="btn_item" @click="cancel">取消</div>
                <div v-show="isPublish" class="btn_item" @click="reConfirm">
                    发布
                </div>
                <div v-show="!isPublish" class="btn_item" @click="updateEntry">
                    更新
                </div>
            </div>
        </div>
    </div>
    <!-- E 博客发布 -->
</template>

<script>
import { onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import http from '@/utils/http'
export default {
    setup(_, { emit }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const data = reactive({
            /* 文章 */
            entry: {
                // 文章标题
                title: '',
                // 文章内容
                content: '',
                /* 文章摘要 */
                blogAbstract: '',
                // 文章类型
                type: '',
                // 文章首图地址
                picture: '',
                // 文章创建时间
                createTime: '',
                // 文章更新时间
                updateTime: '',
                // 文章作者 id
                authorId: '',
            },
            /* 所有文章类型 */
            types: [],
            /**
             * 文章是否为发布
             * true   发布
             * false  更新
             */
            isPublish: true,
            /* markdown编辑器的高度 */
            height: '0',
            /**
             * 是否显示对话框
             * false 不显示
             * true  显示
             */
            dialogState: false,
            /**
             * 是否显示分类列表
             * false 不显示
             * true  显示
             */
            typeListState: false,
            /* 定时器引用 */
            timeId: null,
        })

        onMounted(() => {
            // 隐藏页脚
            emit('changeFooterState', false)

            // 判断文章是否为修改
            if (route.params.id) {
                data.isPublish = false
                http.get('/blogs/' + route.params.id).then(res => {
                    data.entry = res.data.data
                    // 设置 markdown 编辑器的高度
                    data.height = window.innerHeight - 60 + 'px'
                })
            } else {
                // 设置 markdown 编辑器的高度
                data.height = window.innerHeight - 60 + 'px'
            }
            // 获取数据库中的所有 type 类型
            http.get('/types').then(res => {
                if (res.data.code === 20041) {
                    data.types = res.data.data
                }
            })
        })

        onUnmounted(() => {
            // 显示页脚
            emit('changeFooterState', true)
            // 清除定时器
            data.timeId && clearTimeout(data.timeId)
        })

        /* 显示消息框 */
        const showMessageBox = args => {
            emit('showMessageBox', {
                message: args.message,
                type: args.type,
            })
        }

        /**
         * 检查文章是否符合要求
         * @param entry
         * @return 对象(是否通过和提示信息)
         */
        const checkEntry = entry => {
            // 创建返回结果对象
            let obj = {
                isPass: false,
                msg: '',
            }
            // 判断文章标题是否为空
            if (entry.title == '') {
                obj.msg = '标题不能为空'
                return obj
            }
            // 判断文章内容是否为空
            if (entry.content == '') {
                obj.msg = '内容不能为空'
                return obj
            }
            // 判断是否选择文章类型
            if (entry.type == '') {
                obj.msg = '文章类型不能为空'
                return obj
            }
            // 判断文章摘要长度是否符合要求
            if (entry.blogAbstract === null) {
                obj.msg = '文章摘要字符不能低于35个字符'
                return obj
            } else if (entry.blogAbstract.length < 35) {
                obj.msg = '文章摘要字符不能低于35个字符'
                return obj
            }
            // 所有要求满足
            obj.isPass = true
            return obj
        }

        /* 浏览器窗口大小改变 */
        window.onresize = () => {
            data.height = window.innerHeight - 60 + 'px'
        }
        /* click 右上角取消 */
        const goBack = () => {
            router.back()
        }
        /* click 上传首图 */
        const unloadPicture = () => {
            console.log('点击了上传首图按钮')
        }
        /* click 分类列表项 */
        const changeCurrentType = e => {
            data.entry.type = e.target.innerText
            data.typeListState = false
        }
        /* click 取消 */
        const cancel = () => {
            data.dialogState = false
        }
        /* click 确定并发布 */
        const reConfirm = () => {
            let temp = checkEntry(data.entry)
            // 判断文章是否符合要求
            if (!temp.isPass) {
                // 文章不符合要求
                return showMessageBox({ message: temp.msg, type: 'warning' })
            }
            const date = Number.parseInt(new Date().getTime() / 1000)
            data.entry.createTime = date
            data.entry.updateTime = date
            addEntry(data.entry).then(res => {
                if (res.data.code === 20011) {
                    showMessageBox({ message: '发布成功', type: 'success' })
                    data.timeId = setTimeout(() => {
                        router.push('/userInfo/blogManage')
                    }, 1000)
                } else {
                    showMessageBox({ message: '发布失败', type: 'error' })
                }
            })
        }
        /* click 确定并更新 */
        const updateEntry = () => {
            let temp = checkEntry(data.entry)
            // 判断文章是否符合要求
            if (!temp.isPass) {
                // 文章不符合要求
                return showMessageBox({ message: temp.msg, type: 'warning' })
            }
            // 判断当前用户是否为文章作者
            if (store.state.userId !== data.entry.userId) {
                return showMessageBox({
                    message: '你不是文章作者，无权更新他人文章',
                    type: 'error',
                })
            }
            updateEntryInfo(data.entry).then(res => {
                if (res.data.code === 20031) {
                    showMessageBox({ message: '更新发布成功', type: 'success' })
                    data.timeId = setTimeout(() => {
                        router.push('/userInfo/blogManage')
                    }, 1000)
                } else {
                    showMessageBox({ message: '更新发布失败', type: 'error' })
                }
            })
        }

        /* http 新增博客 */
        const addEntry = entry => {
            return http.post(`/blogs`, entry)
        }
        /* http 更新博客 */
        const updateEntryInfo = entry => {
            return http.put(`/blogs`, entry)
        }
        return {
            ...toRefs(data),
            goBack,
            confirm,
            unloadPicture,
            changeCurrentType,
            cancel,
            reConfirm,
            updateEntry,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 博客发布页
----------------------------------------------------------------*/
.edit_wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* 页眉
----------------------------------------------------------------*/
.edit_header {
    display: flex;
    height: 60px;
    padding: 0 40px;
    justify-content: space-between;
    background-color: #fff;
    align-items: center;

    /* 页眉 标题框 */
    input {
        width: 900px;
        height: 60px;
        padding-left: 15px;
        border: none;
        font-size: 22px;
        outline: none;
    }

    /* 页眉 右边按钮 */
    .right_box {
        display: flex;

        /* 页眉 右边按钮项 */
        .confirm_btn {
            width: 80px;
            height: 35px;
            background-color: rgba($color: #1d7dfa, $alpha: 0.7);
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.2s;
            &:hover {
                background-color: rgba($color: #1d7dfa, $alpha: 1);
            }

            &:nth-child(1) {
                margin-right: 20px;
            }
        }
    }
}

/* 对话框
----------------------------------------------------------------*/
.edit_dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 470px;
    border: 1px solid #ddd;
    background-color: #fff;
    border-radius: 2px;
    font-size: 14px;
    box-shadow: 0 1px 2px #f1f1f1;
    z-index: 1;
    transform: translate(-50%, -50%);

    /* 对话框 标题 */
    .dialog_title {
        height: 60px;
        padding-left: 20px;
        border-bottom: 1px solid $border_line;
        font-size: 18px;
        line-height: 60px;
    }

    /* 对话框 文章类型 */
    .entry_type {
        display: flex;
        position: relative;
        height: 30px;
        padding: 20px 30px;
        line-height: 30px;

        /* 对话框 文章类型--当前选项 */
        .type_current {
            position: relative;
            width: 250px;
            height: 30px;
            padding-left: 10px;
            border: 1px solid #e5e6eb;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.3s;
            &:hover {
                border-color: skyblue;
            }

            /* 对话框 文章类型--当前选项(向下箭头) */
            .iconfont {
                position: absolute;
                top: 0;
                right: 10px;
                font-size: 12px;
            }
        }

        /* 对话框 文章类型--类型列表 */
        .type_list {
            position: absolute;
            left: 100px;
            bottom: -110px;
            overflow-x: hidden;
            overflow-y: scroll;
            width: 260px;
            height: 120px;
            border: 1px solid #e5e6eb;
            background-color: #fff;
            border-radius: 3px;
            z-index: 1;

            /* 对话框 文章类型--类型列表(列表项) */
            .type_item {
                height: 30px;
                padding-left: 10px;
                transition: all 0.25s;
                &:hover {
                    background-color: rgba($color: #62aec5, $alpha: 0.7);
                    color: #fff;
                }
            }
        }
    }

    /* 对话框 文章封面 */
    .entry_cover {
        display: flex;
        padding: 20px 30px;
        align-items: center;

        input {
            width: 250px;
            height: 30px;
            padding-left: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            outline: none;
            transition: all 0.3s;
            &:hover {
                border-color: skyblue;
            }
        }

        // /* 对话框 文章封面--上传封面按钮 */
        // .cover_btn {
        //     position: relative;
        //     width: 160px;
        //     height: 85px;
        //     border: 1px dashed #e5e6eb;
        //     background-color: #fafafa;
        //     color: #86909c;
        //     cursor: pointer;

        //     /* 对话框 文章封面--上传封面按钮(提示文字) */
        //     &::before {
        //         content: '上传首图';
        //         position: absolute;
        //         top: 45px;
        //         left: 45px;
        //         font-size: 15px;
        //     }

        //     /* 对话框 文章封面--上传封面按钮(+号) */
        //     .iconfont {
        //         position: absolute;
        //         top: 15px;
        //         left: 65px;
        //         font-size: 18px;
        //         font-weight: 600;
        //     }
        // }
    }

    /* 对话框 文章摘要 */
    .entry_abstract {
        display: flex;
        padding: 20px 30px;
        border-bottom: 1px solid $border_line;

        /* 对话框 文章摘要 文本域 */
        textarea {
            width: 318px;
            height: 130px;
            padding: 6px 10px;
            font-size: 14px;
            line-height: 18px;
            resize: none;
        }
    }

    /* 对话框 底部按钮 */
    .publish_btn {
        display: flex;
        padding: 15px;
        justify-content: center;

        /* 对话框 底部按钮项 */
        .btn_item {
            // width: 90px;
            // height: 30px;
            width: 80px;
            height: 35px;
            background-color: rgba($color: #1d7dfa, $alpha: 0.7);
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.2s;
            &:hover {
                background-color: rgba($color: #1d7dfa, $alpha: 1);
            }

            &:nth-child(1) {
                margin-right: 20px;
            }
        }
    }
}
</style>
