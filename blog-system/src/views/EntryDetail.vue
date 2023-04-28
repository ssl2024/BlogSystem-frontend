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
            <div class="comment_title">全部评论 23</div>
            <div class="comment_list">
                <img
                    class="comment_avatar"
                    src="https://iph.href.lu/40x40"
                    alt="评论头像"
                />
                <div class="comment_item">
                    <div class="comment_main">
                        <div class="user_nickname">石松林_前端基础</div>
                        <div class="comment">这是我发表的一条评论</div>
                        <span class="action_btn">
                            <i class="iconfont icon-pinglun2"></i>
                            <span>回复</span>
                        </span>
                    </div>
                    <div class="sub_comment_list">
                        <img
                            class="sub_comment_avatar"
                            src="https://iph.href.lu/24x24"
                            alt="评论头像"
                        />
                        <div class="sub_comment_main">
                            <div class="user_nickname">石松林_前端基础</div>
                            <div class="comment">这是我发表的一条评论</div>
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
            <div class="author_info">
                <img
                    class="author_avatar"
                    src="https://iph.href.lu/60x60"
                    alt="作者头像"
                />
                <div class="author_nickname">{{ user.nickname }}</div>
            </div>
            <div class="operate_btn">
                <div class="item">
                    <i class="iconfont"></i>
                    <span>关注</span>
                </div>
                <div class="item" v-show="false">
                    <i class="iconfont"></i>
                    <span>已关注</span>
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
                    <span class="comment_count">{{
                        commentCount(entry.commentCount)
                    }}</span>
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
import { reactive, toRefs, onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import MarkdownIt from 'markdown-it'

import http from '@/utils/http'
import dateFormatter from '@/utils/dateFormatter'
export default {
    setup() {
        const route = useRoute()
        const store = useStore()

        const renderedMarkdown = ref('')
        const md = new MarkdownIt()

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
        })

        onMounted(() => {
            http.all([
                getEntryDetail(data.id),
                getLikeState(data.id, data.userId),
                getCollectState(data.id, data.userId),
            ]).then(res => {
                if (res[0].data.code === 20041) {
                    data.entry = res[0].data.data
                    renderedMarkdown.value = md.render(data.entry.content)
                    // 获取到的博文信息，通过作者id 获取其相关信息
                    getUserInfo(data.entry.authorId).then(res => {
                        if (res.data.code === 20041) {
                            data.user = res.data.data
                        }
                    })
                }
                if (res[1].data.code === 20041) {
                    data.likeState = res[1].data.data
                }
                if (res[2].data.code === 20041) {
                    data.collectState = res[2].data.data
                }
            })
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
        /* computed 博客评论次数 */
        const commentCount = computed(() => {
            return commentCount => {
                return commentCount
            }
        })
        /* computed 博客收藏次数 */
        const collectCount = computed(() => {
            return collectCount => {
                return collectCount
            }
        })

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
        }

        /* http 获取博文信息 */
        const getEntryDetail = entryId => {
            return http.get(`/blogs/${entryId}`)
        }
        /* http 获取点赞状态 */
        const getLikeState = (entryId, loginUserId) => {
            return http.get(`/likes/${entryId}/${loginUserId}`)
        }
        /* http 获取收藏状态 */
        const getCollectState = (entryId, loginUserId) => {
            return http.get(`/collects/${entryId}/${loginUserId}`)
        }
        /* http 获取用户信息 */
        const getUserInfo = userId => {
            return http.get(`/users/${userId}`)
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
        return {
            ...toRefs(data),
            renderedMarkdown,
            dateTime,
            likeCount,
            commentCount,
            collectCount,
            comment,
            input,
            likeEntry,
            commentEntry,
            collectEntry,
            submitComment,
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
            height: 45px;
            background-color: #1e80ff;
            color: $color;
            font-size: 14px;
            text-align: center;
            line-height: 45px;
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
        .item {
            width: 135px;
            height: 40px;
            background-color: skyblue;
            color: $color;
            font-size: 16px;
            text-align: center;
            line-height: 40px;
            border-radius: 5px;
        }
    }

    /* 右边作者相关 作者成就 */
    .author_achievement {
        margin-bottom: 10px;
        padding-top: 10px;
        border-top: 1px solid $border_line;
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
