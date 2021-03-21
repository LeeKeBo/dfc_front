<template>
    <div >
        <el-menu
                :default-active="activeIndex2"
                class="el-menu-demo"
                @select="handleSelect"
                mode="horizontal"
                background-color="#191E2B"
                text-color="#fff"
                active-text-color="#00A4FF"
                style="border-width: 0px"
                :collapse="isCollapse"
                router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" >
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                    v-if="subItem.subs"
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.subs"
                                        :key="i"
                                        :index="threeItem.index"
                                >{{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" style="padding: 0 35px;">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "bar",
        data() {
            return {
                activeIndex2: '1',
                // 在这里设置导航页的选项
                items: [
                    {
                        icon: 'el-icon-s-home',
                        index: '/home',
                        title: 'Home Page'
                    },
                    {
                        icon: 'el-icon-edit',
                        index: '/edit/mainGap',
                        title: 'Paint Area'
                    },
                    {
                        icon: 'el-icon-notebook-2',
                        index: '/file',
                        title: 'File Area'
                    }
                ],
                isCollapse: false
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style scoped>
    el-menu-item{

    }
</style>
