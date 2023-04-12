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
            currentItem: 'JavaScript',
            ddsShow: false,
        })
        const showDropdownSelect = () => {
            data.ddsShow = !data.ddsShow
        }
        const changeCurrentItem = e => {
            console.log(e.target.innerText)
            data.currentItem = e.target.innerText
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
/* 博客列表导航栏
----------------------------------------------------------------*/
.list_header {
    display: flex;
    justify-content: space-between;
    height: 24px;
    padding: 12px 20px;
    background-color: #fff;
    border-bottom: 1px solid #f3f3f3;

    /* 博客导航栏 */
    .nav_list {
        display: flex;
        font-size: 16px;
        .nav_item {
            width: 70px;
            height: 30px;
            line-height: 30px;
            text-align: center;
        }
    }

    /* 博客下拉选择 */
    .list_header_select {
        display: flex;
        position: relative;
        width: 140px;
        height: 22px;
        padding: 2px 12px;
        background-color: #f3f3f3;
        line-height: 22px;
        border-radius: 5px;
        .item_current {
            width: 118px;
            height: 22px;
            background-color: #f3f3f3;
        }
        .iconfont {
            font-size: 14px;
        }
        .dropdown_select {
            position: absolute;
            top: 30px;
            left: 0;
            overflow-x: hidden;
            overflow-y: auto;
            width: 164px;
            height: 144px;
            background-color: slategray;
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

/* 暂时啥用 */
.active {
    display: block;
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 40%;
    width: 22%;
    height: 3px;
    background-color: #1e80ff;
    border-radius: 2px;
}
</style>
