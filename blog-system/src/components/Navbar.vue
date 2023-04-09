<template>
    <div>
        <ul>
            <router-link to="/attention" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    关注
                </li>
            </router-link>
            <router-link to="/recommend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    推荐
                </li>
            </router-link>
            <router-link to="/foreend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    前端
                </li>
            </router-link>
            <router-link to="/backend" custom v-slot="{ navigate, isActive }">
                <li @click="navigate" :class="isActive ? 'currentItem' : ''">
                    后端
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
ul {
    display: flex;
    background-color: seagreen;
    li {
        width: 100px;
        height: 45px;
        background: skyblue;
        font-size: 16px;
        text-align: center;
        line-height: 45px;
    }
}

.currentItem {
    background-color: greenyellow;
}
</style>
