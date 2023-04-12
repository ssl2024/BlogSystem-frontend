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
$border_line: #e8e8ed;
$bg_color: #fff;
.fans_list {
    background-color: $bg_color;
    height: 300px;
    .fans_item {
        display: flex;
        height: 80px;
        padding: 5px 25px;
        border-top: 1px solid $border_line;
        border-bottom: 1px solid $border_line;
        justify-content: space-between;
        align-items: center;
        .fans_info {
            display: flex;
            font-size: 16px;
            align-items: center;
            img {
                width: 60px;
                height: 60px;
                margin-right: 10px;
                border-radius: 50%;
            }
        }
        .fans_status {
            width: 90px;
            height: 30px;
            background-color: #92c452;
            color: #fff;
            line-height: 30px;
            text-align: center;
            border-radius: 5px;
        }
    }
}
</style>
