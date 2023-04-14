<template>
    <div class="list_header">
        <ul class="nav_list">
            <li class="nav_item">
                <i class="iconfont icon-remen"></i>
                <span>最热</span>
            </li>
            <li class="nav_item">
                <i class="iconfont icon-remen"></i>
                <span>最新</span>
            </li>
        </ul>
        <div class="list_header_select">
            <div class="item_current">{{ currentItem }}</div>
            <i
                class="iconfont icon-xiangxiajiantou"
                @click="showDropdownSelect"
            ></i>
            <ul
                class="dropdown_select"
                v-show="ddsShow"
                @click="changeCurrentItem"
            >
                <li class="item_select">前端</li>
                <li class="item_select">HTML</li>
                <li class="item_select">Javascript</li>
                <li class="item_select">CSS</li>
                <li class="item_select">Ajax</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    setup() {
        const data = reactive({
            /* 当前选中项 */
            currentItem: 'JavaScript',
            /**
             * 是否显示下拉菜单
             * false 不显示
             * true  显示
             */
            ddsShow: false,
        })

        /* click 博客列表中向下箭头 */
        const showDropdownSelect = () => {
            data.ddsShow = !data.ddsShow
        }

        /* click 博客列表中下拉菜单项 */
        const changeCurrentItem = e => {
            data.currentItem = e.target.innerText
            data.ddsShow = false
        }
        return {
            ...toRefs(data),
            showDropdownSelect,
            changeCurrentItem,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 博客列表导航栏组件
----------------------------------------------------------------*/
.list_header {
    display: flex;
    height: 24px;
    padding: 12px 20px;
    border-bottom: 1px solid #e8e8ed;
    background-color: #fff;
    justify-content: space-between;

    /* 博客导航栏 导航列表 */
    .nav_list {
        display: flex;
        font-size: 16px;

        /* 博客导航栏 导航列表--列表项 */
        .nav_item {
            width: 70px;
            height: 30px;
            text-align: center;
            line-height: 30px;
        }
    }

    /* 博客导航栏 博客下拉选择框 */
    .list_header_select {
        display: flex;
        position: relative;
        width: 140px;
        height: 22px;
        padding: 2px 12px;
        background-color: #f3f3f3;
        line-height: 22px;
        border-radius: 5px;

        /* 博客导航栏 博客下拉选择框--当前选项 */
        .item_current {
            width: 118px;
            height: 22px;
        }

        /* 博客导航栏 博客下拉选择框--向下箭头 */
        .iconfont {
            font-size: 14px;
            cursor: pointer;
        }

        /* 博客导航栏 博客下拉选择框--下拉菜单 */
        .dropdown_select {
            position: absolute;
            top: 30px;
            left: 0;
            overflow-x: hidden;
            overflow-y: auto;
            width: 164px;
            height: 144px;
            background-color: slategray;

            /* 博客导航栏 博客下拉选择框--下拉菜单(菜单项) */
            .item_select {
                width: 135px;
                height: 20px;
                padding: 8px 0 8px 16px;
                line-height: 20px;
                &:hover {
                    background-color: skyblue;
                    color: #376f9d;
                }
            }
        }
    }
}
</style>
