<template>
    <div class="blog">
        <div class="content">
            <span class="title">
                Springboot+WebUploader优雅实现超大文件的上传(一)
            </span>
            <p class="text">
                在软件工程里，在处理“大”的时候一直是一个难点和难点，如并发大、数据量大、文件大，对硬件进行升级可以解决一些问题，但这并不最聪明的办法，而对于老板来说，这也不是成本最小的办法。作为开发人员来说，在面对类似极端的问题时，只可智取，不可硬刚，最大化利用好现有的资源，以更加优雅的办法来满足用户多样化的需求。今天的主题也是一个“大”的问题，就是大文件如何上传和下载？其实在解决这个问题之前，有一个问题是绕不过去的：什么才是大文件？几兆？几十兆？几百兆？这其实是一个极具争议的问题，在不同的业务场景下，对于大文件的“大”
            </p>
            <div class="info">
                <span>作者</span>
                <span>发布时间</span>
                <span>点赞</span>
                <span>评论</span>
                <span>浏览次数</span>
            </div>
        </div>
        <div class="right">
            <img src="https://iph.href.lu/176x99" alt="" />
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped="scoped">
.blog {
    // width: 870px;
    display: flex;
    height: 102px;
    padding: 20px;
    border-top: 1px solid #f1f2f5;
    border-bottom: 1px solid #f1f2f5;
    background-color: #fff;
    font-size: 16px;

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        .title {
            color: #222226;
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 18px;
            line-height: 25px;
        }
        .text {
            color: #555666;
            font-size: 14px;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        .info {
            margin-top: 10px;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .right {
        flex: 0 0 auto;
        width: 176px;
        height: 99px;
    }
}
</style>
