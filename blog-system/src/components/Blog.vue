<template>
    <div class="item" @click="toBlogDetail(123)">
        <div class="content_wrapper">
            <div class="content_title">
                Springboot+WebUploader优雅实现超大文件的上传(一)
            </div>
            <div class="content_main">
                在软件工程里，在处理“大”的时候一直是一个难点和难点，如并发大、数据量大、文件大，对硬件进行升级可以解决一些问题，但这并不最聪明的办法，而对于老板来说，这也不是成本最小的办法。作为开发人员来说，在面对类似极端的问题时，只可智取，不可硬刚，最大化利用好现有的资源，以更加优雅的办法来满足用户多样化的需求。今天的主题也是一个“大”的问题，就是大文件如何上传和下载？其实在解决这个问题之前，有一个问题是绕不过去的：什么才是大文件？几兆？几十兆？几百兆？这其实是一个极具争议的问题，在不同的业务场景下，对于大文件的“大”
            </div>
            <ul class="action_list">
                <li class="action_item">
                    <i class="iconfont icon-browse"></i>
                    <span>6753</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-good"></i>
                    <span>1278</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-pinglun"></i>
                    <span>123</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-shijian"></i>
                    <span>2023-04-05</span>
                </li>
                <li class="action_item">
                    <i class="iconfont icon-user"></i>
                    <span>这是作者昵称</span>
                </li>
            </ul>
        </div>
        <div class="picture">
            <img src="https://iph.href.lu/176x99" alt="博客展示图片" />
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    props: [],
    setup() {
        const router = useRouter()
        /* click 任意博客 */
        const toBlogDetail = id => {
            router.push(`/entryDetail/${id}`)
        }
        return {
            toBlogDetail,
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
