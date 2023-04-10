<template>
    <div class="item" @click="blogDetail(111)">
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
        const blogDetail = id => {
            console.log(1111)
            router.push('/blogDetail', id)
        }
        return {
            blogDetail,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
.item {
    display: flex;
    padding-bottom: 10px;
    border-top: 1px solid #f1f2f5;
    border-bottom: 1px solid #f1f2f5;
    background-color: #fff;
    &:hover {
        background-color: #fafafa;
    }
    .content_wrapper {
        display: flex;
        padding: 10px 0 0 10px;
        flex-direction: column;
        justify-content: space-around;
        .content_title {
            color: #222226;
            font-size: 18px;
            line-height: 25px;
        }
        .content_main {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;

            color: #555666;
            font-size: 13px;
        }
        .action_list {
            display: flex;
            .action_item {
                margin-right: 10px;
                .iconfont {
                    font-size: 17px;
                }
                span {
                    margin-left: 2px;
                    font-size: 13px;
                }
            }
        }
    }
    .picture {
        padding: 7px;
        width: 176px;
    }
}
</style>
