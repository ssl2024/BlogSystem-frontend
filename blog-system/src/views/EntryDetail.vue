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
                        src="https://iph.href.lu/45x45"
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
                        src="https://iph.href.lu/45x45"
                        alt="当前用户头像"
                    />
                    <div
                        class="comment_main"
                        contenteditable="true"
                        :placeholder="comment_placeholder"
                        @input="input"
                        ref="comment"
                    ></div>
                </div>
                <div class="submit_btn" @click="submitComment">
                    发表评论(Enter)
                </div>
            </div>
            <div class="comment_title" v-show="commentCount">
                全部评论 {{ commentCount }}
            </div>
            <div
                class="comment_list"
                v-for="comment in commentList"
                :key="comment.id"
            >
                <img
                    class="comment_avatar"
                    src="https://iph.href.lu/40x40"
                    alt="评论头像"
                />
                <div class="comment_item">
                    <div class="comment_main">
                        <div class="user_nickname">
                            {{ nickname(comment.userId) }}
                        </div>
                        <div class="comment">{{ comment.content }}</div>
                        <span class="action_btn">
                            <i class="iconfont icon-pinglun2"></i>
                            <span>回复</span>
                        </span>
                    </div>
                    <div
                        class="sub_comment_list"
                        v-for="item in comment.children"
                        :key="item.id"
                    >
                        <img
                            class="sub_comment_avatar"
                            src="https://iph.href.lu/24x24"
                            alt="评论头像"
                        />
                        <div class="sub_comment_main">
                            <div class="user_nickname">
                                {{ nickname(item.userId) }}
                            </div>
                            <div class="comment">{{ item.content }}</div>
                            <span class="sub_action_btn">
                                <i class="iconfont icon-pinglun2"></i>
                                <span>回复</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 侧边栏 -->
        <div class="aside">
            <div class="author_info" @click="toUserPage(user.id)">
                <img
                    class="author_avatar"
                    src="https://iph.href.lu/60x60"
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
            <div class="author_achievement">
                <div class="item">
                    <i class="iconfont icon-dianzan1"></i>
                    <span>获得点赞 234</span>
                </div>
                <div class="item">
                    <i class="iconfont icon-dianzan1"></i>
                    <span>文章被阅读 3456</span>
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
            /* 粉丝列表 */
            fansList: {},
            /* 关注列表 */
            followList: {},
            /* 文章评论列表 */
            commentList: {},
            /* 评论用户信息 */
            userCache: {},
            commentCount: 0,
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
            // 如果10秒之内退出则清除定时器
            clearTimeout(timeId)
        })

        /* filter 评论过滤器 */
        const commentFilter = comments => {
            const commentList = []
            // 遍历所有评论数据，分出 一级评论 和 二级评论
            comments.forEach(item => {
                item.children = []
                if (item.parentId !== null) {
                    // 二级评论
                    commentList.forEach(comment => {
                        if (comment.id === item.parentId) {
                            comment.children.push(item)
                        }
                    })
                } else {
                    // 一级评论
                    commentList.push(item)
                }
                // 判断用户信息缓存中是否存在评论者id对应的信息
                if (data.userCache[item.userId]) {
                    // 存在
                    return
                } else {
                    // 不存在 获取当前评论者的头像和昵称并添加到用户信息缓存中
                    getUserInfo(item.userId).then(res => {
                        if (res.data.code === 20041) {
                            data.userCache[item.userId] = {
                                nickname: res.data.data.nickname,
                                avatar: res.data.data.avatar,
                            }
                        }
                    })
                }
            })
            data.commentCount = comments.length
            data.commentList = commentList
        }

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
            return userId => {
                if (data.userCache[userId]) {
                    return data.userCache[userId].nickname
                }
                return ''
            }
        })
        /* computed 评论者头像 */
        /* computed 评论数 */

        /* DOM 评论输入框 */
        const comment = ref()

        /* input 评论输入框 */
        const input = e => {
            data.comment_placeholder =
                e.target.innerText.length > 0 ? '' : '善语结善缘，恶言伤人心'
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
                        // 更新文章
                        updateEntry().then(res => {
                            console.log(res)
                        })
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
                        // 更新文章
                        updateEntry().then(res => {
                            console.log(res)
                        })
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
                        // 更新文章
                        updateEntry().then(res => {
                            console.log(res)
                        })
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
                        // 更新文章
                        updateEntry().then(res => {
                            console.log(res)
                        })
                        alert('收藏文章成功')
                    } else {
                        alert('收藏文章失败')
                    }
                })
            }
        }
        /* click 发表评论 */
        const submitComment = () => {
            console.log('点击了发表评论按钮')
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
        /* http 发表评论 */
        const addComment = (content, createTime, parentId = null) => {
            return http.post(`/comments`, {
                content,
                createTime,
                parentId,
                userId: data.userId,
                blogId: data.id,
            })
        }
        return {
            ...toRefs(data),
            renderedMarkdown,
            dateTime,
            likeCount,
            collectCount,
            fansCount,
            nickname,
            comment,
            input,
            likeEntry,
            commentEntry,
            collectEntry,
            submitComment,
            addFollow,
            unFollow,
            toUserPage,
            toUserFansList,
            toUserFollowList,
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
                height: 100px;
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
            right: 6px;
            bottom: -20px;
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
            margin-bottom: 10px;
            font-size: 15px;
        }

        /* 左边博客内容 评论列表--评论中所有评论内容 */
        .comment {
            margin-bottom: 5px;
            font-size: 14px;
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
            margin-bottom: 15px;
        }

        /* 左边博客内容 评论列表--回复者列表 */
        .sub_comment_list {
            display: flex;
            width: 650px;
            padding: 15px;
            background-color: #f1f2f5;

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

/* 右边作者相关
----------------------------------------------------------------*/
.aside {
    width: 280px;
    height: 280px;
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
        height: 50px;
        padding: 10px 0;
        border-top: 1px solid $border_line;
        border-bottom: 1px solid $border_line;
        [class='follow_item'] {
            flex: 1;
            display: flex;
            font-size: 16px;
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

    /* 右边作者相关 作者成就 */
    .author_achievement {
        margin-bottom: 10px;
        padding-top: 10px;
        font-size: 14px;

        /* 右边作者相关 作者成就--成就项 */
        .item {
            height: 30px;
            line-height: 30px;

            /* 右边作者相关 作者成就--成就项(字体图标) */
            .iconfont {
                margin-right: 10px;
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
