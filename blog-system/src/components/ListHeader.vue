<template>
    <div class="list_header">
        <!-- <ul class="nav_list">
            <li class="nav_item">
                <i class="iconfont icon-remen"></i>
                <span>最热</span>
            </li>
            <li class="nav_item">
                <i class="iconfont icon-remen"></i>
                <span>最新</span>
            </li>
        </ul> -->
        <div class="list_header_select">
            <!-- 列表当前选项 -->
            <div class="item_current" @click="showDropdownSelect">
                <span>
                    {{ currentItem }}
                </span>
                <i class="iconfont icon-xiangxiajiantou"></i>
            </div>
            <!-- 列表下拉选项 -->
            <ul
                class="dropdown_select"
                v-show="ddsShow"
                @click="changeCurrentItem"
            >
                <li class="item_select">全部</li>
                <li class="item_select" v-for="item in typeList" :key="item.id">
                    {{ item.type }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'

import http from '@/utils/http'
export default {
    props: {
        classify: {
            type: Number,
            default: -1,
        },
    },
    setup(props, { emit }) {
        const data = reactive({
            /* 当前选中项 */
            currentItem: '全部',
            /* 类型列表 */
            typeList: [],
            /**
             * 是否显示下拉菜单
             * false 不显示
             * true  显示
             */
            ddsShow: false,
        })

        onMounted(() => {
            getTypeList(props.classify).then(res => {
                if (res.data.code === 20041) {
                    data.typeList = res.data.data
                    // 对返回的数据进行处理，将查询到的所有类型添加到选择的类型列表中
                    let typeList = []
                    data.typeList.forEach(item => {
                        typeList.push(item.type)
                    })
                    // 调用父组件中的方法并传递类型列表
                    emit('changeType', typeList)
                }
            })
        })

        /* http 获取类型列表 */
        const getTypeList = classify => {
            // 判断是否传递 classify
            if (classify === -1) {
                // 没有传递 classify 获取所有类型列表
                return http.get(`/types`)
            }
            // 传递了 classify 传递指定的类型列表
            return http.get(`/types/list/${classify}`)
        }

        /* click 右边选项 */
        const showDropdownSelect = () => {
            data.ddsShow = !data.ddsShow
        }
        /* click 博客列表中下拉菜单项 */
        const changeCurrentItem = e => {
            // 获取当前选择的文本
            const selectType = e.target.innerText
            // 定义选择的类型列表
            let typeList = []
            if (selectType === '全部') {
                // 选项项为 全部，将查询到的所有类型添加到选择的类型列表中
                data.typeList.forEach(item => {
                    typeList.push(item.type)
                })
            } else {
                // 选择项为 某一选项
                typeList.push(selectType)
            }
            // 调用父组件中的方法并传递选择的类型列表
            emit('changeType', typeList)
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
    background-color: rgba($color: #efedee, $alpha: 0.4);
    // justify-content: space-between;
    justify-content: flex-end;

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
        // display: flex;
        position: relative;
        width: 140px;
        height: 22px;
        padding: 2px 12px;
        background-color: #f3f3f3;
        line-height: 22px;
        cursor: pointer;
        border-radius: 5px;
        z-index: 1;

        /* 博客导航栏 博客下拉选择框--当前选项 */
        .item_current {
            width: 118px;
            height: 22px;
            /* 博客导航栏 博客下拉选择框--当前选项(向下箭头) */
            .iconfont {
                position: absolute;
                top: 2px;
                right: 10px;
                font-size: 14px;
            }
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
