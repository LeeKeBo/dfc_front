<template>
    <el-container class="container" id="work-container" v-loading="loading" element-loading-text="文件解析中"
                  element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">

        <!--            属性修改弹窗-->
        <el-dialog width="60%" title="属性编辑" :visible.sync="innerVisible" :close-on-click-modal=false>
            <el-form ref="curAttr" label-width="100px">
                <el-form-item label="类型">
                    <el-select v-model="curAttr.type">
                        <el-option
                                v-for="item in typeList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="curAttr.name"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStructAttr()">确 定</el-button>
            </div>
        </el-dialog>
        <!--            类节点弹窗-->
        <el-dialog title="结构体节点信息编辑" :visible.sync="dialogVisibleList[NodeType.StructNode]" :close-on-click-modal=false>
            <el-form ref="curNode" label-width="150px">
                <el-form-item label="结构体名称">
                    <el-input v-model="curNode.name"></el-input>
                </el-form-item>
                <el-form-item label="属性列表" class="attr-list">
                    <el-table
                            :data="curNode.attrs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                        <el-table-column
                                align="right">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="editStructAttr(scope.$index, scope.row,0)">Edit
                                </el-button>
                                <el-button size="mini" type="danger"
                                           @click="deleteStructAttr(scope.$index, scope.row,0) ">Delete
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <i class="el-icon-circle-plus-outline" @click="openStructAttrDia(0)"></i>
                </el-form-item>
                <el-form-item label="结构体函数列表">
                    <template>
                        <codemirror ref="structCode" :value="curCode" :options="cmOptions"></codemirror>
                    </template>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleList.splice(NodeType.StructNode,1,false)">取 消</el-button>
                <el-button type="danger" @click="deleteNode()">删 除</el-button>
                <el-button type="primary" @click="saveEditNode()">确 定</el-button>
            </div>
        </el-dialog>
        <!--            数据流节点弹窗-->
        <el-dialog title="数据流节点信息编辑" :visible.sync="dialogVisibleList[NodeType.FlowNode]" :close-on-click-modal=false>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="数据流函数信息" name="first">
                    <el-form>
                        <el-form-item label="数据流函数名">
                            <el-input v-model="curNode.name"></el-input>
                        </el-form-item>
                        <el-form-item label="数据流返回值">
                            <el-select v-model="curNode.returnType" placeholder="请选择">
                                <el-option
                                        v-for="item in typeList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="输入参数列表">
                            <el-table
                                    :data="curNode.inputs"
                                    style="width: 100%">
                                <el-table-column label="Type" prop="type"></el-table-column>
                                <el-table-column label="Name" prop="name"></el-table-column>
                                <el-table-column
                                        align="right">
                                    <template slot-scope="scope">
                                        <el-button size="mini" @click="editStructAttr(scope.$index, scope.row,1)">Edit
                                        </el-button>
                                        <el-button size="mini" type="danger"
                                                   @click="deleteStructAttr(scope.$index, scope.row,1) ">Delete
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <i class="el-icon-circle-plus-outline" @click="openStructAttrDia(1)"></i>
                        </el-form-item>
                        <el-form-item label="输出参数列表">
                            <el-table
                                    :data="curNode.outputs"
                                    style="width: 100%">
                                <el-table-column label="Type" prop="type"></el-table-column>
                                <el-table-column label="Name" prop="name"></el-table-column>
                                <el-table-column
                                        align="right">
                                    <template slot-scope="scope">
                                        <el-button size="mini" @click="editStructAttr(scope.$index, scope.row,2)">Edit
                                        </el-button>
                                        <el-button size="mini" type="danger"
                                                   @click="deleteStructAttr(scope.$index, scope.row,2) ">Delete
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <i class="el-icon-circle-plus-outline" @click="openStructAttrDia(2)"></i>

                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="数据流函数体" name="second">
                    <codemirror ref="flowCode" :value="curCode" :options="cmOptions"></codemirror>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleList.splice(NodeType.FlowNode,1,false) ">取 消</el-button>
                <el-button type="danger" @click="deleteNode()">删 除</el-button>
                <el-button type="primary" @click="saveEditNode()">确 定</el-button>
            </div>
        </el-dialog>
        <!--            子图节点弹窗-->
        <el-dialog title="子图节点信息编辑" :visible.sync="dialogVisibleList[NodeType.SubGraphNode]"
                   :close-on-click-modal=false>
            <el-form>
                <el-form-item label="子图名">
                    <el-input v-model="curNode.name"></el-input>
                </el-form-item>
                <el-form-item label="输入参数列表">
                    <el-table
                            :data="curNode.inputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                        <el-table-column
                                align="right">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="editStructAttr(scope.$index, scope.row,1)">Edit
                                </el-button>
                                <el-button size="mini" type="danger"
                                           @click="deleteStructAttr(scope.$index, scope.row,1) ">Delete
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <i class="el-icon-circle-plus-outline" @click="openStructAttrDia(1)"></i>
                </el-form-item>
                <el-form-item label="输出参数列表">
                    <el-table
                            :data="curNode.outputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                        <el-table-column
                                align="right">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="editStructAttr(scope.$index, scope.row,2)">Edit
                                </el-button>
                                <el-button size="mini" type="danger"
                                           @click="deleteStructAttr(scope.$index, scope.row,2) ">Delete
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <i class="el-icon-circle-plus-outline" @click="openStructAttrDia(2)"></i>

                </el-form-item>
                <el-form-item label="查看子图结构">
                    <el-button @click="EditSubGap()">修改子图结构</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleList.splice(NodeType.SubGraphNode,1,false)">取 消</el-button>
                <el-button type="danger" @click="deleteNode()">删 除</el-button>
                <el-button type="primary" @click="saveEditNode()">确 定</el-button>
            </div>

        </el-dialog>

        <!--        侧边栏，记录模拟节点-->
        <el-aside width="180px" id="node-list">
            <div class="box-card">
                <div class="node-list-title">
                    <span>结构体列表</span>
                    <i class="el-icon-circle-plus-outline" style="padding-left: 10px"
                       @click="editNode(NodeType.StructNode,true)"></i>
                </div>
                <div class="card-body">
                    <div class="card-body" v-for="(item,index) in nodeList[0]" :key="index">
                        <div class="item" :data-icon="item.icon" :data-name="item.name" :data-type="item.type"
                             :data-typeId="item.id" @click="editNode(NodeType.StructNode,false,index)">
                            <i :class="[item.icon,item.type]"></i>
                            <span class="text">{{item.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-card">
                <div class="node-list-title">
                    <span>函数列表</span>
                    <i class="el-icon-circle-plus-outline" style="padding-left: 10px"
                       @click="editNode(NodeType.FlowNode,true)"></i>
                </div>
                <div class="card-body">
                    <div class="card-body" v-for="(item,index) in nodeList[1]" :key="index">
                        <div class="item canDraggable" :data-icon="item.icon" :data-name="item.name"
                             :data-type="item.type"
                             :data-typeId="item.id" @click="editNode(NodeType.FlowNode,false,index)">
                            <i :class="[item.icon,item.type]"></i>
                            <span class="text">{{item.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-card">
                <div class="node-list-title">
                    <span>子图列表</span>
                    <i class="el-icon-circle-plus-outline" style="padding-left: 10px"
                       @click="editNode(NodeType.SubGraphNode,true)"></i>
                </div>
                <div class="card-body">
                    <div class="card-body" v-for="(item,index) in nodeList[2]" :key="index">
                        <div class="item canDraggable" :data-icon="item.icon" :data-name="item.name"
                             :data-type="item.type"
                             :data-typeId="item.id" @click="editNode(NodeType.SubGraphNode,false,index)">
                            <i :class="[item.icon,item.type]"></i>
                            <span class="text">{{item.name}}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="box-card">
                <div class="node-list-title">
                    <span>图参数列表</span>
                </div>
                <div v-if="curChartData == null || curChartData.inputs == null || curChartData.outputs == null ||
                (curChartData.inputs.length == 0 && curChartData.outputs.length == 0)">
                </div>
                <div v-else>
                    <div class="param-list-title">输入参数</div>
                    <div v-if="curChartData.inputs.length == 0">
                        <el-link type="danger" :underline="false">该图暂无输入参数</el-link>
                    </div>
                    <div class="card-body" v-for="(item,index) in curChartData.inputs" :key="'inputs' + index" v-else>
                        <div class="paramsItem">
                            <i class="el-icon-table-lamp"></i>
                            <el-link class="paramsType" type="danger" :underline="false">{{item.type}}</el-link>
                            <el-link type="info" :underline="false">{{item.name}}</el-link>
                        </div>
                    </div>
                    <div class="param-list-title">输出参数</div>
                    <div v-if="curChartData.outputs.length == 0">
                        <el-link type="danger" :underline="false">该图暂无输出参数</el-link>
                    </div>
                    <div class="card-body" v-for="(item,index) in curChartData.outputs" :key="'outputs' + index" v-else>
                        <div class="paramsItem">
                            <i class="el-icon-table-lamp"></i>
                            <el-link class="paramsType" type="danger" :underline="false">{{item.type}}</el-link>
                            <el-link type="info" :underline="false">{{item.name}}</el-link>
                        </div>
                    </div>
                </div>
            </div>
        </el-aside>
        <!--        主要工作区-->
        <el-container>
            <el-header>
                <v-tags :tagsList="tagsList"></v-tags>
                <div id="btn-group">
                    <el-button-group>
                        <el-tooltip class="item" effect="dark" content="生成代码" placement="bottom-end">
                            <el-button type="primary" icon="el-icon-edit" @click="generateCode()"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="清空" placement="bottom-end">
                            <el-button type="primary" icon="el-icon-delete" @click="cleanOut()"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="保存进度为文件" placement="bottom-end">
                            <el-button type="primary" icon="el-icon-download" @click="exportData()"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="上传进度文件" placement="bottom-end">
                            <el-upload
                                    class="upload-item"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list=false
                                    :limit="1"
                                    accept=".json"
                                    :before-upload="beforeUpload"
                                    :on-exceed="handleExceed"
                                    :on-success="handleUpload"
                                    :file-list="fileList">
                                <el-button type="primary" icon="el-icon-upload2"></el-button>
                            </el-upload>
                        </el-tooltip>
                    </el-button-group>
                </div>
            </el-header>
            <el-main id="scrollMain">
                <!--            按钮区-->

                <div id="node-place" style="height: 100%">
                    <!--                <PaintArea></PaintArea>-->
                    <keep-alive>
                        <router-view :nodeList="nodeList" :chartData="curChartData" :key="randomKey()"></router-view>
                    </keep-alive>
                </div>
            </el-main>
        </el-container>


    </el-container>

</template>

<script>
    import $ from 'jquery'
    import vTags from "@/components/common/Tags";
    import 'jsplumb'
    import bus from "@/components/common/Bus";

    const NodeType = {
        StructNode: 0,      // 结构体节点
        FlowNode: 1,        // 流节点
        SubGraphNode: 2,    // 子图节点
        OnlyOutputNode: 3,   // 只能接受出边
        OnlyInputNode: 4,    // 只能接受入边
    };
    export default {
        name: "edit",
        watch: {
            $route(newValue, oldValue) {
                // this.setTags(newValue);
                // console.log("route change:", newValue)
                if (newValue == null) {
                    this.$message.error("路由错误")
                    console.log("error route", newValue)
                    return
                }
                if (newValue.matched.length != 3 || newValue.matched[1].path != "/edit")
                    return
                // console.log("get params:", newValue.params)
                if (newValue.params != null)
                    this.currentGapId = newValue.params.pathMatch
            }
        },
        data() {
            return {
                NodeType,
                tagsList: [],
                jsp: null,                                  // jsplumb对象
                chartData: {
                    id: 'mainGap',
                    nodes: [],
                    connections: [],
                    name: 'mainGap'
                },
                cmOptions: {
                    mode: "text/x-csrc",
                    theme: "colorforth",
                    lineNumbers: true,
                    line: true,
                    tabSize: 4,
                    matchBrackets: true,// 匹配结束符号，比如"]、}"
                    autoCloseBrackets: true, // 自动闭合符号
                    autoCloseTags: true,
                    lineWrapping: true,
                    extraKeys: {"Ctrl-Space": "autocomplete"}
                },
                // 节点编辑相关数据
                dialogVisibleList: [false, false, false],                      // 编辑框可见性列表，0=> 结构体，1=> 函数，2=> 子图
                structNodeDialogVisible: false,             // 结构体节点编辑框
                flowNodeDialogVisible: false,               // 数据流节点编辑框
                subGapDialogVisible: false,                 // 子图节点编辑框
                innerVisible: false,                        // 内部属性编辑框
                isNewNode: false,                           // 编辑的节点是否为新节点
                curNode: {},                                // 当前编辑的节点
                curAttr: {
                    type: "",
                    name: ""
                },
                curEditAttrType: 0,                         // 当前编辑的节点属性，0：attrs,1:inputs,2:outputs
                curNodeIndex: -1,                           // 当前编辑的节点在nodes数组中的下边
                curCode: '',
                activeTab: 'second',
                typeList: [
                    "void", "int", "string", "long", "short", "char"
                ],                                          // 当前可用的节点类型数组
                list: [
                    {
                        icon: "el-icon-menu",
                        name: "结构体节点",
                        type: NodeType.StructNode,
                        attrs: [{
                            type: "int", name: "jiumi"
                        }]
                    },
                    {
                        icon: "el-icon-star-on",
                        name: "数据流节点",
                        type: NodeType.FlowNode,
                        inputs: [],
                        outputs: []
                    },
                    {
                        icon: "el-icon-location",
                        name: "子图节点",
                        type: NodeType.SubGraphNode,
                        inputs: [],
                        outputs: [],
                        chartData: {}
                    }
                ],
                nodeList: [[], [], []],                        // 编辑的节点列表，0=> 结构体，1=> 函数，2=> 子图
                funcList: [],
                structList: [],
                subGraphList: [],
                currentGapId: 'mainGap',                        // 当前编辑的图ID，一个id对应一个路由
                fileList: [],
                errorNodes: [],                                 // 记录判断后出错的节点
                loading: false,                                 //
            }
        },
        computed: {
            // 加几个需要实时计算的变量，比如位置
            nodeListRight() {
                return $("#node-list")[0].getBoundingClientRect().right
            }
            ,
            nodeListTop() {
                return $("#node-list")[0].getBoundingClientRect().top
            }
            ,
            nodeListBottom() {
                return $("#node-list")[0].getBoundingClientRect().bottom
            }
            ,
            paintAreaLeft() {
                return $("#paint-area")[0].getBoundingClientRect().left
            }
            ,
            paintAreaRight() {
                return $("#paint-area")[0].getBoundingClientRect().right
            },
            codeMirrorInstance() {
                return this.$refs.myCode;
            },
            curChartData: {
                get() {
                    // let res = this.getCurGap(this.chartData)
                    let res = this.getCurGap()
                    // console.log("res:", res)
                    return res;
                }
            }

        },
        mounted() {
            // console.log("nodes:", this.chartData.nodes);
            const _self = this;
            // 注册一个删除子图节点触发的删除tag的时间
            bus.$on('delete_tag', (tagId) => {
                // console.log("delete_tag", tagId)
                for (let i = 0; i < this.tagsList.length; i++) {
                    if (this.tagsList[i].path == "/edit/" + tagId) {
                        this.closeTag(i)
                        break
                    }
                }
            })
            // 根据index删除tag
            bus.$on("delete_tag_with_index", tagIndex => {
                if (tagIndex >= 0 && tagIndex < this.tagsList.length)
                    this.closeTag(tagIndex)
            })
            // 删除多个tags
            bus.$on("delete_tags", command => {
                if (command == "other") {
                    const curItem = this.tagsList.filter(item => {
                        console.log(item.path)
                        return this.$route.fullPath === item.path
                    })
                    this.tagsList = curItem
                } else if (command == "all") {
                    this.tagsList = []
                    this.$router.push("/edit/mainGap")
                }
            })
            // 给属性添加使用标记
            bus.$on('add_conn', (type, typeId, isInput, attrIndex) => {
                // 虚拟的input和output节点不需要做属性标记
                if (type == NodeType.OnlyOutputNode || type == NodeType.OnlyInputNode) {
                    return
                }
                for (let i = 0; i < this.nodeList[type].length; i++) {
                    // 输出参数是作为边的输入端，所以是输入端，需要修改的就是输出数组
                    if (this.nodeList[type][i].id == typeId) {
                        if (isInput) {
                            this.nodeList[type][i].outputs[attrIndex].useCount++
                        } else {
                            this.nodeList[type][i].inputs[attrIndex].useCount++
                        }
                    }
                }
            })
            bus.$on('delete_conn', (type, typeId, isInput, attrIndex) => {
                for (let i = 0; i < this.nodeList[type].length; i++) {
                    if (this.nodeList[type][i].id == typeId) {
                        if (isInput) {
                            this.nodeList[type][i].outputs[attrIndex].useCount--
                        } else {
                            this.nodeList[type][i].inputs[attrIndex].useCount--
                        }
                    }
                }
            })
        },
        methods: {
            // 添加新节点，函数，结构体或子图
            // type: 节点类型， isNew：是否为新增节点
            editNode(type, isNew, curNodeIndex) {
                let _self = this;
                _self.curNodeIndex = -1;
                _self.isNewNode = isNew
                if (isNew) {
                    let randomId = this.randomString(6)
                    _self.curNode = {
                        // 每种节点都有一个唯一的id指示
                        id: randomId,
                        type: type,     // 节点类型：数据流节点，子图节点，结构体节点
                        name: "",
                        inputs: [],
                        outputs: [],
                        attrs: [],
                        nodes: [],
                        connections: [],
                        code: "",
                        icon: "el-icon-place"
                    }
                } else {
                    if (curNodeIndex < 0 || curNodeIndex >= _self.nodeList[type].length) {
                        _self.$message.error("参数错误")
                        return
                    }
                    _self.curNodeIndex = curNodeIndex
                    _self.curNode = JSON.parse(JSON.stringify(_self.nodeList[type][curNodeIndex]))
                }
                if (type < NodeType.StructNode || type > NodeType.SubGraphNode) {
                    _self.$message.error("类型错误")
                    return
                }
                if (type == NodeType.StructNode) {
                    if (isNew) {
                        _self.curNode.name = "struct_" + _self.randomString(6)
                    } else {
                        _self.setCodeMirrorValue(_self.$refs.structCode, _self.curNode.code);
                    }
                } else if (type == NodeType.FlowNode) {
                    if (isNew) {
                        _self.curNode.name = "func_" + _self.randomString(6)
                        _self.curNode.returnType = "void"
                    } else {
                        _self.setCodeMirrorValue(_self.$refs.flowCode, _self.curNode.code);

                    }
                    _self.activeTab = 'second'
                } else if (type == NodeType.SubGraphNode) {
                    if (isNew) {
                        _self.curNode.name = "subGraph_" + _self.randomString(6)
                    }
                }
                _self.dialogVisibleList.splice(_self.curNode.type, 1, true)

            },
            // 打开属性修改dialog
            openStructAttrDia: function (type) {
                this.curAttr = {type: "", name: "", isNew: true, useCount: 0};
                this.innerVisible = true
                this.curEditAttrType = type
            },
            // 增加节点属性，attr:{type:'',name:''}
            addStructAttr: function () {
                // this.$message.success("添加节点属性")
                let attrs = []
                if (this.curEditAttrType == 0) {
                    attrs = this.curNode.attrs;
                } else if (this.curEditAttrType == 1) {
                    attrs = this.curNode.inputs;
                } else if (this.curEditAttrType == 2) {
                    attrs = this.curNode.outputs;
                } else {
                    this.$message.error("参数错误")
                }
                if (this.curAttr.type != "" && this.curAttr.name != "") {
                    // 先做一下变量名是否重复判定
                    // 重复的情况：
                    //      新增节点属性： 已有同名属性
                    //      修改节点属性： 不同下标已有同名属性
                    let item = attrs.find((item, index) => {
                        return (this.curAttr.isNew && item.name == this.curAttr.name) ||
                            (this.editIndex != index && item.name == this.curAttr.name)
                    })
                    if (typeof (item) != "undefined") {
                        this.$message.error("变量名已存在")
                        return
                    }
                    // console.log("this.curAttr:", this.curAttr)
                    // console.log("this attrs:", attrs)
                    if (this.curAttr.isNew) {
                        attrs.push(this.curAttr)
                        // console.log("this.curAttr:", this.curAttr)
                        // console.log("this attrs:", attrs)
                        // console.log("this node:", this.curNode)
                    } else {

                        if (this.editIndex >= 0 && this.editIndex < attrs.length) {
                            // 如果修改了属性的类型，那么需要先判断是否有边使用过该属性
                            if (attrs[this.editIndex].type != this.curAttr.type && attrs[this.editIndex].useCount > 0) {
                                this.$message.info("该属性有边使用中，暂不能修改类型")
                                return;
                            }
                            attrs.splice(this.editIndex, 1, this.curAttr)
                            // this.curNode.attrs[this.editIndex] = this.curAttr
                        } else {
                            this.$message.error("参数错误，保存失败")
                            return
                        }
                    }
                }
                this.innerVisible = false;
                // console.log(this.curNode)
            },
            // 删除属性
            deleteStructAttr: function (index, row, type) {
                this.$confirm('是否删除该参数?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (type == 0) {
                        this.curNode.attrs.splice(index, 1)
                    } else if (type == 1) {
                        if (this.curNode.inputs[index].useCount > 0) {
                            this.$message.info("该参数有边使用，请先删除该边")
                            return
                        }
                        this.curNode.inputs.splice(index, 1)
                    } else if (type == 2) {
                        if (this.curNode.outputs[index].useCount > 0) {
                            this.$message.info("该参数有边使用，请先删除该边")
                            return
                        }
                        this.curNode.outputs.splice(index, 1)
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
                // console.log(index,row)
            },
            // 编辑属性
            editStructAttr: function (index, row, type) {
                if (typeof (row) == "undefined") {
                    this.$message.error("参数错误")
                    return
                }
                this.curAttr = {type: row.type, name: row.name, isNew: false, useCount: row.useCount}
                this.innerVisible = true;
                this.curEditAttrType = type
                this.editIndex = index
            },
            // 保存正在编辑的节点
            // Todo: 这里要有修改的节点的属性已经被使用后的判断，还没写
            saveEditNode() {
                let _self = this

                this.$confirm('是否保存节点信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // console.log("curNodeIndex:", _self.curNodeIndex)
                    // console.log(_self.nodeList[_self.curNode.type])
                    if (_self.curNodeIndex < 0 && _self.curNodeIndex >= _self.nodeList[_self.curNode.type].length) {
                        _self.$message.error("参数错误")
                        console.log("error")
                        _self.dialogVisibleList.splice(_self.curNode.type, 1, false);
                        return
                    }
                    // console.log(_self.curNode)
                    // console.log(_self.curNodeIndex)
                    // console.log(_self.chartData.nodes[_self.curNodeIndex])
                    // 新添加的节点
                    if (_self.isNewNode) {
                        // 结构体节点要加到typeList数组中
                        if (_self.curNode.type == NodeType.StructNode) {
                            let hasThisType = _self.typeList.find(item => item == _self.curNode.name)
                            if (hasThisType) {
                                this.$message.info("该类型已存在")
                                return
                            } else {
                                _self.typeList.push(_self.curNode.name)
                            }
                            _self.curNode.code = _self.$refs.structCode.codemirror.getValue();
                            _self.setCodeMirrorValue(_self.$refs.structCode, '');
                        } else if (_self.curNode.type == NodeType.FlowNode) {
                            if (_self.curNode.returnType == null) {
                                _self.$message.info("函数返回值未填写")
                                return
                            }
                            _self.curNode.code = _self.$refs.flowCode.codemirror.getValue();
                            _self.setCodeMirrorValue(_self.$refs.flowCode, '');

                        } else if (_self.curNode.type == NodeType.SubGraphNode) {
                            // 子图节点需要加一下两个预设节点
                            let id = _self.$jsPlumbUtil.uuid();
                            let inputNode = {
                                id,
                                icon: "el-icon-rank",
                                type: NodeType.OnlyOutputNode,  // 区分子图还是数据流节点
                                typeId: _self.curNode.id,
                                name: "input",

                                inputs: [],
                                nodeStyle: {
                                    top: "60px",
                                    left: "40px"
                                },
                                outputs: _self.curNode.inputs
                            }
                            id = _self.$jsPlumbUtil.uuid();
                            let outputNode = {
                                id,
                                icon: "el-icon-rank",
                                type: NodeType.OnlyInputNode,  // 区分子图还是数据流节点
                                typeId: _self.curNode.id,
                                name: "output",
                                nodeStyle: {
                                    top: "60px",
                                    left: "460px"
                                },
                                inputs: [],
                                outputs: _self.curNode.inputs
                            }
                            _self.curNode.nodes.push(inputNode)
                            _self.curNode.nodes.push(outputNode)
                        }
                        _self.nodeList[_self.curNode.type].push(_self.curNode)
                    } else {    // 编辑的节点
                        if (_self.curNode.type == _self.NodeType.StructNode) {
                            let thisTypeIndex = _self.typeList.findIndex(item => item == _self.curNode.name)
                            // 假如修改了姓名
                            // Todo: 这里要加一下如果参数已经使用了该结构体的判断
                            if (thisTypeIndex != -1) {
                                _self.typeList.splice(thisTypeIndex, 1, _self.curNode.name)
                            }
                        }
                        _self.nodeList[_self.curNode.type].splice(_self.curNodeIndex, 1, _self.curNode)
                        if (_self.curNode.type == _self.NodeType.StructNode) {
                            _self.nodeList[_self.curNode.type][_self.curNodeIndex].code = _self.$refs.structCode.codemirror.getValue();
                            _self.setCodeMirrorValue(_self.$refs.structCode, '');
                        } else if (_self.curNode.type == _self.NodeType.FlowNode) {
                            console.log("curCode:", _self.$refs.flowCode.codemirror.getValue())
                            _self.nodeList[_self.curNode.type][_self.curNodeIndex].code = _self.$refs.flowCode.codemirror.getValue();
                            _self.setCodeMirrorValue(_self.$refs.flowCode, '');
                        }

                    }
                    // console.log("curNode type:", _self.curNode.type)
                    // console.log(_self.dialogVisibleList);
                    // console.log(_self.chartData.nodes[_self.curNodeIndex])
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    _self.dialogVisibleList.splice(_self.curNode.type, 1, false)

                }).catch(() => {
                });
            },
            setCodeMirrorValue(codemirrorObj, code) {
                if (typeof (codemirrorObj) == "undefined") {
                    // console.log("undefined")
                    return
                }
                codemirrorObj.codemirror.setValue(code)
                setTimeout(() => {
                    codemirrorObj.codemirror.refresh();
                }, 1)
            },
            // 删除节点：删除节点，删除相关边，删除相关的tag
            deleteNode() {
                let _self = this;
                if (_self.curNodeIndex < 0) {
                    _self.$message.info("新建节点中")
                    return
                }
                this.$confirm('删除后不可撤回，是否删除该节点?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    if (_self.curNodeIndex < 0 && _self.curNodeIndex >= _self.nodeList[_self.curNode.type].length) {
                        _self.$message.error("参数错误")
                        _self.structNodeDialogVisible = false
                        return
                    }
                    // 这里传递一下删除节点事件，让绘制面板中的相关节点都配合删除
                    // bus.$emit("delete_node", _self.curNode.id)
                    // 在主图和子图中删除相关节点
                    this.chartData.nodes = this.chartData.nodes.filter((item) => {
                        return item.typeId != _self.curNode.id
                    })
                    this.chartData.connections = this.chartData.connections.filter((item) => {
                        return item.sourceTypeId != _self.curNode.id && item.targetTypeId != _self.curNode.id
                    })
                    for (let i = 0; i < _self.nodeList[NodeType.SubGraphNode].length; i++) {
                        _self.nodeList[NodeType.SubGraphNode][i].nodes = _self.nodeList[NodeType.SubGraphNode][i].nodes.filter(item => {
                            return item.typeId != _self.curNode.id
                        })
                        _self.nodeList[NodeType.SubGraphNode][i].connections = _self.nodeList[NodeType.SubGraphNode][i].connections.filter(item => {
                            return item.sourceTypeId != _self.curNode.id && item.targetTypeId != _self.curNode.id
                        })
                    }

                    if (_self.curNode.type == NodeType.StructNode) {
                        _self.structNodeDialogVisible = false;
                    } else if (_self.curNode.type == NodeType.FlowNode) {
                        _self.flowNodeDialogVisible = false;
                    } else if (_self.curNode.type == NodeType.SubGraphNode) {
                        _self.subGapDialogVisible = false;
                        for (let i = 0; i < this.tagsList.length; i++) {
                            if (this.tagsList[i].path == "/edit/" + _self.curNode.id) {
                                this.closeTag(i)
                                break
                            }
                        }
                    }
                    _self.nodeList[_self.curNode.type].splice(_self.curNodeIndex, 1);
                    _self.dialogVisibleList.splice(_self.curNode.type, 1, false);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                });
            },
            setTags(route) {
                // console.log("get route:", route)
                // console.log("")
                let isExist = this.tagsList.some(item => {
                    return item.path == route
                })
                if (!isExist) {
                    // 做一下长度限制
                    if (this.tagsList.length >= 20)
                        this.tagsList.shift()
                    this.tagsList.push({
                        title: "子图_" + this.tagsList.length,
                        path: route,
                        name: route
                    })
                    // console.log("set tagList:", this.tagsList)
                }
            },
            getCurGap() {
                // console.log("get curGap nodeList: ", this.nodeList)
                // 主图则直接返回
                if (this.currentGapId == "mainGap")
                    return this.chartData
                for (let index in this.nodeList[NodeType.SubGraphNode]) {
                    let item = this.nodeList[NodeType.SubGraphNode][index]
                    // console.log(item)
                    if (item.id == this.currentGapId) {
                        return item
                    }
                }
                return null
            },
            // 编辑子图，即弹开子图编辑页面
            EditSubGap() {
                let _self = this;
                if (_self.curNode == null || _self.curNode.type != _self.NodeType.SubGraphNode) {
                    _self.$message.error("非子图节点，或节点无效")
                    // console.log("curNode:", _self.curNode)
                }
                let haveThisSubGap = _self.nodeList[NodeType.SubGraphNode].find(item => {
                    return item.id == _self.curNode.id
                })
                if (!haveThisSubGap) {
                    this.$message.info("请先保存节点")
                    return
                }
                if (_self.$route.fullPath == "/edit/" + _self.curNode.id) {
                    return
                }
                // 这里直接把子图节点传过去吧
                _self.setTags("/edit/" + _self.curNode.id)
                _self.currentGapId = _self.curNode.id
                this.$router.push("/edit/" + _self.curNode.id)
                // bus.$emit('edit_sub_gap', _self.curNode)
                this.dialogVisibleList.splice(NodeType.SubGraphNode, 1, false);
            },

            // 清空图数据
            cleanCurGap(chartData, newValue) {
                // 主图则直接返回
                if (this.currentGapId == "mainGap") {
                    this.chartData.nodes = []
                    this.chartData.connections = []
                    this.tagsList = []
                }
                let resGap = null
                if (chartData == null || chartData.nodes == null) {
                    // console.log("chartData is null", chartData, " currentGapId", this.currentGapId)
                    return
                }
                for (let index in chartData.nodes) {
                    let item = chartData.nodes[index]
                    // console.log(item)
                    if (item.type == NodeType.SubGraphNode) {
                        if (item.id == this.currentGapId) {
                            item.nodes = []
                            item.connections = []
                            break;
                        } else {
                            this.getCurGap(item, newValue)
                        }
                    }
                }
                return null
            },
            // 生成随机字符串，最大长度为32位
            randomString(length) {
                length = length || 32;
                let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
                    a = t.length,
                    n = "";
                for (let i = 0; i < length; i++)
                    n += t.charAt(Math.floor(Math.random() * a));
                return n
            },
            randomKey() {
                return this.$route.path + this.randomString(3)
            },
            cleanOut() {
                let _self = this;
                this.$confirm('是否清空该图?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除区分主图和子图，删除的数据不同，删除的都包括两部分，一部分为jsp中记录的数据
                    // 一部分为我们自己保存下来的在nodes数组和connection数组中的数据
                    // 主图删除 chartdata 中的数据
                    if (_self.currentGapId == "mainGap") {
                        _self.chartData.nodes.forEach(item => {
                            bus.$emit("delete_node_in_jsp", item.id)
                        })
                        _self.chartData.nodes = []
                        _self.chartData.connections = []
                    } else {            // 子图删除nodeList中的数据
                        _self.nodeList[NodeType.SubGraphNode].forEach(item => {
                            if (item.id == _self.currentGapId) {
                                item.nodes.forEach(node => {
                                    bus.$emit("delete_node_in_jsp", item.id)
                                })
                                item.nodes = []
                                item.connections = []
                                _self.tagsList = _self.tagsList.filter(tag => {
                                    return tag != _self.currentGapId
                                })
                            }
                        })
                    }
                    _self.$message.success("已清空该图")
                }).catch(() => {
                    _self.$message.info("已取消")
                })

            },
            // 删除jsplumb中的线
            exportData() {
                let _self = this;
                this.$prompt('请输入保存的文件名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(({value}) => {
                    //定义文件内容，类型必须为Blob 否则createObjectURL会报错
                    let content = new Blob([window.btoa(JSON.stringify({
                        chartData: this.chartData,
                        nodeList: this.nodeList
                    }))])

                    //生成url对象
                    let urlObject = window.URL || window.webkitURL || window
                    let url = urlObject.createObjectURL(content)
                    //生成<a></a>DOM元素
                    let el = document.createElement('a')
                    //链接赋值
                    el.href = url
                    if (value == null || value == "")
                        value = "nodeInfo_" + Math.ceil(Math.random() * 10000)
                    el.download = value + ".json"
                    // console.log(fileName)
                    //必须点击否则不会下载
                    el.click()
                    //移除链接释放资源
                    urlObject.revokeObjectURL(url)
                }).catch(() => {
                })
            },
            beforeUpload(file) {
                this.loading = true;
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            handleUpload(res, file, fileList) {
                this.$confirm('是否保存使用上传的数据替代当前编辑的数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    let reader = new FileReader()
                    reader.readAsText(file.raw)
                    reader.onload = ((e) => {
                        let _self = this;
                        try {
                            let tempRes = JSON.parse(window.atob(e.target.result))
                            // todo  这里先简单判断，之后写判断函数
                            if (tempRes.chartData == null || tempRes.nodeList == null) {
                                _self.$message.error("文件格式有误")
                            } else {
                                _self.chartData = tempRes.chartData
                                _self.nodeList = tempRes.nodeList
                                //_self.curNode = null
                                // _self.$router.push("/edit/mainGap")
                                // 成功后重置tagsList
                                this.tagsList = []
                            }
                        } catch (error) {
                            _self.$message.error("文件解析有误")
                        }
                        // 清空上传的文件列表和
                        this.fileList = []

                    })
                }).catch(() => {

                })
                this.loading = false
            },
            // BFS,返回连通子图块数,参数为节点+邻接表格式的边列表,这个BFS有点不同，
            // 这里会将有向图当做无向图来做BFS，因此使用边列表和反向边一起BFS
            BFS(nodes, conns, diffConns) {
                // console.log("get node:",nodes)
                // console.log("get conn:", conns)
                // console.log("get diffConn:", diffConns)
                let visitedNodes = new Object()
                let count = 0
                // 这里做一下预处理，将结构体节点排除出去，因为结构体节点是不带边的
                for (let index in nodes) {
                    if (nodes[index].type == this.NodeType.OnlyInputNode || nodes[index].type == this.NodeType.OnlyOutputNode) {
                        visitedNodes[nodes[index].id] = 1
                    }
                }
                for (; ; count++) {
                    let index = 0
                    let hasFind = false
                    for (index in nodes) {
                        if (visitedNodes[nodes[index].id] == null) {
                            hasFind = true;
                            break
                        }
                    }
                    // 找不到未标记的节点说明，所有节点都已标记，已完成遍历
                    if (!hasFind)
                        break;
                    let queue = new Array()
                    queue.push(nodes[index].id)
                    // 这里的BFS需遍历有向图的边和反向边
                    while (queue.length != 0) {
                        let nodeId = queue.shift()
                        visitedNodes[nodeId] = 1
                        // console.log("get node:",nodeId)
                        let connArr = conns[nodeId]
                        for (let key in connArr) {
                            if (visitedNodes[connArr[key]] == null)
                                queue.push(connArr[key])
                        }
                        let diffConnArr = diffConns[nodeId]
                        for (let key in diffConnArr) {
                            if (visitedNodes[diffConnArr[key]] == null)
                                queue.push(diffConnArr[key])
                        }
                    }
                }
                console.log("get count:", count)
                return count
            },
            // 判断连线的合法性,包括每一个子图都需要检查
            judgeConnectionLegality(chartData) {
                // console.log("get judge data:", chartData)
                // let _self = this;
                if (chartData == null || chartData.nodes == null || chartData.nodes.length == 0) {
                    return true
                }
                let connLegal = true
                // 这里要判断边是否携带参数信息，不携带则认为是无效边
                chartData.connections.every((item, index, array) => {
                    // console.log(item); //返回1,2
                    if (typeof item.attrs == "undefined" || item.attrs.length == 0) {
                        setTimeout(() => {
                            this.$message.info("有边不携带参数信息")
                        }, 1)
                        connLegal = false
                    }
                    return connLegal
                })
                if (!connLegal)
                    return false;
                // 这里原本边的存储是一对一对存储的，这里用邻接表存储下边信息，以及记录入度，便于后面做拓扑排序
                // 记录边信息的邻接表
                let conns = new Object()
                // 记录反向边的邻接表
                let diffConns = new Object()
                // 记录入度
                let inputs = new Object()
                let stack = new Array()
                for (let index in chartData.connections) {
                    let conn = chartData.connections[index]
                    // console.log("get conn:", conn.sourceId, conn.sourceId)
                    if (conns[conn.sourceId] == null)
                        conns[conn.sourceId] = new Array();
                    if (diffConns[conn.targetId] == null)
                        diffConns[conn.targetId] = new Array();
                    if (inputs[conn.targetId] == null)
                        inputs[conn.targetId] = 0
                    if (inputs[conn.sourceId] == null)
                        inputs[conn.sourceId] = 0
                    conns[conn.sourceId].push(conn.targetId)
                    diffConns[conn.targetId].push(conn.sourceId)
                    inputs[conn.targetId] += 1
                }
                // console.log("get conns:", conns)
                // 使用BFS判断连通片个数
                let connectionCount = this.BFS(chartData.nodes, conns, diffConns)
                if (connectionCount > 1) {
                    this.$message.error("该图未连成一个完整的图，请补充边信息")
                    return false;
                }
                // 使用拓扑排序判断是否成环
                for (let key in inputs) {
                    if (inputs[key] == 0) {
                        stack.push(key)
                    }
                }
                while (stack.length != 0) {
                    // 获取入度为0的点
                    let sourceId = stack.shift();
                    let connArr = conns[sourceId]
                    for (let index in connArr) {
                        let targetId = connArr[index]
                        inputs[targetId] -= 1;
                        if (inputs[targetId] == 0) {
                            stack.push(targetId)
                        }
                    }
                }
                // 若拓扑排序后还有入度非0的节点，说明成环了，此时说明代码不合规范
                for (let key in inputs) {
                    if (inputs[key] > 0) {
                        this.errorNodes.push(key)
                    }
                }
                // 若错误节点列表有数据，说明不符合规范（成环），直接退出
                if (this.errorNodes.length > 0) {
                    setTimeout(() => {
                        this.$message.info("图成环，请检查")
                    }, 1)
                    return false;
                }

                return true;


            },
            // 生成代码函数，先进行连线可用性判断，再上传至后台进行代码文件生成
            generateCode() {
                let _self = this;
                this.errorNodes = []
                if (this.chartData.nodes == null || this.chartData.nodes.length == 0) {
                    this.$message.info("图为空")
                    return
                }
                let timeBefore = new Date()
                let judgeRes = this.judgeConnectionLegality(this.chartData)
                for (let i = 0; i < this.nodeList[NodeType.SubGraphNode].length && judgeRes; i++) {
                    judgeRes &= this.judgeConnectionLegality(this.nodeList[NodeType.SubGraphNode][i])
                }
                let timeAfter = new Date()
                console.log("judge time:", timeAfter.getTime() - timeBefore.getTime(), " ms")
                console.log("judge res: ", judgeRes)
                if (judgeRes) {
                    // this.$message.success("检测通过")
                    this.axios.post('/dfcCode/generateCode', {
                        chartData: this.chartData,
                        nodeList: this.nodeList
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        // console.log("response:", response)
                        let fileName = "dfcCode_" + this.getNowTimeStr() + ".dfc"
                        _self.downloadFile("/api/fileOpera/downloadFile", response.data["dfcCode"],)
                        _self.downloadFile("/api/fileOpera/downloadFile", response.data["graphCode"],)
                        _self.$message.success("生成代码成功")
                    }).catch(error => {
                        // console.log("error: ", error)
                        _self.$message.error("生成代码失败")
                    })
                } else {
                    setTimeout(() => {
                        this.$message.error("检测未通过")
                    }, 1)
                }
            },
            closeTag(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                } else {
                    this.$router.push('/edit/mainGap');
                }
            },
            getNowTimeStr() {
                let date = new Date();
                let month = date.getMonth() < 9 ? "0" : ""
                month += (date.getMonth() + 1)
                let day = date.getDate() < 10 ? "0" : ""
                day += date.getDate()
                let hour = date.getHours() < 10 ? "0" : ""
                hour += date.getHours()
                let minute = date.getMinutes() < 10 ? "0" : ""
                minute += date.getMinutes()
                let second = date.getSeconds() < 10 ? "0" : ""
                second += date.getSeconds()
                return date.getFullYear() + "-" + month + "-" + day + "_"
                    + hour + "-" + minute + "-" + second
            },
            // 使用iFrame来模拟文件下载，使用a标签会导致连续下载出错
            downloadFile(url, fileName) {

                const iframe = document.createElement("iframe");
                iframe.style.display = "none"; // 防止影响页面
                iframe.style.height = 0; // 防止影响页面
                iframe.src = url + "?fileName=" + fileName;
                document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
                iframe.click()
                // 1分钟以后删除
                setTimeout(() => {
                    iframe.remove();
                }, 1 * 60 * 1000);

            }
        },
        components: {
            vTags
        }

    }
</script>

<style lang="scss" scoped>
    .container {
        height: 100%;
        width: 100%;
        padding: 20px;
        border-radius: 10px;
        box-shadow: #353535 0px 0px 1px;

    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
    }

    .el-main {
        position: relative;
    }

    .workplace {
        width: 100%;
        height: 100%;
        position: relative;
    }

    #start {
        top: 50px;
        left: 50px;
    }

    #btn-group {
        /*position: absolute;*/
        text-align: center;
        margin-top: 5px;
    }

    #node-list {
        /*text-align: center;*/
    }

    .node-list-title {
        padding: 5px;
        margin-bottom: 6px;
        margin-left: 4px;
        /*border-bottom: 1px solid #000;*/
        font-size: 18px;
    }

    .card-body {
        padding: 3px;
        font-size: 12px;
        margin-left: 16px;
    }

    .attr-list {
        text-align: center;
    }

    .paramsType {
        padding-left: 12px;
        padding-right: 20px;
    }

    .param-list-title {
        padding: 10px;
        font-size: 18px;
    }

    .upload-item {
        display: inline-block;
    }

</style>

