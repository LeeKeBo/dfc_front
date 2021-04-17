<template>
    <!--    el-popover-->
    <div class="workplace-chart" :id="id" :style="nodeStyle" :type="type" @dblclick="handleNodeDbClick">
        <i :class="[icon]"></i>
        <span class="node-name">{{name}}</span>
        <div class="ep"></div>
    </div>
</template>

<script>
    export default {
        name: "ChartNode",
        props: {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            icon: {
                type: String
            },
            nodeStyle: {
                type: Object
            }
        },
        methods: {
            handleNodeDbClick() {
                this.$emit("edit")
            }
        }
    }
</script>

<style lang="scss" scoped>
    .workplace-chart {
        position: absolute;
        text-align: center;
        margin: 0;
        cursor: pointer;
        padding: 10px;

        i {
            display: inline-block;
            background-repeat: no-repeat;
            background-position: center;
            font-size: 20px;
            color: #409eff;
            cursor: pointer;
            margin-bottom: 5px;
            touch-action: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            user-select: none;

            &.circle {
                /*background-image: url(../assets/images/circle.png);*/
                width: 60px;
                height: 61px;
                line-height: 60px;
                background-size: 100%;
            }

            &.diamond {
                /*background-image: url(../assets/images/diamond.png);*/
                width: 60px;
                height: 60px;
                line-height: 60px;
                background-size: 100%;
            }
        }

        span {
            display: block;
        }

        .ep {
            opacity: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: 10px;
            height: 10px;
            background: #409eff;
            border-radius: 5px;
        }

        &:hover {
            .ep {
                opacity: 1;
            }
        }

        &.dragHover {
            .ep {
                opacity: 0;
            }
        }
        .node-name{
            padding: 4px;
            border: 1px solid #0a001f;
            border-radius: 20px;
        }
    }
</style>
