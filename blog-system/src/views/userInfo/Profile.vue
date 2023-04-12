<template>
    <div class="profile_setting">
        <div class="setting_title">个人资料</div>
        <ul class="setting_list">
            <li class="setting_item">
                <span>手机</span>
                <span>157****6364</span>
                <span>解绑</span>
            </li>
            <li class="setting_item">
                <span>邮箱</span>
                <span>shisl2024@163.com</span>
                <span>解绑</span>
            </li>
            <li class="setting_item">
                <span>密码</span>
                <span></span>
                <span>重置</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped="scoped">
$border_line: #e8e8ed;
// $bg_color: #fff;
.profile_setting {
    .setting_title {
        height: 55px;
        font-size: 22px;
        font-weight: 600;
        line-height: 55px;
        border-bottom: 1px solid $border_line;
    }
}
</style>
