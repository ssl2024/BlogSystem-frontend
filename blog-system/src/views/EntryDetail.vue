<template>
    <div class="detail_block">
        <!-- 博客内容 -->
        <div class="content">
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
            <div class="content_figure">
                <img src="https://iph.href.lu/780x450" alt="博文图片" />
            </div>
            <div class="content_main" v-html="renderedMarkdown"></div>
            <div class="comment_form">
                <div class="comment_title">评论</div>
                <div class="comment_content">
                    <img
                        class="comment_avatar"
                        :src="avatar(userId)"
                        alt="当前用户头像"
                    />
                    <div
                        class="comment_main"
                        contenteditable="true"
                        :placeholder="comment_placeholder"
                        @input="inputComment"
                        ref="comment"
                    ></div>
                </div>
                <div
                    class="submit_btn"
                    @click="submitComment"
                    @keydown="submitComment"
                >
                    发表评论(Enter)
                </div>
            </div>
            <div class="comment_title" v-show="commentCount">
                全部评论 {{ commentCount }}
            </div>
            <div
                class="comment_list"
                v-for="(comment, index) in commentList"
                :key="comment.id"
            >
                <img
                    class="comment_avatar"
                    :src="avatar(comment.userId)"
                    alt="评论头像"
                />
                <div class="comment_item">
                    <!-- 一级评论 -->
                    <div
                        class="comment_main"
                        @mouseenter="showDeleteBtn(index, comment.userId)"
                        @mouseleave="hideDeleteBtn(index)"
                    >
                        <div class="user_nickname">
                            {{ nickname(comment.userId) }}
                        </div>
                        <div class="comment">{{ comment.content }}</div>
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
                        <div
                            class="reply_comment_content"
                            v-show="isShowReplyComment[index]"
                        >
                            <div
                                class="reply_comment_main"
                                contenteditable="true"
                                :placeholder="nickname(comment.userId, true)"
                                @input="
                                    inputReplyComment(comment.userId, index)
                                "
                                ref="replyComment"
                            ></div>
                        </div>
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
                        <img
                            class="sub_comment_avatar"
                            :src="avatar(item.userId)"
                            alt="评论头像"
                        />
                        <div
                            class="sub_comment_main"
                            @mouseenter="
                                showSubDeleteBtn(index, subIndex, item.userId)
                            "
                            @mouseleave="hideSubDeleteBtn(index, subIndex)"
                        >
                            <div class="user_nickname">
                                {{ nickname(item.userId) }} 回复
                                {{ nickname(item.replyUserId) }}
                            </div>
                            <div class="comment">{{ item.content }}</div>
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
                            <div
                                class="reply_sub_comment_content"
                                v-show="isShowSubReplyComment[index][subIndex]"
                            >
                                <div
                                    class="reply_sub_comment_main"
                                    contenteditable="true"
                                    :placeholder="nickname(item.userId, true)"
                                    @input="
                                        inputSubReplyComment(
                                            item.userId,
                                            index,
                                            subIndex
                                        )
                                    "
                                    :ref="subReplyComment[index]"
                                ></div>
                            </div>
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
        </div>
        <!-- 侧边栏 -->
        <div class="aside">
            <div class="aside_top">
                <div class="author_info" @click="toUserPage(user.id)">
                    <img
                        class="author_avatar"
                        :src="user.avatar"
                        alt="作者头像"
                    />
                    <div class="author_nickname">{{ user.nickname }}</div>
                </div>
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
                <div class="follow_block">
                    <div class="follow_item" @click="toUserFollowList(user.id)">
                        <span>关注</span>
                        <span>{{ followList.length }}</span>
                    </div>
                    <div class="follow_item" @click="toUserFansList(user.id)">
                        <span>粉丝</span>
                        <span>{{ fansCount(fansList.length) }}</span>
                    </div>
                </div>
                <div class="operate_list">
                    <div class="operate_item" @click="likeEntry">
                        <i class="iconfont icon-dianzan_kuai"></i>
                        <span class="like_count">{{
                            likeCount(entry.likeCount)
                        }}</span>
                    </div>
                    <div class="operate_item" @click="commentEntry">
                        <i class="iconfont icon-pinglun1"></i>
                        <span class="comment_count">{{ commentCount }}</span>
                    </div>
                    <div class="operate_item" @click="collectEntry">
                        <i class="iconfont icon-shoucangxiao"></i>
                        <span class="collect_count">{{
                            collectCount(entry.collectCount)
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import MarkdownIt from 'markdown-it'

import http from '@/utils/http'
import dateFormatter from '@/utils/dateFormatter'
export default {
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const renderedMarkdown = ref('')
        /* DOM 评论输入框 */
        const comment = ref('')
        /* DOM 一级评论回复框 */
        const replyComment = ref('')
        /* DOM 二级评论回复框 */
        let subReplyComment = []
        const md = new MarkdownIt()
        let timeId

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
        })

        onMounted(() => {
            // 获取文章的相关信息
            http.all([
                getEntryDetail(data.id),
                getLikeState(data.id, data.userId),
                getCollectState(data.id, data.userId),
                getCommentList(data.id),
            ]).then(res => {
                if (res[0].data.code === 20041) {
                    data.entry = res[0].data.data
                    renderedMarkdown.value = md.render(data.entry.content)
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
            timeId = setTimeout(() => {
                data.entry.browseCount++
                updateEntry()
            }, 10000)
        })

        onUnmounted(() => {
            // 清除增加浏览次数的定时器(在当前页面没有停留10s则不会增加浏览次数)
            clearTimeout(timeId)
        })

        /* computed 博客更新时间 */
        const dateTime = computed(() => {
            return item => {
                return dateFormatter(item)
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

        /* filter 评论过滤 */
        const commentFilter = comments => {
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

        /* input 评论输入框 */
        const inputComment = e => {
            // 是否显示评论框 placeholder
            data.comment_placeholder =
                e.target.innerText.length > 0 ? '' : '善语结善缘，恶言伤人心'
        }
        /* input 一级评论回复框 */
        const inputReplyComment = (userId, index) => {
            // 是否显示评论回复框 placeholder
            const placeholder =
                replyComment.value[index].innerText.length > 0
                    ? ''
                    : '回复' + data.userCache[userId].nickname
            replyComment.value[index].setAttribute('placeholder', placeholder)
        }
        /* input 二级评论回复框 */
        const inputSubReplyComment = (userId, index, subIndex) => {
            const placeholder =
                subReplyComment[index].value[subIndex].innerText.length > 0
                    ? ''
                    : '回复' + data.userCache[userId].nickname
            subReplyComment[index].value[subIndex].setAttribute(
                'placeholder',
                placeholder
            )
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
                        data.entry.likeCount--
                        alert('取消点赞成功')
                    } else {
                        alert('取消点赞失败')
                    }
                })
            } else {
                // 没有点赞 点赞文章
                addLike(data.id, data.userId).then(res => {
                    if (res.data.code === 20011) {
                        // 修改文章的点赞状态
                        data.likeState = true
                        data.entry.likeCount++
                        alert('点赞文章成功')
                    } else {
                        alert('点赞文章失败')
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
                        data.entry.collectCount--
                        alert('取消收藏成功')
                    } else {
                        alert('取消收藏失败')
                    }
                })
            } else {
                // 没有点赞 点赞文章
                addCollect(data.id, data.userId).then(res => {
                    if (res.data.code === 20011) {
                        // 修改文章的点赞状态
                        data.collectState = true
                        data.entry.collectCount++
                        alert('收藏文章成功')
                    } else {
                        alert('收藏文章失败')
                    }
                })
            }
        }
        /* click 发表评论 */
        const submitComment = () => {
            // comment.value.innerText  -->  获取 评论框中的内容
            const content = comment.value.innerText
            // 判断评论长度
            if (content.length === 0) {
                alert('评论不能为空')
                return
            }
            if (content.length >= 255) {
                alert('评论不能超过255字符')
                return
            }
            // 获取当前时间戳
            const createTime = Number.parseInt(new Date().getTime() / 1000)
            addComment(content, createTime).then(res => {
                if (res.data.code === 20011) {
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                    // 清空评论框中的数据
                    comment.value.innerText = ''
                }
            })
        }
        /* click 一级评论回复的发布按钮 */
        const submitReplyComment = (index, parentId, replyUserId) => {
            const content = replyComment.value[index].innerText
            // 判断评论长度
            if (content.length === 0) {
                alert('评论不能为空')
                return
            }
            if (content.length >= 255) {
                alert('评论不能超过255字符')
                return
            }
            // 获取当前时间戳
            const createTime = Number.parseInt(new Date().getTime() / 1000)
            addComment(content, createTime, parentId, replyUserId).then(res => {
                if (res.data.code === 20011) {
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                    // 清空评论框中的数据
                    replyComment.value[index].innerText = ''
                    // 设置 placeholder
                    replyComment.value[index].setAttribute(
                        'placeholder',
                        '回复' + data.userCache[replyUserId].nickname
                    )
                    // 关闭当前评论框
                    data.isShowReplyComment[index] = false
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
            const content = subReplyComment[index].value[subIndex].innerText
            // 判断评论长度
            if (content.length === 0) {
                alert('评论不能为空')
                return
            }
            if (content.length >= 255) {
                alert('评论不能超过255字符')
                return
            }
            // 获取当前时间戳
            const createTime = Number.parseInt(new Date().getTime() / 1000)
            addComment(content, createTime, parentId, replyUserId).then(res => {
                if (res.data.code === 20011) {
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
                    // 清空评论框中的数据
                    subReplyComment[index].value[subIndex].innerText = ''
                    // 设置 placeholder
                    subReplyComment[index].value[subIndex].setAttribute(
                        'placeholder',
                        '回复' + data.userCache[replyUserId].nickname
                    )
                    // 关闭当前评论框
                    data.isShowSubReplyComment[index][subIndex] = false
                }
            })
        }
        /* click 关注 */
        const addFollow = () => {
            addFollowInfo(data.user.id, data.userId).then(res => {
                if (res.data.code === 20011) {
                    data.isFollowed = true
                    data.fansList.length++
                } else {
                    alert('关注用户失败')
                }
            })
        }
        /* click 已关注 */
        const unFollow = () => {
            deleteFollowInfo(data.user.id, data.userId).then(res => {
                if (res.data.code === 20021) {
                    data.isFollowed = false
                    data.fansList.length--
                } else {
                    alert('取消关注失败')
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
                alert('请不要删除别人的评论，前端何苦为难前端')
                return
            }
            deleteCommentInfo(commentId).then(res => {
                if (res.data.code === 20021) {
                    // 重新获取评论数据
                    getCommentList(data.id).then(res => {
                        if (res.data.code === 20041) {
                            commentFilter(res.data.data)
                        }
                    })
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
            renderedMarkdown,
            comment,
            replyComment,
            subReplyComment,
            dateTime,
            likeCount,
            collectCount,
            fansCount,
            nickname,
            avatar,
            inputComment,
            inputReplyComment,
            inputSubReplyComment,
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

<style lang="scss" scoped="scoped">
/* 背景颜色 */
$bg_color: #fff;

/* 字体颜色 */
$color: #fff;

/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 博客详情页面
----------------------------------------------------------------*/
.detail_block {
    display: flex;
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
    }

    /* 左边博客内容 内容主体 */
    .content_main {
        margin-bottom: 30px;
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
                background-color: #f7f8f9;
                font-size: 15px;
                border-radius: 5px;
                outline: none;
                &:focus {
                    outline: 1px solid skyblue;
                }
                &::before {
                    content: attr(placeholder);
                    color: #8a919f;
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
                    color: skyblue;
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
                width: 656px;
                height: 50px;
                margin-top: 5px;
                margin-bottom: 50px;
                padding: 10px 12px;
                background-color: #f7f8f9;
                font-size: 15px;
                border-radius: 5px;
                outline: none;
                &:focus {
                    outline: 1px solid skyblue;
                }
                &::before {
                    content: attr(placeholder);
                    color: #8a919f;
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
            }
        }

        /* 左边博客内容 评论列表--回复者列表 */
        .sub_comment_list {
            display: flex;
            position: relative;
            width: 654px;
            padding: 15px;
            background-color: #f1f2f5;

            .sub_comment_main {
                width: 620px;
            }

            /* 左边博客内容 评论列表--回复者列表(回复评论框) */
            .reply_sub_comment_main {
                width: 596px;
                height: 50px;
                margin-top: 5px;
                margin-bottom: 40px;
                padding: 10px 12px;
                background-color: #f7f8f9;
                font-size: 15px;
                border-radius: 5px;
                outline: none;
                &:focus {
                    outline: 1px solid skyblue;
                }
                &::before {
                    content: attr(placeholder);
                    color: #8a919f;
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
    width: 280px;
}

/* 右边作者相关
----------------------------------------------------------------*/
.aside_top {
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
                background-color: skyblue;
                color: $color;
            }

            /* 右边作者相关 已关注按钮 */
            &:nth-child(2) {
                background-color: #f2f3f5;
                color: #8a919f;
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
                color: skyblue;
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

            /* 右边作者相关 文章相关--操作项(点赞/评论/收藏-数量) */
            [class$='count'] {
                position: absolute;
                top: -5px;
                right: -15px;
                min-width: 21px;
                padding: 0 5px;
                background-color: #8a919f;
                color: $color;
                border-radius: 8px;
            }

            /* 右边作者相关 文章相关--操作项(字体图标) */
            .iconfont {
                color: #8a919f;
                font-size: 25px;
                line-height: 50px;
                &:hover {
                    color: salmon;
                }
            }
        }
    }
}
</style>
