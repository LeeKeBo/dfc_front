<template>
    <div class="header">

        <div class="logo">
<!--            <img src="../../assets/dfc_logo.png" alt="" style="vertical-align:middle;height: 60px">-->
<!--            <a style="vertical-align:middle"> </a>-->
            <p>DFC 前端绘制工具</p>
        </div>
        <v-bar class="leftBar"></v-bar>

<!--        <div id="user_box">-->
<!--            <div id="user_mess">-->
<!--                <div id="user_avator">-->
<!--                    <img src="../../assets/logo.jpg" alt="">-->
<!--                </div>-->
<!--                <el-dropdown id="username">-->
<!--                <span>-->
<!--                    {{user_name}}-->
<!--                    <i class="el-icon-caret-bottom"></i>-->
<!--                </span>-->
<!--                    <el-dropdown-menu>-->
<!--                        <el-dropdown-item command="loginout">-->
<!--                            <el-link href="https://github.com/luoszu/DFC" target="_blank">项目链接</el-link>-->

<!--                        </el-dropdown-item>-->
<!--                    </el-dropdown-menu>-->
<!--                </el-dropdown>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
    import vBar from './Bar.vue';

    export default {
        name: "Head",
        data() {
            return {
                username: 'dfc_user'
            }
        },
        computed: {
            user_name() {
                let username = localStorage.getItem('username');
                return username ? username : this.username;
            }
        },
        components:{
            vBar
        }

    }
</script>

<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        /*color: #fff;*/
        background-color: #191E2B;
        /*background-color: #257fb9;*/
    }

    .logo {
        float: left;
        width: 500px;
        line-height: 60px;
        text-align: left;
        font-size: 24px;
        color: aliceblue;
        display: flex;
        align-items: center;
        font-family: "Times New Roman";
        padding-left: 15px;
    }

    #user_box {
        float: right;
    }

    #user_mess {
        display: flex;
        /*float: right;*/
        padding-right: 10px;
        width: 150px;
        height: 70px;
        text-align: center;
        align-items: center;
    }

    #username {
        /*float: right;*/
        color: aliceblue;
        padding-left: 10px;
    }

    #user_avator img {
        margin-left: 20px;
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        align-items: center;
    }

    .leftBar{
        float: right;
        /*margin-top: 15px;*/
        /*Vertical-Align: center;*/
    }

</style>
