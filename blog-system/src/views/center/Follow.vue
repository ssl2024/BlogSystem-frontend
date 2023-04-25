<template>
    <div class="fans_list">
        <div class="fans_item">
            <div class="fans_info">
                <div class="fans_avatar">
                    <img src="https://iph.href.lu/60x60" alt="头像" />
                </div>
                <div class="fans_name">
                    <span>石松林_后端基础</span>
                </div>
            </div>
            <div class="fans_status">
                <span>已关注</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: #e8e8ed;

/* 背景颜色 */
$bg_color: #fff;

/* 个人主页页面--粉丝列表
----------------------------------------------------------------*/
.fans_list {
    background-color: $bg_color;
    height: 300px;

    /* 粉丝列表 列表项 */
    .fans_item {
        display: flex;
        height: 80px;
        padding: 5px 25px;
        border-top: 1px solid $border_line;
        border-bottom: 1px solid $border_line;
        justify-content: space-between;
        align-items: center;

        /* 粉丝列表 列表项--粉丝信息 */
        .fans_info {
            display: flex;
            font-size: 16px;
            align-items: center;

            /* 粉丝列表 列表项--粉丝信息(头像) */
            img {
                width: 60px;
                height: 60px;
                margin-right: 10px;
                border-radius: 50%;
            }
        }

        /* 粉丝列表 列表项--粉丝状态 */
        .fans_status {
            width: 90px;
            height: 30px;
            background-color: #92c452;
            color: #fff;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
        }
    }
}
</style>
