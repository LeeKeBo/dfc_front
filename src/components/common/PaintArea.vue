<template>
    <div id="paintLimit">
        <div class="workplace" id="workplace">
            <chart-node v-for="(item,index) in chartData.nodes" v-bind="item" :key="index"
                        @edit="editNode(item,index)"></chart-node>
        </div>
        <!--            属性修改弹窗-->
        <el-dialog width="60%" title="添加属性" :visible.sync="innerVisible">
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
        <!--            数据流节点弹窗层-->
        <el-dialog title="数据流节点信息编辑" :visible.sync="flowNodeDialogVisible">
            <el-form>
                <el-form-item label="数据流节点名">
                    <el-input v-model="curNode.name"></el-input>
                </el-form-item>
                <el-form-item label="输入参数列表">
                    <el-table
                            :data="curNodeInList(NodeType.FlowNode,curNode.typeId).inputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="输出参数列表">
                    <el-table
                            :data="curNodeInList(NodeType.FlowNode,curNode.typeId).outputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="flowNodeDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="deleteNode()">删 除</el-button>
                <el-button type="primary" @click="saveEditNode()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="子图节点信息编辑" :visible.sync="subGapDialogVisible">
            <el-form>
                <el-form-item label="子图名">
                    <el-input v-model="curNode.name"></el-input>
                </el-form-item>
                <el-form-item label="输入参数列表">
                    <el-table
                            :data="curNodeInList(NodeType.SubGraphNode,curNode.typeId).inputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="输出参数列表">
                    <el-table
                            :data="curNodeInList(NodeType.SubGraphNode,curNode.typeId).outputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                    </el-table>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="subGapDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="deleteNode()">删 除</el-button>
                <el-button type="primary" @click="saveEditNode()">确 定</el-button>
            </div>

        </el-dialog>

        <!--            系统预设节点弹窗-->
        <el-dialog title="节点信息查看" :visible.sync="systemNodeDialogVisible">
            <el-form>
                <el-form-item label="节点名">
                    <span>{{curNode.name}}</span>
                </el-form-item>
                <el-form-item label="输入参数列表" v-if="curNode.type == NodeType.OnlyOutputNode">
                    <el-table
                            :data="curNodeInList(NodeType.SubGraphNode,this.curNode.typeId).inputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="输出参数列表" v-if="curNode.type == NodeType.OnlyInputNode">
                    <el-table
                            :data="curNodeInList(NodeType.SubGraphNode,this.curNode.typeId).outputs"
                            style="width: 100%">
                        <el-table-column label="Type" prop="type"></el-table-column>
                        <el-table-column label="Name" prop="name"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="systemNodeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditNode()">确 定</el-button>
            </div>

        </el-dialog>

        <!--            连线属性修改弹窗-->
        <el-dialog title="连线属性" :visible.sync="connectionVisible">

            <el-table
                    :data="curConn.attrs"
                    style="width: 100%">
                <el-table-column label="Input" prop="input"></el-table-column>
                <el-table-column label="Output" prop="output"></el-table-column>
                <el-table-column
                        align="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger"
                                   @click="deleteConnArgsAttr(scope.$index) ">Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-select v-model="curInput" placeholder="输入" class="connAttrSelect">
                <el-option
                        v-for="item in connInputs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="curOutput" placeholder="输出" class="connAttrSelect">
                <el-option
                        v-for="item in connOutputs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <i class="el-icon-circle-plus-outline" @click="AddNewConnAttr()"></i>


            <el-checkbox-group v-model="curCheckList">
                <el-checkbox v-for="(item,index) in connectionInputs" :label="item.name" :key="index"></el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="connectionVisible = false">取 消</el-button>
                <el-button type="danger" @click="deleteConn()">删 除</el-button>
                <el-button type="primary" @click="saveEditConnection()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import $ from 'jquery'
    import ChartNode from "@/components/common/ChartNode";
    import {codemirror} from 'vue-codemirror'
    import 'jsplumb'
    import "codemirror/theme/colorforth.css";
    import "codemirror/mode/javascript/javascript.js"
    import "codemirror/mode/clike/clike"
    import bus from "@/components/common/Bus";

    const NodeType = {
        StructNode: 0,      // 结构体节点
        FlowNode: 1,        // 流节点
        SubGraphNode: 2,    // 子图节点
        OnlyOutputNode: 3,   // 只能接受出边
        OnlyInputNode: 4,    // 只能接受入边
    };
    export default {
        name: "paintArea",
        props: {
            chartData: {
                type: Object,
                required: true
            },
            nodeList: {
                type: Array,
                required: true
            }

        },
        data() {
            return {
                NodeType,
                structNodeDialogVisible: false,           // 结构体节点编辑框
                flowNodeDialogVisible: false,          // 数据流节点编辑框
                subGapDialogVisible: false,
                systemNodeDialogVisible: false,
                innerVisible: false,            // 内部属性编辑框
                connectionVisible: false,       // 连接线编辑框
                jsp: null,                      // jsplumb对象
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
                typeList: [
                    "int", "string", "long", "short", "char"
                ],                // 当前可用的节点类型数组
                // 节点编辑相关
                curNode: {
                    icon: "el-icon-menu",
                    name: "结构体节点",
                    type: NodeType.StructNode,
                    attrs: [],
                    code: ""
                },
                curAttr: {
                    type: "",
                    name: ""
                },
                curNodeIndex: -1,               // 当前编辑的节点在nodes数组中的下边
                curEditAttrType: 0,             // 当前编辑的节点属性，0：attrs,1:inputs,2:outputs
                editIndex: -1,                  // 当前编辑的属性在attrs/inputs/outputs数组中的下标
                curCode: '',                    // 代码编辑框默认值

                // 连线编辑相关
                activeTab: 'second',
                connectionInputs: [],           // 连线对象的输入数组
                curConn: {},                     // 当前编辑的边
                connInputs: [],                   // 当前编辑的边可提供的输入
                connOutputs: [],                  // 当前编辑的边可提供的输入
                curInput: "",
                curOutput: "",
                curCheckList: [],               // 当前编辑连线对象的选择项
                curEditConnectionIndex: -1,     // 当前编辑的连线对象在connection数组中的下标

            }
        },
        computed: {
            // 根据TypeID获取nodeList中的节点
            curNodeInList() {
                // console.log("nodeList:",this.nodeList)
                return function (type, typeId) {
                    let node = this.nodeList[type].find(item => {
                        return item.id == typeId
                    })
                    if (typeof node == "undefined") {
                        return {
                            inputs: [],
                            outputs: []
                        }
                    }
                    return node
                }
            },
            // 根据节点ID获取图中的节点
            curNodeInGraph() {
                console.log("graph nodes:", this.chartData.nodes)
                return function (nodeId) {
                    return this.chartData.nodes.find(item => {
                        return item.id == nodeId
                    })
                }
            },
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
            }

        },
        updated() {
            console.log("updated")
        },
        mounted() {
            console.log("mounted paintArea")
            console.log("get chartData:", this.chartData)
            if (this.chartData == null) {
                // this.chartData = {}
                console.log("error")
                this.chartData.nodes = []
                this.chartData.connections = []
                console.log("get null chartData")
            }
            console.log("nodes:", this.chartData.nodes)
            const _self = this;
            // $(".chart-node").draggable({helper:"clone",revert: "invalid", cursor: 'pointer'});
            // $("#test-drag").draggable()
            // let instance = this.$jsPlumb.getInstance()
            this.$jsPlumb.ready(() => {
                console.log("jsplumb is ready")
                let instance = _self.$jsPlumb.getInstance({
                    Endpoint: [
                        "Blank",
                        {cssClass: "chart-dot", hoverClass: "chart-dot-hover", radius: 5}
                    ],
                    Connector: "Straight",
                    HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2},
                    ConnectionOverlays: [
                        [
                            "Arrow",
                            {
                                location: 1,
                                visible: true,
                                width: 11,
                                height: 11,
                                id: "Arrow"
                            }
                        ]
                        // ["Label", { label: "-", id: "label", cssClass: "aLabel" }]
                    ],
                    Container: "workplace"
                });
                this.jsp = instance;
                instance.bind("connection",
                    function (info) {

                    });
                instance.bind("beforeDrop", function (info) {
                    console.log("beforeDrop", info);
                    // 判断是否已有该连接
                    let hasSameConn = false;
                    _self.chartData.connections.some(function (item) {
                        if ((item.targetId == info.targetId && item.sourceId == info.sourceId) ||
                            (item.targetId == info.sourceId && item.sourceId == info.targetId)) {
                            hasSameConn = true;
                        }
                    });
                    console.log("hasSameConn:", hasSameConn)
                    if (!hasSameConn) {
                        let sourceItem = _self.curNodeInGraph(info.sourceId)
                        let targetItem = _self.curNodeInGraph(info.targetId)
                        console.log("sourceItem:", sourceItem)
                        if (typeof sourceItem == "undefined" || typeof targetItem == "undefined") {
                            _self.$message.error("节点不存在")
                            console.log(info, _self.chartData.nodes)
                        }
                        // 连线需要记录节点的ID，typeId,type
                        _self.chartData.connections.push({
                            connectionId: info.connection.id,
                            sourceId: info.sourceId,
                            sourceTypeId: sourceItem.typeId,
                            sourceType: sourceItem.type,
                            targetId: info.targetId,
                            targetTypeId: targetItem.typeId,
                            targetType: targetItem.type,
                            attrs: []
                        })
                    } else {
                        _self.$message.info("节点已连接")
                        console.log("不允许重复连接！");
                    }
                    return !hasSameConn;
                })

                instance.bind("click", function (conn) {
                    let curConnection = _self.chartData.connections.find((item, index) => {

                        if (item.connectionId == conn.id) {
                            console.log("find connection index:", index);
                            _self.curEditConnectionIndex = index
                            return true;
                        }
                    })
                    if (typeof curConnection == "undefined") {
                        _self.$message.error("连接无效");
                        console.log("connection:", _self.chartData.connections)
                        return
                    }

                    console.log("click connection:", conn);
                    // 这里的sourceType 和 targetType是指要去获取参数的节点的类型，OnlyInputNode 和 OnlyOutputNode
                    // 都是从子图节点获取的，所以这里加一点操作
                    let sourceType = curConnection.sourceType == NodeType.FlowNode ? NodeType.FlowNode : NodeType.SubGraphNode
                    let targetType = curConnection.targetType == NodeType.FlowNode ? NodeType.FlowNode : NodeType.SubGraphNode
                    let sourceItem = _self.nodeList[sourceType].find(item => {
                        return item.id == curConnection.sourceTypeId
                    })
                    let targetItem = _self.nodeList[targetType].find(item => {
                        return item.id == curConnection.targetTypeId
                    })
                    console.log("source", sourceItem)
                    console.log("target", targetItem)
                    if (typeof sourceItem == "undefined" || typeof targetItem == "undefined") {
                        console.log("获取节点失败")
                        return
                    }

                    _self.connInputs = []
                    _self.connOutputs = []
                    _self.curInput = ""
                    _self.curOutput = ""
                    let inputsItem = curConnection.sourceType <= NodeType.SubGraphNode ? sourceItem.outputs : sourceItem.inputs
                    let outputsItem = curConnection.targetType <= NodeType.SubGraphNode ? targetItem.inputs : targetItem.outputs
                    for (let index in inputsItem) {
                        let str = inputsItem[index].type + " " + inputsItem[index].name
                        _self.connInputs.push({value: str + " (" + index + ")", label: str})
                    }

                    for (let index in outputsItem) {
                        let str = outputsItem[index].type + " " + outputsItem[index].name
                        _self.connOutputs.push({value: str + " (" + index + ")", label: str})
                    }
                    _self.curConn = curConnection
                    _self.curCheckList = curConnection.checkList;
                    _self.connectionVisible = true;

                });
                // 可拖动
                $(".box-card .canDraggable ").draggable({
                    scope: "plant",
                    helper: "clone",
                    containment: '#work-container'
                })
                // $(".box-card .item ").draggable({
                //     scope: "plant",
                //     helper: "clone",
                //     containment: '#work-container'
                // })
                // 可拖拽至目的dom (droppable not draggable)
                $("#paintLimit").droppable({
                    scope: "plant",
                    drop: function (ev, ui) {
                        console.log("drop event:", ev, ui);
                        if (parseInt(ui.helper.attr("data-type")) == NodeType.SubGraphNode && _self.chartData.id != "mainGap") {
                            _self.$message.info("子图节点不可嵌套")
                            return
                        }
                        // 生成一个id
                        console.log(_self.$jsPlumbUtil)
                        let id = _self.$jsPlumbUtil.uuid();
                        let item = {
                            id,
                            icon: ui.helper.attr("data-icon"),
                            type: parseInt(ui.helper.attr("data-type")),  // 区分子图还是数据流节点
                            name: ui.helper.attr("data-name") + "-" + _self.randomString(3),
                            typeId: ui.helper.attr("data-typeId"), // 记录是哪种节点
                            nodeStyle: {
                                top: (ui.position.top + $('#scrollMain').scrollTop() - 100) + "px",
                                left: (ui.position.left + $('#scrollMain').scrollLeft() - 180)+ "px"
                            },
                            inputs: ui.helper.attr("data-input"),
                            outputs: ui.helper.attr("data-output"),
                            nodes: [],
                            connections: [],
                        }
                        _self.chartData.nodes.push(item);
                        _self.$nextTick(() => {
                            console.log("nextTick")
                            _self.initNode(id);
                        })
                    }
                });


                // 绘制端点
                instance.batch(() => {
                    _self.$jsPlumb.getSelector(".workplace-chart").forEach(item => {
                        _self.initNode(item);
                    })
                })

                console.log("curChartData:", this.chartData)
                // 绘制连线
                this.chartData.connections.forEach(item => {
                    let connection = this.jsp.connect({
                        source: item.sourceId,
                        target: item.targetId
                    });
                    // 设置id
                    $(connection).attr('id', item.connectionId);
                });

                bus.$on("delete_node_in_jsp", (nodeId) => {
                    this.deleteNodeInJsp(nodeId)
                })

                bus.$on("delete_node", (type_id) => {
                    console.log("delete type_id:", type_id);
                    this.deleteNodeWithTypeId(type_id)
                })

            })
        },
        methods: {
            // 初始化新节点属性函数：可拖动，可作为源节点，可作为目标节点

            initNode(el) {
                console.log("init Node:", el)
                let _self = this;
                let nodeType = typeof el == Object ? parseInt(el.getAttribute("type")) : NodeType.SubGraphNode
                this.jsp.draggable(el, {
                    start(params) {
                        // 拖动开始
                        // console.log(params);
                    },
                    drag(params) {
                        // 拖动中
                        // console.log(params);
                    },
                    stop(params) {
                        console.log(params);
                        let id = params.el.id;
                        _self.chartData.nodes.forEach(item => {
                            if (item.id === id) {
                                item.nodeStyle.left = params.pos[0] + "px";
                                item.nodeStyle.top = params.pos[1] + "px";
                            }
                        });
                    },
                    scroll: true,
                    containment: "#paintLimit"
                });
                if (nodeType != NodeType.OnlyInputNode) {
                    this.jsp.makeSource(el, {
                        filter: ".ep",
                        // anchor: "Continuous",
                        anchor: ["Perimeter", {shape: "Rectangle"}],
                        connectorStyle: {
                            stroke: "#5c96bc",
                            strokeWidth: 2,
                            outlineStroke: "transparent",
                            outlineWidth: 4
                        },
                        extract: {
                            action: "the-action"
                        },
                        maxConnections: -1,
                        onMaxConnections: function (info, e) {
                            alert("Maximum connections (" + info.maxConnections + ") reached");
                        }
                    });
                }
                if (nodeType != NodeType.OnlyOutputNode) {
                    this.jsp.makeTarget(el, {
                        dropOptions: {hoverClass: "dragHover"},
                        anchor: ["Perimeter", {shape: "Rectangle"}],
                        allowLoopback: false

                    })
                }
                this.jsp.fire("jsPlumbDemoNodeAdded", el);
            },
            // 打开节点编辑窗口
            editNode: function (item, index) {
                console.log("item type:", item.type)
                if (item.type == this.NodeType.FlowNode) {
                    this.flowNodeDialogVisible = true;
                } else if (item.type == this.NodeType.SubGraphNode) {
                    this.subGapDialogVisible = true
                } else {
                    this.systemNodeDialogVisible = true
                }
                // 复制当前节点信息，以及保存当前节点在数组中的下标
                this.curNode = JSON.parse(JSON.stringify(item))
                this.curNodeIndex = index;
                console.log("curNode:", this.curNode)
            },
            // 保存正在编辑的节点
            saveEditNode() {
                let _self = this
                this.$confirm('是否保存修改结果?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (_self.curNodeIndex < 0 && _self.curNodeIndex >= _self.chartData.nodes.length) {
                        _self.$message.error("参数错误")
                        _self.structNodeDialogVisible = false
                        return
                    }
                    // console.log(_self.curNode)
                    // console.log(_self.curNodeIndex)
                    // console.log(_self.chartData.nodes[_self.curNodeIndex])
                    _self.chartData.nodes.splice(_self.curNodeIndex, 1, _self.curNode)
                    if (_self.curNode.type == _self.NodeType.FlowNode) {
                        this.flowNodeDialogVisible = false;
                    } else if (_self.curNode.type == _self.NodeType.SubGraphNode) {
                        _self.subGapDialogVisible = false
                    }

                    // console.log(_self.chartData.nodes[_self.curNodeIndex])
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });

                }).catch(() => {
                });
            },
            // 删除节点：删除节点，删除相关边，删除相关的tag
            deleteNode() {
                let _self = this;
                this.$confirm('是否删除该节点?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    if (_self.curNodeIndex < 0 && _self.curNodeIndex >= _self.chartData.nodes.length) {
                        _self.$message.error("参数错误")
                        _self.structNodeDialogVisible = false
                        return
                    }
                    // 删除当前节点和相关的边
                    _self.jsp.deleteEndpoint(_self.chartData.nodes[_self.curNodeIndex].id)
                    _self.jsp.getConnections({
                        source: _self.chartData.nodes[_self.curNodeIndex].id
                    }).forEach((conn) => {
                        console.log("delete conn:", conn)
                        _self.jsp.deleteConnection(conn)
                    })
                    _self.jsp.getConnections({
                        target: _self.chartData.nodes[_self.curNodeIndex].id
                    }).forEach((conn) => {
                        console.log("delete conn:", conn)
                        _self.jsp.deleteConnection(conn)
                    })
                    // _self.jsp.detachAllConnections(_self.chartData.nodes[_self.curNodeIndex].id)
                    // _self.jsp.
                    if (_self.chartData.nodes[_self.curNodeIndex].type == NodeType.StructNode) {
                        _self.structNodeDialogVisible = false;
                    } else if (_self.chartData.nodes[_self.curNodeIndex].type == NodeType.FlowNode) {
                        _self.flowNodeDialogVisible = false;
                    } else if (_self.chartData.nodes[_self.curNodeIndex].type == NodeType.SubGraphNode) {
                        // 子图节点也需要删除掉相应的tag
                        bus.$emit('delete_tag', _self.chartData.nodes[_self.curNodeIndex].id)
                        _self.subGapDialogVisible = false;
                    }
                    // 删除与当前节点相关的边
                    _self.chartData.connections = _self.chartData.connections.filter((connection) => {
                        if (connection.sourceId != _self.curNode.id && connection.targetId != _self.curNode.id) {
                            return true
                        } else {
                            // 删除前需要先将节点属性的引用关系去掉
                            for (let i = 0; i < connection.attrs.length; i++) {
                                _self.deleteConnUseCount(connection, i)
                            }
                            return false;
                        }
                    })
                    _self.chartData.nodes.splice(_self.curNodeIndex, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                });
            },
            deleteNodeWithTypeId(typeId) {

                let _self = this;
                for (let i = _self.chartData.nodes.length - 1; i >= 0; i--) {
                    if (_self.chartData.nodes[i].typeId == typeId) {
                        // jsp中删除顶点
                        _self.jsp.deleteEndpoint(_self.chartData.nodes[i].id)
                        // jsp中删除连接
                        _self.jsp.getConnections({
                            source: _self.chartData.nodes[i].id
                        }).forEach((conn) => {
                            console.log("delete conn:", conn)
                            _self.jsp.deleteConnection(conn)
                        })
                        _self.jsp.getConnections({
                            target: _self.chartData.nodes[i].id
                        }).forEach((conn) => {
                            console.log("delete conn:", conn)
                            _self.jsp.deleteConnection(conn)
                        })
                        if (_self.chartData.nodes[i].type == NodeType.SubGraphNode) {
                            // 子图节点也需要删除掉相应的tag
                            bus.$emit('delete_tag', _self.chartData.nodes[i].id)
                        }
                        // 存储数组中删除顶点
                        _self.chartData.nodes.splice(i, 1)
                    }
                }
                // 存储数组中删除连接
                _self.chartData.connections = _self.chartData.connections.filter(item => {
                    return item.sourceTypeId == typeId || item.targetTypeId == typeId
                })
            },
            deleteNodeInJsp(nodeId) {
                this.jsp.deleteEndpoint(nodeId)
                this.jsp.getConnections({
                    source: nodeId
                }).forEach((conn) => {
                    console.log("delete conn:", conn)
                    this.jsp.deleteConnection(conn)
                })
                this.jsp.getConnections({
                    target: nodeId
                }).forEach((conn) => {
                    console.log("delete conn:", conn)
                    this.jsp.deleteConnection(conn)
                })
            },
            setCodeMirrorValue(codemirrorObj, code) {
                if (typeof (codemirrorObj) == "undefined") {
                    console.log("undefined")
                    return
                }
                codemirrorObj.codemirror.setValue(code)
                setTimeout(() => {
                    codemirrorObj.codemirror.refresh();
                }, 1)
            },
            // 保存正在编辑的边信息
            saveEditConnection: function () {
                if (this.curEditConnectionIndex < 0 && this.curEditConnectionIndex >= this.chartData.connections.length) {
                    this.$message.error("参数有误，保存失败", this.curEditConnectionIndex, this.chartData)
                    return
                }
                let curConnection = this.chartData.connections[this.curEditConnectionIndex];
                curConnection.checkList = this.curCheckList
                let curConnObj = this.jsp.getConnections({
                    source: curConnection.sourceId,
                    target: curConnection.targetId
                })
                if (curConnObj[0]) {
                    if (curConnection.attrs.length > 0) {
                        let connLabel = curConnection.attrs[0].input + "-" + curConnection.attrs[0].output
                        connLabel += curConnection.attrs.length > 1 ? ",..." : ""
                        console.log("cur label:", connLabel);
                        curConnObj[0].setLabel(connLabel);
                    }
                }
                this.connectionVisible = false;
            },
            deleteConn() {
                let _self = this;
                this.$confirm('是否删除该边?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    if (_self.curEditConnectionIndex < 0 || _self.curEditConnectionIndex >= _self.chartData.connections.length) {
                        _self.$message.error("参数错误")
                        _self.connectionVisible = false;
                        return
                    }
                    let conn = _self.jsp.getConnections({
                        source: _self.chartData.connections[_self.curEditConnectionIndex].sourceId,
                        target: _self.chartData.connections[_self.curEditConnectionIndex].targetId
                    })
                    console.log("conn index:", _self.curEditConnectionIndex, "get conn:", conn)
                    if (conn[0] != null) {
                        _self.jsp.deleteConnection(conn[0])
                    }
                    let deleteConn = _self.chartData.connections.splice(_self.curEditConnectionIndex, 1)[0]
                    for (let i = 0; i < deleteConn.attrs.length; i++) {
                        _self.deleteConnUseCount(deleteConn, i)
                    }
                    _self.connectionVisible = false;
                    _self.$message.success("已删除该边")
                }).catch(() => {

                })
            },
            deleteConnUseCount(conn, attrIndex) {
                // 这里根据括号中间的数字来匹配到是第几个元素被引用
                bus.$emit("delete_conn", conn.sourceType, conn.sourceTypeId, true, parseInt(conn.attrs[attrIndex].input.split("(")[1].split(")")[0]))
                bus.$emit("delete_conn", conn.targetType, conn.targetTypeId, false, parseInt(conn.attrs[attrIndex].output.split("(")[1].split(")")[0]))

            },
            addConnUseCount(conn, attrIndex) {
                bus.$emit("add_conn", conn.sourceType, conn.sourceTypeId, true, parseInt(conn.attrs[attrIndex].input.split("(")[1].split(")")[0]))
                bus.$emit("add_conn", conn.targetType, conn.targetTypeId, false, parseInt(conn.attrs[attrIndex].output.split("(")[1].split(")")[0]))
            },
            AddNewConnAttr() {
                let _self = this;
                if (_self.curInput != "" && _self.curOutput != "") {
                    // 先判断一下该边是否存在
                    let curAttr = _self.curConn.attrs.filter(item => {
                        if (item.input == _self.curInput && item.output == _self.curOutput) {
                            return true
                        }
                        return false
                    })[0]
                    console.log(curAttr)
                    if (curAttr != undefined) {
                        _self.$message.info("该参数情况已存在")
                    } else {
                        // 判断一下选择的类型是否一致
                        if (_self.curInput.split(" ")[0] != _self.curOutput.split(" ")[0]) {
                            _self.$message.info("参数类型不一致")
                            return
                        }
                        _self.curConn.attrs.push({input: _self.curInput, output: _self.curOutput})
                        _self.addConnUseCount(_self.curConn, _self.curConn.attrs.length - 1)
                        // bus.$emit("add_conn",_self.curConn.sourceType, _self.curConn.sourceTypeId, true, parseInt(this.curInput.split("(")[1].split(")")[0]))
                        // bus.$emit("add_conn",_self.curConn.targetType, _self.curConn.targetTypeId, false, parseInt(this.curInput.split("(")[1].split(")")[0]))
                        _self.$message.success("添加成功")
                    }
                } else {
                    _self.$message.info("未完全选择参数")
                }

            },
            deleteConnArgsAttr(index) {
                let _self = this
                this.$confirm('是否删除该参数?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.deleteConnUseCount(_self.curConn, index)
                    // bus.$emit("delete_conn",_self.curConn.sourceType, _self.curConn.sourceTypeId, true, parseInt(_self.curConn.attrs[index].input.split("(")[1].split(")")[0]))
                    // bus.$emit("delete_conn",_self.curConn.targetType, _self.curConn.targetTypeId, false, parseInt(_self.curConn.attrs[index].output.split("(")[1].split(")")[0]))
                    _self.curConn.attrs.splice(index, 1)
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
            drop: function (e) {
                let data = e.dataTransfer.getData("id");  //获得拖拉元素的id
                console.log("data:", data);
                if (this.isDragFromTemplate) {
                    // let flowerContainer = document.createElement("el-button",{
                    //     style:{
                    //         'width':'20px',
                    //         'height':'20px'
                    //     }
                    // });
                    e.preventDefault();
                    let randomNum = e.dataTransfer.getData("randomNum");
                    let flowerContainer = $("#" + data).clone(true, true)[0]
                    // let flowerContainer = document.getElementById(data).cloneNode(true)
                    flowerContainer.id += randomNum;
                    // flowerContainer.draggable();
                    console.log(flowerContainer)
                    // document.getElementById(data).cloneNode(true)
                    // 缓存 鼠标点击时 的位置
                    // 将创建的 DIV 元素 的位置设置为鼠标点击的位置
                    // flowerContainer.cli
                    let newX = e.offsetX;
                    let newY = e.offsetY;
                    console.log("offsetX: ", newX, " offsetY: ", newY)
                    flowerContainer.style.left = newX + "px";
                    flowerContainer.style.top = newY + "px";
                    flowerContainer.style.position = "relative"
                    $('#paint-area')[0].appendChild(flowerContainer);
                    $("#" + flowerContainer.id).draggable();
                    this.$forceUpdate()
                    // let cloneNode = $('#paint-area')[0].appendChild(document.getElementById(data).cloneNode(true));//cloneNode()参数为true，实现复制拖拉元素
                    // console.log(cloneNode)
                }// cloneNode.x
                this.isDragFromTemplate = false;
                console.log("drop", e)
            },

        },
        components: {
            ChartNode
        },
        watch: {
            xxx(newVal) {

            }
        }
    }

</script>

<style scoped>
    .workplace {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .connAttrSelect {
        width: 150px;
        margin-left: 50px;
        margin-right: 50px;
        margin-top: 10px;
    }

    #paintLimit {
        height: 600%;
        width: 600%
    }

</style>
