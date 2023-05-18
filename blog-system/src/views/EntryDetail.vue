<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-10 20:45:12
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 17:56:56
 * @Description: 博客详情页面
-->
<template>
    <!-- S 博客详情 -->
    <div class="detail_block">
        <div class="content">
            <!-- 博客标题 -->
            <div class="content_header">
                <div class="content_title">
                    <span>{{ entry.title }}</span>
                </div>
                <div class="content_author">
                    <img
                        class="author_avatar"
                        :src="user.avatar"
                        alt="作者头像"
                    />
                    <div class="entry_info">
                        <div class="author_nickname">{{ user.nickname }}</div>
                        <span class="entry_date">{{
                            dateTime(entry.updateTime)
                        }}</span>
                        <span class="entry_browse"
                            >浏览 {{ entry.browseCount }} 次</span
                        >
                    </div>
                </div>
            </div>
            <!-- 博客封面 -->
            <div class="content_figure" v-if="entry.picture">
                <img :src="entry.picture" alt="博文图片" />
            </div>
            <!-- 博客内容 -->
            <v-md-editor
                :model-value="entry.content"
                :default-show-toc="true"
                :toc-nav-position-right="true"
                :include-level="[2, 3, 4]"
                mode="preview"
            ></v-md-editor>
            <!-- 评论发布区 -->
            <div id="comment" class="comment_form">
                <div class="comment_title">评论</div>
                <div class="comment_content">
                    <img
                        class="comment_avatar"
                        :src="avatar(userId)"
                        alt="当前用户头像"
                    />
                    <textarea
                        class="comment_main"
                        placeholder="善语结善缘，恶言伤人心"
                        ref="comment"
                    ></textarea>
                </div>
                <div class="submit_btn" @click="submitComment">发表评论</div>
            </div>
            <!-- 评论区标题 -->
            <div class="comment_title" v-show="commentCount">
                全部评论 {{ commentCount }}
            </div>
            <div
                class="comment_list"
                v-for="(comment, index) in commentList"
                :key="comment.id"
            >
                <!-- 一级评论-头像 -->
                <img
                    class="comment_avatar"
                    :src="avatar(comment.userId)"
                    alt="评论头像"
                />
                <!-- 一级评论-评论项 -->
                <div class="comment_item">
                    <!-- 评论主体 -->
                    <div
                        class="comment_main"
                        @mouseenter="showDeleteBtn(index, comment.userId)"
                        @mouseleave="hideDeleteBtn(index)"
                    >
                        <!-- 评论者昵称 -->
                        <div class="user_nickname">
                            {{ nickname(comment.userId) }}
                        </div>
                        <!-- 评论内容 -->
                        <div class="comment">{{ comment.content }}</div>
                        <!-- 评论时间 -->
                        <div class="comment_time">
                            {{ commentTime(comment.createTime) }}
                        </div>
                        <!-- 评论操作按钮(回复/删除) -->
                        <div class="operate_btn">
                            <span
                                class="action_btn"
                                @click="toggleShowReplyComment(index)"
                            >
                                <i class="iconfont icon-pinglun2"></i>
                                <span>回复</span>
                            </span>
                            <span
                                class="delete_comment_btn"
                                v-show="isShowDeleteBtn[index]"
                                @click="
                                    deleteComment(comment.id, comment.userId)
                                "
                                >删除</span
                            >
                        </div>
                        <!-- 评论回复框 -->
                        <div
                            class="reply_comment_content"
                            v-show="isShowReplyComment[index]"
                        >
                            <textarea
                                class="reply_comment_main"
                                :placeholder="nickname(comment.userId, true)"
                                ref="replyComment"
                            ></textarea>
                        </div>
                        <!-- 发布评论按钮 -->
                        <div
                            class="reply_submit_btn"
                            v-show="isShowReplyComment[index]"
                            @click="
                                submitReplyComment(
                                    index,
                                    comment.id,
                                    comment.userId
                                )
                            "
                        >
                            发布
                        </div>
                    </div>
                    <!-- 二级评论 -->
                    <div
                        class="sub_comment_list"
                        v-for="(item, subIndex) in comment.children"
                        :key="item.id"
                    >
                        <!-- 二级评论-头像 -->
                        <img
                            class="sub_comment_avatar"
                            :src="avatar(item.userId)"
                            alt="评论头像"
                        />
                        <!-- 二级评论主体 -->
                        <div
                            class="sub_comment_main"
                            @mouseenter="
                                showSubDeleteBtn(index, subIndex, item.userId)
                            "
                            @mouseleave="hideSubDeleteBtn(index, subIndex)"
                        >
                            <!-- 评论者昵称 -->
                            <div class="user_nickname">
                                {{ nickname(item.userId) }} 回复
                                {{ nickname(item.replyUserId) }}
                            </div>
                            <!-- 评论内容 -->
                            <div class="comment">{{ item.content }}</div>
                            <!-- 评论时间 -->
                            <div class="comment_time">
                                {{ commentTime(item.createTime) }}
                            </div>
                            <!-- 评论操作按钮(回复/删除) -->
                            <div class="sub_operate_btn">
                                <span
                                    class="sub_action_btn"
                                    @click="
                                        toggleSubShowReplyComment(
                                            index,
                                            subIndex
                                        )
                                    "
                                >
                                    <i class="iconfont icon-pinglun2"></i>
                                    <span>回复</span>
                                </span>
                                <span
                                    class="delete_comment_btn"
                                    v-show="isShowSubDeleteBtn[index][subIndex]"
                                    @click="deleteComment(item.id, item.userId)"
                                    >删除</span
                                >
                            </div>
                            <!-- 评论回复框 -->
                            <div
                                class="reply_sub_comment_content"
                                v-show="isShowSubReplyComment[index][subIndex]"
                            >
                                <textarea
                                    class="reply_sub_comment_main"
                                    :placeholder="nickname(item.userId, true)"
                                    :ref="subReplyComment[index]"
                                ></textarea>
                            </div>
                            <!-- 评论发布按钮 -->
                            <div
                                class="reply_sub_submit_btn"
                                v-show="isShowSubReplyComment[index][subIndex]"
                                @click="
                                    submitSubReplyComment(
                                        index,
                                        subIndex,
                                        comment.id,
                                        item.userId
                                    )
                                "
                            >
                                发布
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /评论列表 -->
        </div>
        <!-- /博客内容 -->
        <div class="aside">
            <!-- 博客作者相关 -->
            <div class="aside_top">
                <!-- 博客作者信息 -->
                <div class="author_info" @click="toUserPage(user.id)">
                    <img
                        class="author_avatar"
                        :src="user.avatar"
                        alt="作者头像"
                    />
                    <div
                        class="author_nickname"
                        :title="'查看 ' + user.nickname + ' 主页'"
                    >
                        {{ user.nickname }}
                    </div>
                </div>
                <!-- 关注/已关注按钮 -->
                <div class="operate_btn" v-if="!isCurrentUser">
                    <div class="follow" v-show="!isFollowed" @click="addFollow">
                        <i class="iconfont"></i>
                        <span>关注</span>
                    </div>
                    <div class="followed" v-show="isFollowed" @click="unFollow">
                        <i class="iconfont"></i>
                        <span>已关注</span>
                    </div>
                </div>
                <!-- 作者关注粉丝数量 -->
                <div class="follow_block">
                    <div
                        class="follow_item"
                        :title="'查看 ' + user.nickname + ' 关注列表'"
                        @click="toUserFollowList(user.id)"
                    >
                        <span>关注</span>
                        <span>{{ followList.length }}</span>
                    </div>
                    <div
                        class="follow_item"
                        :title="'查看 ' + user.nickname + ' 粉丝列表'"
                        @click="toUserFansList(user.id)"
                    >
                        <span>粉丝</span>
                        <span>{{ fansCount(fansList.length) }}</span>
                    </div>
                </div>
                <!-- 博客三连按钮 -->
                <div class="operate_list">
                    <div class="operate_item" @click="likeEntry">
                        <i
                            class="iconfont icon-dianzan_kuai"
                            v-show="!likeState"
                        ></i>
                        <i
                            class="iconfont icon-dianzan_kuai"
                            v-show="likeState"
                        ></i>
                        <span class="like_count" v-show="likeState">{{
                            likeCount(entry.likeCount)
                        }}</span>
                        <span class="like_count" v-show="!likeState">{{
                            likeCount(entry.likeCount)
                        }}</span>
                    </div>
                    <a href="#comment" class="operate_item">
                        <i class="iconfont icon-pinglun1"></i>
                        <span class="comment_count">{{ commentCount }}</span>
                    </a>
                    <div class="operate_item" @click="collectEntry">
                        <i
                            class="iconfont icon-shoucangxiao"
                            v-show="!collectState"
                        ></i>
                        <i
                            class="iconfont icon-shoucangxiao"
                            v-show="collectState"
                        ></i>
                        <span class="collect_count" v-show="collectState">{{
                            collectCount(entry.collectCount)
                        }}</span>
                        <span class="collect_count" v-show="!collectState">{{
                            collectCount(entry.collectCount)
                        }}</span>
                    </div>
                </div>
            </div>
            <!-- 博客目录导航 -->
            <div class="aside_mid">
                <div class="toc" :class="isFixed ? 'fixed' : ''">
                    <div class="toc_title">目录导航</div>
                    <div class="toc_list" ref="tocElement"></div>
                </div>
            </div>
        </div>
        <!-- /侧边栏 -->
    </div>
    <!-- E 博客详情 -->
