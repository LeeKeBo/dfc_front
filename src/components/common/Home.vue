<template>
    <el-container class="wrapper">
        <el-header class="homeHeader" height="60px">
            <v-head></v-head>
        </el-header>

        <el-container style="background-color: #E5E5E5">

            <el-main style="height: 100%;padding: 0" >
                    <div class="content-box" :class="{'content-collapse':collapse}">
                        <div class="content">
                            <transition name="" mode="out-in">
                                <keep-alive>
                                    <router-view></router-view>
                                </keep-alive>
                            </transition>
                        </div>
                    </div>
            </el-main>
        </el-container>

    </el-container>
</template>

<script>
    import vHead from './Header.vue';

    export default {
        name: "Home",
        data() {
            return {
                collapse: false,
                tagList: ["edit"]
            }
        },
        components: {
            vHead,
        },
        computed: {
            // 给路径加个随机参数
            key() {
                return this.$route.path + Math.random()
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        height: 100%;
        /*padding-left: 5px;*/
        /*padding-bottom: 10px;*/
        /*padding-right: 5px;*/
    }

    .content-box, .content {
        height: 100%;
    }

    .homeHeader {
        padding: 0;
        height: 100px
    }

    .homeAside {
        height: 100%;
        background-color: #191E2B;
        width: 200px;
    }

    .leftBar {
        width: 100%;
        height: 100%;
    }
</style>
