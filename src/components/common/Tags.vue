<template>
    <div id="tags">
        <ul>
            <li class="tags-li" :class="{'active': isActive(initTag.path)}">
                <router-link :to="initTag.path" class="tags-li-title">
                    {{initTag.title}}
                </router-link>
            </li>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.title}}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>

</template>

<script>
    import bus from "@/components/common/Bus";

    export default {
        name: "Tags",
        props: {
            tagsList: {
                type: Array,
                require: true
            }
        },
        data() {
            return {
                // 这是tags列表，一项代表一个子图
                // 这是默认tag，代表主图，不能进行删除和添加
                initTag: {
                    path: "/edit/mainGap",
                    title: "主图"
                }

            }
        },
        watch: {},
        methods: {
            // 判断当前的tag是否为选中状态
            isActive(path) {
                return path === this.$route.fullPath;
            },
            closeTags(index) {
                bus.$emit("delete_tag_with_index", index);
                // let delItem = this.tagsList.splice(index,1)[0]
                // let nextItem = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index-1]
                // if (nextItem){
                //     // console.log(this.tagsList[index])
                //     console.log(this.$router.fullPath)
                //     delItem.path === this.$route.fullPath && this.$router.push(nextItem.path)
                // }
                // else
                //     this.$router.push("/edit/mainGap")
            },
            // closeOther(){
            //     bus.$emit("delete_tags",)
            //     console.log(this.$route.fullPath)
            //     const curItem = this.tagsList.filter( item => {
            //         console.log(item.path)
            //         return this.$route.fullPath === item.path
            //     })
            //     this.tagsList = curItem
            // },
            // closeAll(){
            //     this.tagsList = []
            // },
            handleTags(command) {
                bus.$emit("delete_tags", command)
                // command === "other" ? this.closeOther() : this.closeAll()
            }
        }


    }
</script>

<style scoped>
    #tags {
        position: relative;
        height: 30px;
        overflow: hidden;
        background: #fff;
        padding-right: 120px;
        box-shadow: 0 5px 10px #ddd;
    }

    #tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        background: #ff5954;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
</style>
