<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-10 00:08:54
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-18 17:08:15
 * @Description: 博客组件
-->
<template>
    <!-- S 博客组件 -->
    <div class="item" @click="toBlogDetail(entry.id)">
        <!-- 内容 -->
        <div class="content_wrapper">
            <!-- 标题 -->
            <div class="content_title">
                {{ entry.title }}
            </div>
            <!-- 摘要 -->
            <div class="content_main">
                {{ entry.blogAbstract }}
            </div>
            <!-- 博客相关信息 -->
            <ul class="action_list">
                <!-- 浏览次数 -->
                <li class="action_item">
                    <i class="iconfont icon-browse"></i>
                    <span>{{ entry.browseCount }}</span>
                </li>
                <!-- 点赞次数 -->
                <li class="action_item">
                    <i class="iconfont icon-good"></i>
                    <span>{{ entry.likeCount }}</span>
                </li>
                <!-- 评论次数 -->
                <li class="action_item">
                    <i class="iconfont icon-pinglun"></i>
                    <span>{{ entry.commentCount }}</span>
                </li>
                <!-- 更新时间 -->
                <li class="action_item">
                    <i class="iconfont icon-shijian"></i>
                    <span>{{ updateTime(entry.updateTime) }}</span>
                </li>
                <!-- 博客作者 -->
                <li
                    class="action_item"
                    @click.stop="toUserCenter(entry.authorId)"
                    :title="'查看 ' + authorName + ' 主页'"
                >
                    <i class="iconfont icon-user"></i>
                    <span>{{ authorName }}</span>
                </li>
            </ul>
        </div>
        <!-- 封面 -->
        <div class="picture" v-if="entry.picture">
            <img :src="entry.picture" alt="博客展示图片" />
        </div>
    </div>
    <!-- E 博客组件 -->
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import date from '@/utils/dateFormatter'
export default {
    props: {
        entry: {
            type: Object,
            required: true,
        },
        authorName: {
            type: String,
        },
    },
    setup(props) {
        const router = useRouter()

        const data = reactive({
            /* 文章信息 */
            entry: props.entry,
        })

        /* computed 博客更新时间 */
        const updateTime = computed(() => {
            return item => {
                return date.dateTimeFormatter(item)
            }
        })

        /* click 任意博客 */
        const toBlogDetail = id => {
            router.push(`/entryDetail/${id}`)
        }
        /* click 博客上的用户名 */
        const toUserCenter = id => {
            router.push(`/center/${id}`)
        }
        return {
            ...toRefs(data),
            updateTime,
            toBlogDetail,
            toUserCenter,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: rgba(
    $color: #b3e2f2,
    $alpha: 1,
);

/* 博客组件
----------------------------------------------------------------*/
.item {
    display: flex;
    height: 105px;
    padding: 10px;
    border-bottom: 1px solid $border_line;
    background-color: rgba($color: #fefefe, $alpha: 0.8);
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        background-color: rgba($color: #cbe5eb, $alpha: 0.9);
        .picture img {
            opacity: 1;
        }
    }

    /* 博客 内容 */
    .content_wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        /* 博客 内容--博客标题 */
        .content_title {
            color: #222226;
            font-size: 18px;
            line-height: 25px;
        }

        /* 博客 内容--博客摘要 */
        .content_main {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #555666;
            font-size: 14px;
            letter-spacing: 1px;
        }

        /* 博客 内容--数据列表 */
        .action_list {
            display: flex;

            /* 博客 数据列表--数据项 */
            .action_item {
                margin-right: 10px;

                /* 博客 数据列表--数据项(用户名称) */
                &:last-child {
                    cursor: pointer;
                    transition: all 0.2s;
                    &:hover {
                        color: #47acbe;
                    }
                }

                /* 博客 数据列表--数据项(字体图标) */
                .iconfont {
                    margin-right: 5px;
                    font-size: 17px;
                }

                /* 博客 数据列表--数据项(名称) */
                span {
                    margin-left: 2px;
                    font-size: 13px;
                }
            }
        }
    }

    /* 博客 展示图片 */
    .picture {
        width: 176px;
        img {
            width: 176px;
            height: 101px;
            opacity: 0.8;
        }
    }
}
</style>
