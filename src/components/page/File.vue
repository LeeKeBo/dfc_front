<template>
    <el-container class="fileContainer">
        <el-main>
            <el-card header="文件传输" class="fileCard">
                <el-tabs :tab-position="tabPosition">
                    <el-tab-pane label="上传文件">
                        <el-form ref="uploadForm" :rules="formRules" :model="uploadForm" label-width="100px">
                            <el-form-item label="选择文件">
                                <el-upload action="/api/fileOpera/storeFile" :file-list="fileList"
                                           :on-success="handleUploadFile">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="用户名" prop="name">
                                <el-input placeholder="用户名" v-model="uploadForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="密码" v-model="uploadForm.password" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="地址" prop="host">
                                <el-input placeholder="地址" v-model="uploadForm.host"></el-input>
                            </el-form-item>
                            <el-form-item label="端口" prop="port">
                                <el-input placeholder="端口" v-model.number="uploadForm.port"></el-input>
                            </el-form-item>
                            <el-form-item label="路径" prop="remoteDir">
                                <el-input placeholder="文件夹路径" v-model="uploadForm.remoteDir"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm(FormType.UploadForm)">立即上传</el-button>
                                <el-button @click="resetForm(FormType.UploadForm)">重置</el-button>
                            </el-form-item>
                        </el-form>

                    </el-tab-pane>
                    <el-tab-pane label="下载文件">
                        <el-form ref="downloadForm" :rules="formRules" :model="downloadForm" label-width="80px">
                            <el-form-item label="用户名" prop="name">
                                <el-input placeholder="用户名" v-model="downloadForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="密码" v-model="downloadForm.password" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="地址" prop="host">
                                <el-input placeholder="地址" v-model="downloadForm.host"></el-input>
                            </el-form-item>
                            <el-form-item label="端口" prop="port">
                                <el-input placeholder="端口" v-model.number="downloadForm.port"></el-input>
                            </el-form-item>
                            <el-form-item label="路径" prop="remoteFile">
                                <el-input placeholder="文件夹路径" v-model="downloadForm.remoteFile"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm(FormType.DownloadForm)">立即获取</el-button>
                                <el-button @click="resetForm(FormType.DownloadForm)">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>

            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import fileDownload from 'js-file-download'

    const FormType = {
        UploadForm: 0,
        DownloadForm: 1
    };
    export default {
        name: "File",
        data() {
            var validateHost = (rule, value, callback) => {
                let ipRegRule = /^((0|1\d?\d?|2(\d?|[0-4]\d|5[0-5])|[3-9]\d?)\.){3}(0|1\d?\d?|2(\d?|[0-4]\d|5[0-5])|[3-9]\d?)$/
                // let hostRegRule = /f/
                if (value == "") {
                    callback()
                } else if (!ipRegRule.test(value)) {
                    callback("格式有误")
                } else {
                    callback()
                }
            }
            var validateDir = (rule, value, callback) => {
                let regRule = /^(.*\/)*$/
                // let regRule = /^(([a-z0-9A-Z_:\\.]*)(\/))*$/
                if (value == "") {
                    callback(new Error('文件位置为空'));
                } else if (!regRule.test(value)) {
                    callback(new Error('路径格式有误，仅支持含字母数字和_.的文件路径，最后需加/'));
                } else {
                    callback();
                }
            };
            var validateFilePath = (rule, value, callback) => {

                let regRule = /^(.*\/)*(.+\..+)$/
                // let regRule = /^(([a-z0-9A-Z_:\\.-]*)(\/))*([a-z0-9A-Z-_:]+\.[a-z0-9A-Z_]+)$/
                if (value == "") {
                    callback(new Error('文件位置为空'));
                } else if (!regRule.test(value)) {
                    callback(new Error('路径格式有误，仅支持含字母数字和_.的文件路径，最后需加/'));
                } else {
                    callback();
                }
            };


            return {
                FormType,
                tabPosition: "left",
                fileList: [],
                uploadForm: {
                    name: '',
                    password: '',
                    host: '',
                    port: '',
                    remoteDir: '',
                },
                downloadForm: {
                    name: '',
                    password: '',
                    host: '',
                    port: '',
                    remoteFile: '',
                },
                formRules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    host: [
                        {required: true, message: '请输入ip地址', trigger: 'blur'},
                        {validator: validateHost, message: 'ip格式有误'}
                    ],
                    port: [
                        {required: true, message: '请输入端口', trigger: 'blur'},
                        {type: 'number', message: '端口为数字'}
                    ],
                    remoteDir: [
                        {required: true, message: '请输入远程文件夹地址', trigger: 'blur'},
                        {validator: validateDir, message: '文件路径格式有误，需以/结尾'}
                    ],
                    remoteFile: [
                        {required: true, message: '请输入远程文件地址', trigger: 'blur'},
                        {validator: validateFilePath, message: '文件路径格式有误'}
                    ]
                }
            }
        },
        methods: {
            handleUploadFile(res, file) {
                this.uploadForm["file"] = file.name
            },
            submitForm(formType) {
                let _self = this;
                if (formType == this.FormType.UploadForm) {
                    if (typeof this.uploadForm["file"] == "undefined") {
                        this.$message.error("未选择文件")
                        return
                    }
                    this.$refs["uploadForm"].validate((valid) => {
                        if (valid) {
                            _self.axios.post('/dfcCode/uploadFile', _self.uploadForm, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then((response) => {
                                    _self.$message.success("上传成功")
                                    console.log(response)
                                }).catch((error) => {
                                _self.$message.error("网络错误")
                                console.log("get error: ", error)
                            })
                        } else {
                            _self.$message.info("表单检验未通过")
                        }
                    })
                } else {
                    this.$refs["downloadForm"].validate((valid) => {
                        if (valid) {
                            _self.axios.post('/dfcCode/downloadFile', _self.downloadForm, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(response => {
                                fileDownload(response.data, response.headers.filename)
                                console.log(response)
                            }).catch(error => {
                                _self.$message.error("网络错误")
                                console.log("get error:", error)
                            })
                        } else {
                            _self.$message.info("表单检验未通过")
                        }
                    })
                }
            },
            resetForm(formType) {
                if (formType == this.FormType.UploadForm) {
                    this.uploadForm = {
                        name: '',
                        password: '',
                        host: '',
                        port: 0,
                        remoteDir: '',
                    }
                } else if (formType == this.FormType.DownloadForm) {
                    this.downloadForm = {
                        name: '',
                        password: '',
                        host: '',
                        port: 0,
                    }
                } else {
                    this.$message.info("类型错误")
                    console.log("formType:", formType)
                }
            }
        }

    }
</script>

<style scoped>

    .headerFont {
        font-size: 2em;
        font-weight: bolder;
        text-align: center;
    }

    .fileCard {
        margin:200px auto;
        width: 70%;
        border-radius: 10px;
    }

    .fileContainer {
        height: 100%;
        background-image: url("../../assets/backgraph3.png");
    }
</style>



