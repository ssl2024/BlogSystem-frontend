<template>
    <div class="item" @click="toBlogDetail(entry.id)">
        <div class="content_wrapper">
            <div class="content_title">
                {{ entry.title }}
            </div>
            <div class="content_main">
                {{ entry.content }}
            </div>
            <ul class="action_list">
                <li class="action_item">
                    <i class="iconfont icon-browse"></i>
                    <span>{{ entry.browseCount }}</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-good"></i>
                    <span>{{ entry.likeCount }}</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-pinglun"></i>
                    <span>{{ entry.commentCount }}</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-shijian"></i>
                    <span>{{ updateTime(entry.updateTime) }}</span>
                </li>
                <li
                    class="action_item"
                    @click.stop="toUserCenter(entry.authorId)"
                >
                    <i class="iconfont icon-user"></i>
                    <span>{{ nickname }}</span>
                </li>
            </ul>
        </div>
        <div class="picture">
            <img src="https://iph.href.lu/176x99" alt="博客展示图片" />
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import http from '@/utils/http'
import dateFormatter from '@/utils/dateFormatter'
export default {
    props: ['entry'],
    setup(props) {
        const router = useRouter()

        const data = reactive({
            /* 文章信息 */
            entry: props.entry,
            /* 作者昵称 */
            nickname: '',
        })

        onMounted(() => {
            // 获取当前博客的作者昵称
            http.get(`/users/${data.entry.authorId}`).then(res => {
                if (res.data.code === 20041) {
                    data.nickname = res.data.data.nickname
                }
            })
        })

        /* computed 博客更新时间 */
        const updateTime = computed(() => {
            return item => {
                return dateFormatter(item)
            }
        })

        /* click 任意博客 */
        const toBlogDetail = id => {
            router.push(`/entryDetail/${id}`)
        }
        /* click 博客上的用户名 */
        const toUserCenter = id => {
            console.log('执行了center')
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
$border_line: #e8e8ed;

/* 博客组件
----------------------------------------------------------------*/
.item {
    display: flex;
    padding-bottom: 10px;
    border-top: 1px solid $border_line;
    border-bottom: 1px solid $border_line;
    background-color: #fff;
    &:hover {
        background-color: #fafafa;
    }

    /* 博客 包装 */
    .content_wrapper {
        flex: 1;
        display: flex;
        padding: 10px 0 0 10px;
        flex-direction: column;
        justify-content: space-around;

        /* 博客 内容标题 */
        .content_title {
            color: #222226;
            font-size: 18px;
            line-height: 25px;
        }

        /* 博客 内容主体 */
        .content_main {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #555666;
            font-size: 13px;
        }

        /* 博客 数据列表 */
        .action_list {
            display: flex;

            /* 博客 数据列表--数据项 */
            .action_item {
                margin-right: 10px;

                /* 博客 数据列表--数据项(用户名称) */
                &:last-child {
                    cursor: pointer;
                    &:hover {
                        color: #1d7cf7;
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
        padding: 7px;
        width: 176px;
    }
}
</style>
