<template>
    <el-container class="container">

        <div class="boxWrapper">
            <div class="introBox">
                <div class="introTitle">Dataflow C language, DFC</div>
                <div class="introContent">&nbsp;&nbsp;  数据流通用C语言(Dataflow C language, DFC)是由深圳大学高性能计算研究所的系统技术组SKT（System
                    Kernel Technology Group）开发，旨在提供通用的数据流编程语言。DFC编译器利用了ompicc编译器的代码，运行库则借用了mbrossard 线程池代码。
                    <el-link href="https://github.com/luoszu/DFC" target="_blank" class="projectLink">view the project</el-link>
                </div>

<!--                数据流通用C语言(Dataflow C language, DFC)是由深圳大学高性能计算研究所的系统技术组SKT（System-->
<!--                Kernel Technology-->
<!--                Group）开发，旨在提供通用的数据流编程语言。DFC编译器利用了ompicc编译器的代码，运行库则借用了mbrossard 线程池代码。-->
<!--                DFC is a grammatical extension of-->
<!--                standard C language, with special DF function which describe the-->
<!--                dependence of computing DAG. DFC compiler, dfcc, is used to-->
<!--                convert the DFC source codes to standard C codes with the-->
<!--                assistance of multi-threaded library. The lexical rules and-->
<!--                grammatical rules are used to setup the AST of DFC codes, and-->
<!--                then it is converted to the AST of standard C without DF function-->
<!--                nodes.-->

            </div>
        </div>

        <!--        <el-card class="box-card" style="width: 400px" >-->
        <!--            <el-carousel :interval="4000" style="width: 400px" class="block">-->

        <!--                <el-carousel-item>-->
        <!--                    <el-image-->
        <!--                            :src="require('../../assets/dfc_func.png')" fit="contain" style="height: 100%"></el-image>-->

        <!--                    &lt;!&ndash;                    <img src="../../assets/dfc_logo.png" alt="" style="width: 100%">&ndash;&gt;-->
        <!--                </el-carousel-item>-->
        <!--                <el-carousel-item>-->
        <!--                    <el-image-->
        <!--                            :src="require('../../assets/dfc_struct.png')" fit="contain" style="height: 100%"></el-image>-->
        <!--                    &lt;!&ndash;                    <img src="../../assets/dfc_logo.png" alt="" style="width: 100%">&ndash;&gt;-->
        <!--                </el-carousel-item>-->
        <!--                <el-carousel-item>-->
        <!--                    <el-image-->
        <!--                            :src="require('../../assets/dfc_threadpool.png')" fit="contain"-->
        <!--                            style="height: 100%"></el-image>-->
        <!--                    &lt;!&ndash;                    <img src="../../assets/dfc_logo.png" alt="" style="width: 100%">&ndash;&gt;-->
        <!--                </el-carousel-item>-->

        <!--                &lt;!&ndash;                <el-carousel-item>&ndash;&gt;-->
        <!--                &lt;!&ndash;                    <img src="../../assets/dfc_struct.png" alt="" style="width: 100%">&ndash;&gt;-->
        <!--                &lt;!&ndash;                </el-carousel-item>&ndash;&gt;-->
        <!--                &lt;!&ndash;                <el-carousel-item>&ndash;&gt;-->
        <!--                &lt;!&ndash;                    <img src="../../assets/dfc_threadpool.png" alt="" style="width: 100%">&ndash;&gt;-->
        <!--                &lt;!&ndash;                </el-carousel-item>&ndash;&gt;-->
        <!--            </el-carousel>-->

        <!--        </el-card>-->


        <!--        <el-card class="box-card">-->
        <!--            <div slot="header" class="clearfix">-->
        <!--                <span>DFC</span>-->
        <!--            </div>-->
        <!--            -->
        <!--        </el-card>-->

        <!--        <el-aside style="height: 100%;width: 260px" >-->
        <!--            <img src="../../assets/dfc_logo.png" alt="" style="width: 300px; height: 250px">-->
        <!--        </el-aside>-->
        <el-container>
            <el-main>
                <div>

                </div>
                <div>

                </div>
            </el-main>
        </el-container>

    </el-container>
</template>

<script>
    export default {
        name: "Index",
        data() {
            return {
                url: "../../assets/dfc_logo.png",
                srcList: [
                    "../../assets/dfc_logo.png",
                ],
                urlList: [
                    '@/assets/dfc_logo.png',
                    '../../assets/dfc_struct.png',
                    '../../assets/dfc_threadpool.png'
                ]
            }
        }

    }
</script>

<style scoped>
    .container {
        /*background-color: #a1a599;*/
        height: 100%;
        background-image: url("../../assets/backgraph3.png");
    }

    .introFont {
        font-size: 1em;
        font-weight: bolder;
        text-indent: 2em;
    }

    .box-card {
        width: 400px;
        height: 400px;
    }

    .introBox {
        width: 600px;
        color: #b6b6b6;
        font-size: 15px;
        /*position: absolute;*/
        /*margin: 0 auto;*/
        position: absolute;
        margin: 0 auto;
        /* padding-bottom: 100px; */
        line-height: 30px;
        left: 35%;
        top: 30%
    }

    .introTitle {
        font-size: 40px;
        line-height: 80px;
        color: #ffffff;
    }

    .introContent {
        padding-left: 10px;
    }

    .boxWrapper {
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
    }
</style>