</template>

<script>
import {
    reactive,
    toRefs,
    onMounted,
    ref,
    computed,
    onUnmounted,
    watch,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import http from '@/utils/http'
import date from '@/utils/dateFormatter'
export default {
    setup(_, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const data = reactive({
            /* 博客信息 */
            entry: {},
            /* 发布该博客的用户信息 */
            user: {},
            /* 评论框的 placeholder */
            comment_placeholder: '善语结善缘，恶言伤人心',
            /* 当前文章 id */
            id: route.params.id,
            /* 当前登录的用户id */
            userId: store.state.userId,
            /**
             * 当前文章点赞状态
             * false 没有点赞
             * true  已经点赞
             */
            likeState: false,
            /**
             * 当前文章收藏状态
             * false 没有点赞
             * true  已经点赞
             */
            collectState: false,
            /* 粉丝列表 */
            fansList: {},
            /* 关注列表 */
            followList: {},
            /* 文章评论列表 */
            commentList: {},
            /* 评论用户信息 */
            userCache: {},
            /* 评论数 */
            commentCount: 0,
            /**
             * 是否是当前用户
             * true  是当前用户(不展示关注/关注)
             * false 不是当前用户(展示关注/已关注)
             */
            isCurrentUser: false,
            /**
             * 当前用户对于访问用户的关注状态
             * true  已经关注
             * false 没有关注
             */
            isFollowed: false,
            /**
             * 是否显示一级回复评论框
             * true  显示
             * false 不显示
             */
            isShowReplyComment: [],
            /**
             * 是否显示二级回复评论框
             * true  显示
             * false 不显示
             */
            isShowSubReplyComment: [],
            /**
             * 是否显示一级评论删除按钮
             * true  显示
             * false 不显示
             */
            isShowDeleteBtn: [],
            /**
             * 是否显示二级评论删除按钮
             * true  显示
             * false 不显示
             */
            isShowSubDeleteBtn: [],
            /* 定时器引用 */
            timeId: null,
            /**
             * 是否显示目录导航栏
             * true  显示
             * false 不显示
             */
            isFixed: false,
            /* 评论定时器引用 */
            commentTimer: null,
        })

        /* DOM 评论输入框 */
        const comment = ref('')
        /* DOM 一级评论回复框 */
        const replyComment = ref('')
        /* DOM 二级评论回复框 */
        let subReplyComment = []
        /* DOM 目录导航栏 */
        let tocElement = ref(null)

        onMounted(() => {
            window.addEventListener('scroll', handleScroll)
            // 获取文章的相关信息
            http.all([
                getEntryDetail(data.id),
                getLikeState(data.id, data.userId),
                getCollectState(data.id, data.userId),
                getCommentList(data.id),
            ]).then(res => {
                if (res[0].data.code === 20041) {
                    data.entry = res[0].data.data
                    // 判断文章作者是否为当前登录用户
                    if (data.entry.authorId === data.userId) {
                        data.isCurrentUser = true
                    }
                    // 获取到文章相关信息，再通过作者id 获取其相关信息
                    http.all([
                        getUserInfo(data.entry.authorId),
                        getFollowState(data.entry.authorId),
                        getFansList(data.entry.authorId),
                        getFollowList(data.entry.authorId),
                        getEntryLikeCount(data.id),
                        getEntryCollectCount(data.id),
                    ]).then(res => {
                        if (res[0].data.code === 20041) {
                            data.user = res[0].data.data
                        }
                        if (res[1].data.code === 20041) {
                            data.isFollowed = res[1].data.data
                        }
                        if (res[2].data.code === 20041) {
                            data.fansList = res[2].data.data
                        }
                        if (res[3].data.code === 20041) {
                            data.followList = res[3].data.data
                        }
                        if (res[4].data.code === 20041) {
                            data.entry.likeCount = res[4].data.data
                        }
                        if (res[5].data.code === 20041) {
                            data.entry.collectCount = res[5].data.data
                        }
                    })
                }
                if (res[1].data.code === 20041) {
                    data.likeState = res[1].data.data
                }
                if (res[2].data.code === 20041) {
                    data.collectState = res[2].data.data
                }
                if (res[3].data.code === 20041) {
                    commentFilter(res[3].data.data)
                }
            })
            // 10秒后文章浏览次数加1
            data.timeId = setTimeout(() => {
                data.entry.browseCount++
                updateEntry()
            }, 10000)
        })

        onUnmounted(() => {
            // 清除增加浏览次数的定时器(在当前页面没有停留10s则不会增加浏览次数)
            data.timeId && clearTimeout(data.timeId)
            // 清除 window.scroll 事件
            window.addEventListener('scroll', handleScroll)
        })

        /* watch 文章内容改变 */
        watch(
            () => data.entry.content,
            () => {
                let toc = document.querySelector(
                    '#app > div.detail_block > div.content > div.v-md-editor.v-md-editor--preview.v-md-editor--left-area-reverse > div.v-md-editor__left-area > div.v-md-editor__left-area-body > div > div.scrollbar__wrap > div > ul'
                )
                tocElement.value.appendChild(toc)
            }
        )

        /* computed 博客更新时间 */
        const dateTime = computed(() => {
            return item => {
                return date.dateTimeFormatter(item)
            }
        })
        const commentTime = computed(() => {
            return item => {
                return date.dateFormatter(item)
            }
        })
        /* computed 博客点赞次数 */
        const likeCount = computed(() => {
            return likeCount => {
                return likeCount
            }
        })
        /* computed 博客收藏次数 */
        const collectCount = computed(() => {
            return collectCount => {
                return collectCount
            }
        })
        /* computed 作者粉丝数 */
        const fansCount = computed(() => {
            return fansCount => {
                return fansCount
            }
        })
        /* computed 评论者昵称 */
        const nickname = computed(() => {
            return (userId, flag) => {
                // 如果评论者昵称存在，直接返回数据
                if (data.userCache[userId]) {
                    if (flag) {
                        return '回复' + data.userCache[userId].nickname
                    }
                    return data.userCache[userId].nickname
                }
                // 如果评论者昵称不存在，向后端发送请求，暂时返回 ''
                getUserInfo(userId).then(res => {
                    if (res.data.code === 20041) {
                        data.userCache[userId] = {
                            nickname: res.data.data.nickname,
                            avatar: res.data.data.avatar,
                        }
                    }
                })
                return ''
            }
        })
        /* computed 评论者头像 */
        const avatar = computed(() => {
            return userId => {
                // 如果评论者头像存在，直接返回数据
                if (data.userCache[userId]) {
                    return data.userCache[userId].avatar
                }
                // 如果评论者头像不存在，向后端发送请求，暂时返回 ''
                getUserInfo(userId).then(res => {
                    if (res.data.code === 20041) {
                        data.userCache[userId] = {
                            nickname: res.data.data.nickname,
                            avatar: res.data.data.avatar,
                        }
                    }
                })
                return ''
            }
        })

        /* 显示消息框 */
        const showMessageBox = args => {
            emit('showMessageBox', {
                message: args.message,
                type: args.type,
            })
        }

        /* filter 评论过滤 */
        const commentFilter = comments => {
            // 更新博客信息
            data.entry.commentCount = comments.length
            updateEntry()
            const commentList = []
            // 遍历所有评论数据，分出 一级评论 和 二级评论
            comments.forEach(item => {
                // 给每条数据添加 children
                item.children = []
                if (item.parentId !== null) {
                    // 二级评论
                    commentList.forEach(comment => {
                        // 证明是二级评论
                        if (comment.id === item.parentId) {
                            comment.children.push(item)
                        }
                    })
                } else {
                    // 一级评论
                    commentList.push(item)
                    subReplyComment.push(ref(''))
                }
            })

            // 因为每次再 onMounted、发表评论、回复评论都会调用 subReplyComment.push(ref(''))
            // 但是并不需要如此多的 ref 对象，只需要保证 subReplyComment.length == commentList.length 即可
            while (subReplyComment.length > commentList.length) {
                // 删除掉多余的 ref 对象
                subReplyComment.pop()
            }

            data.commentCount = comments.length
            // 将原有的控制 一级/二级 回复评论框的数据清空
            data.isShowReplyComment = []
            data.isShowSubReplyComment = []
            // 将原有的控制 一级/二级 评论删除按钮的数据清空
            data.isShowDeleteBtn = []
            data.isShowSubDeleteBtn = []
            for (let i = 0; i < commentList.length; i++) {
                // 根据一级评论的条数 生成 控制一级评论回复框是否显示的数组
                data.isShowReplyComment.push(false)
                // 根据一级评论的条数 生成 控制一级评论删除按钮显示状态的数组
                data.isShowDeleteBtn.push(false)
                // 根据一级评论中二级评论的条数 生成 一个控制 二级评论回复框是否显示 和 二级评论删除按钮显示状态的 数组
                let temp = []
                for (let j = 0; j < commentList[i].children.length; j++) {
                    temp.push(false)
                }
                data.isShowSubReplyComment.push([...temp])
                data.isShowSubDeleteBtn.push([...temp])
            }
            data.commentList = commentList
        }

        /* scroll 屏幕滚动事件 */
        const handleScroll = () => {
            // 判断屏幕的滚动距离
            if (document.documentElement.scrollTop > 430) {
                // 给目录导航栏添加 CSS 样式
                data.isFixed = true
            } else {
                // 给目录导航栏移除 CSS 样式
                data.isFixed = false
            }
        }

        /* mouseenter 一级评论 */
        const showDeleteBtn = (index, commentUserId) => {
            if (data.userId === commentUserId) {
                data.isShowDeleteBtn[index] = true
            }
        }
        /* mouseenter 二级评论 */
        const showSubDeleteBtn = (index, subIndex, commentUserId) => {
            if (data.userId === commentUserId) {
                data.isShowSubDeleteBtn[index][subIndex] = true
            }
        }

        /* mouseleave 一级评论 */
        const hideDeleteBtn = index => {
            data.isShowDeleteBtn[index] = false
        }
        /* mouseleave 二级评论 */
        const hideSubDeleteBtn = (index, subIndex) => {
            data.isShowSubDeleteBtn[index][subIndex] = false
        }

        /* click 侧边栏点赞 */
        const likeEntry = () => {
            // 判断文章点赞状态
            if (data.likeState) {
                // 已经点赞 取消点赞
                unLike(data.id, data.userId).then(res => {
                    if (res.data.code === 20021) {
                        // 修改文章的点赞状态
                        data.likeState = false
                        showMessageBox({
                            message: '取消点赞成功',
                            type: 'success',
                        })
                        // 获取文章点赞数量
                        getEntryLikeCount(data.id).then(res => {
                            if (res.data.code === 20041) {
                                data.entry.likeCount = res.data.data
                            }
                        })
                    } else {
                        showMessageBox({
                            message: '取消点赞失败',
                            type: 'error',
                        })
                    }
                })
            } else {
                // 没有点赞 点赞文章
                addLike(data.id, data.userId).then(res => {
                    if (res.data.code === 20011) {
                        // 修改文章的点赞状态
                        data.likeState = true
                        showMessageBox({
                            message: '点赞文章成功',
                            type: 'success',
                        })
                        // 获取文章点赞数量
                        getEntryLikeCount(data.id).then(res => {
                            if (res.data.code === 20041) {
                                data.entry.likeCount = res.data.data
                            }
                        })
                    } else {
                        showMessageBox({
                            message: '点赞文章失败',
                            type: 'error',
                        })
                    }
                })
            }
        }
        /* click 侧边栏评论 */
        const commentEntry = () => {
            console.log('点击了评论，跳转到文章的评论区')
        }
        /* click 侧边栏收藏 */
        const collectEntry = () => {
            if (data.collectState) {
                // 已经点赞 取消点赞
                unCollect(data.id, data.userId).then(res => {
                    if (res.data.code === 20021) {
                        // 修改文章的点赞状态
                        data.collectState = false
                        // 获取文章收藏数量
                        getEntryCollectCount(data.id).then(res => {
                            if (res.data.code === 20041) {
                                data.entry.collectCount = res.data.data
                            }
                        })
                        showMessageBox({
                            message: '取消收藏成功',
                            type: 'success',
                        })
                    } else {
                        showMessageBox({
                            message: '取消收藏失败',
                            type: 'error',
                        })
                    }
                })
            } else {
                // 没有点赞 点赞文章
                addCollect(data.id, data.userId).then(res => {
                    if (res.data.code === 20011) {
                        // 修改文章的点赞状态
                        data.collectState = true
                        showMessageBox({
                            message: '收藏文章成功',
                            type: 'success',
                        })
                        // 获取文章收藏数量
                        getEntryCollectCount(data.id).then(res => {
                            if (res.data.code === 20041) {
                                data.entry.collectCount = res.data.data
                            }
                        })
                    } else {
                        showMessageBox({
                            message: '收藏文章失败',
                            type: 'error',
                        })
                    }
                })
            }
        }
        /* click 发表评论 */
        const submitComment = () => {
            // comment.value.value  -->  获取 评论框中的内容
            const content = comment.value.value
            // 判断评论长度
            if (content.length === 0) {
                showMessageBox({ message: '评论不能为空', type: 'warning' })
                return
            }
            if (content.length >= 255) {
                showMessageBox({
                    message: '评论不能超过255字符',
                    type: 'warning',
                })
                return
            }
            // 获取当前时间戳
            const createTime = Number.parseInt(new Date().getTime() / 1000)
            addComment(content, createTime).then(res => {
                if (res.data.code === 20011) {
                    showMessageBox({ message: '发表评论成功', type: 'success' })
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                    // 清空评论框中的数据
                    comment.value.value = ''
                } else {
                    showMessageBox({ message: '发表评论失败', type: 'error' })
                }
            })
        }
        /* click 一级评论回复的发布按钮 */
        const submitReplyComment = (index, parentId, replyUserId) => {
            const content = replyComment.value[index].value
            // 判断评论长度
            if (content.length === 0) {
                showMessageBox({ message: '评论不能为空', type: 'warning' })
                return
            }
            if (content.length >= 255) {
                showMessageBox({
                    message: '评论不能超过255字符',
                    type: 'warning',
                })
                return
            }
            // 获取当前时间戳
            const createTime = Number.parseInt(new Date().getTime() / 1000)
            addComment(content, createTime, parentId, replyUserId).then(res => {
                if (res.data.code === 20011) {
                    showMessageBox({ message: '回复评论成功', type: 'success' })
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                    // 清空评论框中的数据
                    replyComment.value[index].value = ''
                    // 设置 placeholder
                    replyComment.value[index].setAttribute(
                        'placeholder',
                        '回复' + data.userCache[replyUserId].nickname
                    )
                    // 关闭当前评论框
                    data.isShowReplyComment[index] = false
                } else {
                    showMessageBox({ message: '回复评论失败', type: 'error' })
                }
            })
        }
        /* click 二级评论回复的发布按钮 */
        const submitSubReplyComment = (
            index,
            subIndex,
            parentId,
            replyUserId
        ) => {
            const content = subReplyComment[index].value[subIndex].value
            // 判断评论长度
            if (content.length === 0) {
                showMessageBox({ message: '评论不能为空', type: 'warning' })
                return
            }
            if (content.length >= 255) {
                showMessageBox({
                    message: '评论不能超过255字符',
                    type: 'warning',
                })
                return
            }
            // 获取当前时间戳
            const createTime = Number.parseInt(new Date().getTime() / 1000)
            addComment(content, createTime, parentId, replyUserId).then(res => {
                if (res.data.code === 20011) {
                    showMessageBox({ message: '回复评论成功', type: 'success' })
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                    // 清空评论框中的数据
                    subReplyComment[index].value[subIndex].value = ''
                    // 设置 placeholder
                    subReplyComment[index].value[subIndex].setAttribute(
                        'placeholder',
                        '回复' + data.userCache[replyUserId].nickname
                    )
                    // 关闭当前评论框
                    data.isShowSubReplyComment[index][subIndex] = false
                } else {
                    showMessageBox({ message: '回复评论失败', type: 'error' })
                }
            })
        }
        /* click 关注 */
        const addFollow = () => {
            addFollowInfo(data.user.id, data.userId).then(res => {
                if (res.data.code === 20011) {
                    showMessageBox({ message: '关注用户成功', type: 'success' })
                    data.isFollowed = true
                    data.fansList.length++
                } else {
                    showMessageBox({ message: '关注用户失败', type: 'error' })
                }
            })
        }
        /* click 已关注 */
        const unFollow = () => {
            deleteFollowInfo(data.user.id, data.userId).then(res => {
                if (res.data.code === 20021) {
                    showMessageBox({ message: '取消关注成功', type: 'success' })
                    data.isFollowed = false
                    data.fansList.length--
                } else {
                    showMessageBox({ message: '取消关注失败', type: 'error' })
                }
            })
        }
        /* click 侧边栏头像昵称 */
        const toUserPage = userId => {
            router.push(`/center/${userId}`)
        }
        /* click 作者粉丝数 */
        const toUserFansList = userId => {
            router.push(`/center/${userId}/fans`)
        }
        /* click 作者关注数 */
        const toUserFollowList = userId => {
            router.push(`/center/${userId}/follow`)
        }
        /* click 一级评论下的回复按钮 */
        const toggleShowReplyComment = index => {
            // 切换该条评论回复框是否显示
            data.isShowReplyComment[index] = data.isShowReplyComment[index]
                ? false
                : true
        }
        /* click 二级评论下的回复按钮 */
        const toggleSubShowReplyComment = (index, subIndex) => {
            // 切换该条评论回复框是否显示
            data.isShowSubReplyComment[index][subIndex] = data
                .isShowSubReplyComment[index][subIndex]
                ? false
                : true
        }
        /* click 评论右下角的删除按钮 */
        const deleteComment = (commentId, commentUserId) => {
            // 判断当前用户id 是否等于 评论发布用户id
            if (data.userId !== commentUserId) {
                showMessageBox({
                    message: '请不要删除别人的评论，前端何苦为难前端',
                    type: 'warning',
                })
                return
            }
            // 删除评论
            deleteCommentInfo(commentId).then(res => {
                if (res.data.code === 20021) {
                    showMessageBox({ message: '删除评论成功', type: 'success' })
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                } else {
                    showMessageBox({ message: '删除评论失败', type: 'error' })
                }
            })
        }

        /* http 获取博文信息 */
        const getEntryDetail = entryId => {
            return http.get(`/blogs/${entryId}`)
        }
        /* http 获取评论列表 */
        const getCommentList = entryId => {
            return http.get(`/comments/${entryId}`)
        }
        /* http 获取点赞状态 */
        const getLikeState = (entryId, loginUserId) => {
            return http.get(`/likes/${entryId}/${loginUserId}`)
        }
        /* http 获取收藏状态 */
        const getCollectState = (entryId, loginUserId) => {
            return http.get(`/collects/${entryId}/${loginUserId}`)
        }
        /* http 获取当前登录用户是否关注展示用户 */
        const getFollowState = userId => {
            return http.get(`/follows/state/${userId}/${data.userId}`)
        }
        /* http 获取用户的昵称和头像 */
        const getUserInfo = userId => {
            return http.get(`/users/${userId}`)
        }
        /* http 获取当前展示用户的粉丝列表 */
        const getFansList = userId => {
            return http.get(`/follows/fans/${userId}`)
        }
        /* http 获取当前展示用户的关注列表 */
        const getFollowList = userId => {
            return http.get(`/follows/follow/${userId}`)
        }
        /* http 获取文章的点赞数量 */
        const getEntryLikeCount = entryId => {
            return http.get(`/likes/count/${entryId}`)
        }
        /* http 获取文章的收藏数量 */
        const getEntryCollectCount = entryId => {
            return http.get(`/collects/count/${entryId}`)
        }
        /* http 点赞文章 */
        const addLike = (blogId, userId) => {
            return http.post('/likes', {
                blogId,
                userId,
            })
        }
        /* http 取消点赞 */
        const unLike = (entryId, loginUserId) => {
            return http.delete(`/likes/${entryId}/${loginUserId}`)
        }
        /* http 收藏文章 */
        const addCollect = (blogId, userId) => {
            return http.post('/collects', {
                blogId,
                userId,
            })
        }
        /* http 取消收藏 */
        const unCollect = (entryId, loginUserId) => {
            return http.delete(`/collects/${entryId}/${loginUserId}`)
        }
        /* http 更新文章 */
        const updateEntry = () => {
            return http.put(`/blogs`, data.entry)
        }
        /* http 添加关注 */
        const addFollowInfo = (followedUserId, followUserId) => {
            return http.post(`/follows`, {
                followedUserId,
                followUserId,
            })
        }
        /* http 取消关注 */
        const deleteFollowInfo = (followedUserId, followUserId) => {
            return http.delete(`/follows/${followedUserId}/${followUserId}`)
        }
        /* http 删除评论 */
        const deleteCommentInfo = commentId => {
            return http.delete(`/comments/${commentId}`)
        }
        /* http 发表评论 */
        const addComment = (
            content,
            createTime,
            parentId = null,
            replyUserId = null
        ) => {
            return http.post(`/comments`, {
                content,
                createTime,
                parentId,
                replyUserId,
                userId: data.userId,
                blogId: data.id,
            })
        }
        return {
            ...toRefs(data),
            comment,
            replyComment,
            subReplyComment,
            tocElement,
            dateTime,
            commentTime,
            likeCount,
            collectCount,
            fansCount,
            nickname,
            avatar,
            scroll,
            showDeleteBtn,
            showSubDeleteBtn,
            hideDeleteBtn,
            hideSubDeleteBtn,
            likeEntry,
            commentEntry,
            collectEntry,
            submitComment,
            submitReplyComment,
            submitSubReplyComment,
            addFollow,
            unFollow,
            toUserPage,
            toUserFansList,
            toUserFollowList,
            toggleShowReplyComment,
            toggleSubShowReplyComment,
            deleteComment,
        }
    },
}
</script>

<style lang="scss">
/* 代码块 */
pre {
    padding: 15px;
}

/* 目录固定样式 */
.fixed {
    position: fixed;
    top: 20px;
}

/* 导航栏 */
.toc {
    width: 250px;
    padding: 0 15px;
    background-color: #fff;

    /* 导航栏 标题 */
    .toc_title {
        height: 55px;
        border-bottom: 1px solid rgba($color: #62aec5, $alpha: 0.7);
        font-size: 18px;
        line-height: 55px;
    }

    /* 导航栏 列表 */
    .toc_list {
        overflow-x: hidden;
        overflow-y: auto;
        width: 260px;
        max-height: 418px;
        margin-top: 5px;

        /* 导航栏 列表--列表项 */
        .v-md-editor__toc-nav-item {
            font-size: 12px;
            transition: all 0.1s;
            &:hover {
                background-color: rgba($color: #62aec5, $alpha: 0.7);
                color: #fff;
            }
        }

        /* 滚动条宽度和颜色 */
        &::-webkit-scrollbar {
            width: 4px;
            height: 4px;
            background-color: #fff;
        }

        /* 滚动条滑块的样式 */
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba($color: #62aec5, $alpha: 0.6);
        }
    }
}
</style>

<style lang="scss" scoped="scoped">
/* 白色背景色 */
$bg_color: #fff;

/* 白色字体颜色 */
$color: #fff;

/* 天蓝色字体颜色 */
$sky_blue_color: skyblue;

/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 浅红色字体颜色 */
$light_red_color: salmon;

/* 灰色字体颜色 */
$gray_color: #8a919f;

/* 博客详情页面
----------------------------------------------------------------*/
.detail_block {
    display: flex;
    margin-top: 125px;
    opacity: 0.9;
}

/* 左边博客内容
----------------------------------------------------------------*/
.content {
    flex: 1;
    margin-right: 10px;
    padding: 30px 30px 0;
    background-color: $bg_color;
    font-size: 16px;

    /* 左边博客内容 页头 */
    .content_header {
        margin-bottom: 20px;

        /* 左边博客内容 页头--标题 */
        .content_title {
            height: 45px;
            margin-bottom: 15px;
            font-size: 25px;
            font-weight: 600;
            text-align: center;
            line-height: 45px;
        }

        /* 左边博客内容 页头--作者 */
        .content_author {
            display: flex;
            font-size: 15px;

            /* 左边博客内容 页头--作者(作者头像) */
            img {
                width: 45px;
                height: 45px;
                margin-right: 10px;
                border-radius: 50%;
            }

            /* 左边博客内容 页头--作者(作品发布时间) */
            .entry_date {
                margin-right: 15px;
            }
        }
    }

    /* 左边博客内容 展示图 */
    .content_figure {
        margin-bottom: 20px;
        padding-left: 20px;
        img {
            width: 780px;
            height: 450px;
        }
    }

    /* 左边博客内容 评论表单 */
    .comment_form {
        position: relative;
        margin-bottom: 35px;
        padding: 30px 0;

        /* 左边博客内容 评论表单--标题 */
        .comment_title {
            margin-bottom: 15px;
            font-size: 20px;
            font-weight: 600;
        }

        /* 左边博客内容 评论表单--内容 */
        .comment_content {
            display: flex;
            margin-bottom: 20px;

            /* 左边博客内容 评论表单--内容(当前用户头像) */
            img {
                width: 45px;
                height: 45px;
                margin-right: 20px;
                border-radius: 50%;
            }

            /* 左边博客内容 评论表单--内容(评论输入框) */
            .comment_main {
                width: 685px;
                min-height: 100px;
                padding: 10px 12px;
                border: none;
                background-color: #f7f8f9;
                font-family: '微软雅黑';
                font-size: 15px;
                border-radius: 5px;
                outline: none;
                resize: none;
                &:focus {
                    outline: 1px solid $sky_blue_color;
                }
                &::before {
                    content: attr(placeholder);
                    color: $gray_color;
                }
            }
        }

        /* 左边博客内容 评论表单--发表评论按钮 */
        .submit_btn {
            position: absolute;
            right: 45px;
            bottom: -10px;
            width: 120px;
            height: 40px;
            background-color: #1e80ff;
            color: $color;
            font-size: 13px;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            border-radius: 5px;
            opacity: 0.7;
            transition: all 0.3s;
            &:hover {
                opacity: 1;
            }
        }
    }

    /* 左边博客内容 评论列表标题 */
    .comment_title {
        margin-bottom: 25px;
        font-size: 20px;
        font-weight: 600;
    }

    /* 左边博客内容 评论列表 */
    .comment_list {
        display: flex;
        padding-bottom: 30px;

        /* 左边博客内容 评论列表--评论中所有字体图标 */
        .iconfont {
            margin-right: 3px;
        }

        /* 左边博客内容 评论列表--评论中所有用户昵称 */
        .user_nickname {
            font-size: 15px;
        }

        /* 左边博客内容 评论列表--评论中所有评论内容 */
        .comment {
            margin-top: 2px;
            margin-bottom: 2px;
            font-size: 14px;
        }

        /* 左边博客内容 评论内容-- */
        .operate_btn,
        .sub_operate_btn {
            display: flex;
            justify-content: space-between;

            /* 左边博客内容 评论列表--所有评论的回复按钮 */
            [class$='action_btn'] {
                cursor: pointer;
                &:hover {
                    color: $sky_blue_color;
                }
                .iconfont {
                    font-size: 15px;
                }
                span {
                    font-size: 14px;
                }
            }

            /* 左边博客内容 评论列表--一级评论删除按钮 */
            .delete_comment_btn {
                color: #f53f3f;
                font-size: 14px;
                line-height: 24px;
                cursor: pointer;
            }
        }

        /* 左边博客内容 评论列表--楼主头像 */
        img.comment_avatar {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 50%;
        }

        /* 左边博客内容 评论列表--楼主评论主体 */
        .comment_main {
            position: relative;
            width: 680px;
            margin-bottom: 15px;

            /* 左边博客内容 评论列表--楼主评论主体(回复评论框) */
            .reply_comment_main {
                display: block;
                width: 656px;
                height: 50px;
                margin-top: 5px;
                margin-bottom: 50px;
                padding: 10px 12px;
                border: none;
                background-color: #f7f8f9;
                font-family: '微软雅黑';
                font-size: 15px;
                border-radius: 5px;
                outline: none;
                resize: none;
                &:focus {
                    outline: 1px solid $sky_blue_color;
                }
                &::before {
                    content: attr(placeholder);
                    color: $gray_color;
                }
            }

            /* 左边博客内容 评论列表--楼主评论主体(评论回复发布按钮) */
            .reply_submit_btn {
                position: absolute;
                right: 0;
                bottom: -40px;
                width: 80px;
                height: 35px;
                background: #1e80ff;
                color: #fff;
                font-size: 14px;
                text-align: center;
                line-height: 35px;
                cursor: pointer;
                border-radius: 5px;
                opacity: 0.7;
                transition: all 0.3s;
                &:hover {
                    opacity: 1;
                }
            }

            /* 左边博客内容 评论列表--楼主评论主体(评论时间) */
            .comment_time {
                position: absolute;
                top: 0;
                right: 15px;
                color: #8a919f;
                font-size: 14px;
            }
        }

        /* 左边博客内容 评论列表--回复者列表 */
        .sub_comment_list {
            display: flex;
            position: relative;
            width: 654px;
            padding: 15px;
            background-color: #f1f2f5;

            /* 左边博客内容 评论列表--二级评论 */
            .sub_comment_main {
                position: relative;
                width: 620px;

                /* 左边博客内容 评论列表--二级评论时间 */
                .comment_time {
                    position: absolute;
                    top: 0;
                    right: 10px;
                    color: #8a919f;
                    font-size: 13px;
                }
            }

            /* 左边博客内容 评论列表--回复者列表(回复评论框) */
            .reply_sub_comment_main {
                display: block;
                width: 596px;
                height: 50px;
                margin-top: 5px;
                margin-bottom: 40px;
                padding: 10px 12px;
                border: none;
                background-color: #f7f8f9;
                font-family: '微软雅黑';
                font-size: 15px;
                border-radius: 5px;
                outline: none;
                resize: none;
                &:focus {
                    outline: 1px solid $sky_blue_color;
                }
                &::before {
                    content: attr(placeholder);
                    color: $gray_color;
                }
            }

            /* 左边博客内容 评论列表--回复者列表(评论回复发布按钮) */
            .reply_sub_submit_btn {
                position: absolute;
                right: 10px;
                bottom: 10px;
                width: 80px;
                height: 35px;
                background: #1e80ff;
                color: #fff;
                font-size: 14px;
                text-align: center;
                line-height: 35px;
                cursor: pointer;
                border-radius: 5px;
                opacity: 0.7;
                transition: all 0.3s;
                &:hover {
                    opacity: 1;
                }
            }

            /* 左边博客内容 评论列表--回复者列表(回复者头像) */
            img {
                width: 24px;
                height: 24px;
                margin-right: 10px;
                border-radius: 50%;
            }
        }
    }
}

/* 右边侧边栏
----------------------------------------------------------------*/
.aside {
    position: relative;
    width: 280px;
}

/* 右边作者相关
----------------------------------------------------------------*/
.aside_top {
    // position: fixed;
    // width: 240px;
    margin-bottom: 20px;
    padding: 25px 20px;
    background-color: $bg_color;

    /* 右边作者相关 作者信息 */
    .author_info {
        display: flex;
        height: 60px;
        margin-bottom: 10px;
        font-size: 17px;
        line-height: 60px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            color: #47acbe;
        }

        /* 右边作者相关 作者信息--作者头像 */
        img {
            width: 60px;
            height: 60px;
            margin-right: 10px;
            border-radius: 50%;
        }
    }

    /* 右边作者相关 关注/已关注按钮 */
    .operate_btn {
        display: flex;
        margin-bottom: 20px;
        justify-content: center;

        /* 右边作者相关 关注/已关注按钮--按钮项 */
        [class^='follow'] {
            width: 110px;
            height: 35px;
            font-size: 14px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            border-radius: 5px;

            /* 右边作者相关 关注按钮 */
            &:nth-child(1) {
                background-color: $sky_blue_color;
                color: $color;
            }

            /* 右边作者相关 已关注按钮 */
            &:nth-child(2) {
                background-color: #f2f3f5;
                color: $gray_color;
            }
        }
    }

    /* 右边作者相关 关注/粉丝数 */
    .follow_block {
        display: flex;
        height: 40px;
        padding: 10px 0;
        border-top: 1px solid $border_line;
        border-bottom: 1px solid $border_line;
        [class='follow_item'] {
            flex: 1;
            display: flex;
            font-size: 15px;
            text-align: center;
            cursor: pointer;
            flex-direction: column;
            justify-content: center;
            &:hover {
                color: $sky_blue_color;
            }
            &:first-child {
                border-right: 1px solid $border_line;
            }
        }
    }

    /* 右边作者相关 文章相关 */
    .operate_list {
        display: flex;
        height: 50px;
        padding: 20px 15px 0;
        border-top: 1px solid $border_line;
        justify-content: space-between;

        /* 右边作者相关 文章相关--操作项 */
        .operate_item {
            position: relative;
            width: 50px;
            height: 50px;
            background-color: #f3f3f3;
            text-align: center;
            cursor: pointer;
            border-radius: 50%;
            /* 去掉 hover 评论的下划线 */
            &:hover {
                text-decoration: none;
            }

            /* 右边作者相关 文章相关--操作项(点赞/评论/收藏-数量) */
            [class$='count'] {
                position: absolute;
                top: -5px;
                right: -15px;
                min-width: 21px;
                padding: 0 5px;
                color: $color;
                border-radius: 8px;
                &:nth-child(odd) {
                    background-color: $light_red_color;
                }
                &:nth-child(even) {
                    background-color: $gray_color;
                    &:hover {
                        background-color: $light_red_color;
                    }
                }
            }

            /* 右边作者相关 文章相关--操作项(字体图标) */
            .iconfont {
                font-size: 25px;
                line-height: 50px;
                &:nth-child(1) {
                    color: $gray_color;
                    &:hover {
                        color: $light_red_color;
                    }
                }
                &:nth-child(2) {
                    color: $light_red_color;
                }
            }
        }
    }
}
</style>
