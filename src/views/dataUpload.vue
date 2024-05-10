<template>
    <div class="container" 
     v-loading="loading"
    element-loading-text="文件正在上传与解析中，请不要关闭此页面，请稍后...">
        <el-row>
            <el-col :span="12">
                <div class="content-title">遥感影像上传</div>
                    <el-form>
                        <div class="plugins-tips" style="width:75%">
                        请在下方选择遥感影像的卫星类型：
                        </div>
                    <el-form-item label="遥感影像类型" >
                        <el-select  placeholder="请选择影像类型" v-model="satelliteType">
                            <el-option value="landsat5" label="landsat5"></el-option>
                            <el-option value="landsat7" label="landsat7"></el-option>
                            <el-option value="landsat8" label="landsat8"></el-option>
                            <el-option value="zy3" label="资源三号卫星影像"></el-option>
                            <el-option value="gaofen" label="高分系列影像"></el-option>
                            <el-option value="diy" label="自定义格式上传"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="plugins-tips" style="width:75%">
                        请在下方上传遥感影像的元数据文件：
                    </div>
                    <el-form-item >
                        <el-upload
                            ref="upload1"
                            class="upload-demo"
                            action="none"
                            :auto-upload="false"
                            :on-change="handleChange1"
                            limit="1"
                        >
                            <template #trigger>
                            <el-button type="primary">请点此选择遥感影像元数据文件</el-button>
                            </template>
                            <!-- <el-button class="ml-3" type="success" @click="submitUpload">
                            upload to server
                            </el-button> -->
                            <template #tip>
                            <div class="el-upload__tip">
                                请选择xml格式或txt格式的文件进行上传
                            </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <div class="plugins-tips" style="width:75%">
                        请在下方上传遥感影像实体数据文件：
                    </div>
                    <el-form-item >
                        <el-upload
                            ref="upload2"
                            class="upload-demo"
                            action="none"
                            :auto-upload="false"
                            :on-change="handleChange2"
                            multiple="true"
                            limit="20"
                        >
                            <template #trigger>
                            <el-button type="primary">请点此选择遥感影像实体数据</el-button>
                            </template>
                            <!-- <el-button class="ml-3" type="success" @click="submitUpload">
                            upload to server
                            </el-button> -->
                            <template #tip>
                            <div class="el-upload__tip">
                                请选择遥感影像实体数据文件进行上传
                            </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <el-button type="primary" @click="submitUpload">上传</el-button>
                </el-form>
            </el-col>

            <el-col :span="12">
                <div class="content-title">自定义格式上传说明</div>
                <div class="content-p">对于没有元数据文件的影像，可以将下列文字复制到txt文件中，并手动填写相关元数据信息。</div>
                <div class="content-code">
                    filename=example<br>
                    satellite=LANDSAT_5<br>
                    sensor=TM<br>
                    acquiredate=2011-11-16<br>
                    time=03:28:12.3770310Z<br>
                    path=130<br>
                    rowl=042<br>
                    topleftlatitude=26.91092<br>
                    topleftlongitude=100.77135<br>
                    toprightlatitude=26.86143<br>
                    toprightlongitude=103.13632<br>
                    bottomrightlatitude=25.00515<br>
                    bottomrightlongitude=103.07189<br>
                    bottomleftlatitude=103.13632<br>
                    bottomleftlongitude=100.74369</div>
            </el-col>
        </el-row>       
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { add } from '../api/rsImage'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { genFileId,ElMessage } from 'element-plus'
import { fa } from 'element-plus/es/locale';

const loading = ref(false)
const satelliteType = ref('');
// el-upload实例
const upload1 = ref<UploadInstance>()
//文件对象
let fileUpload = ref()
//文件长度（用来表单检查）
const fileLength = ref('0')
const filesLength = ref('0')
let filesUpload = ref()

const handleChange1 =(file: any , fileList: any) =>{
    if(fileList.length > 1){
        ElMessage.error("元数据文件只能上传一个,请重新选择")
        upload1.value!.clearFiles()
    }else{
        fileLength.value=fileList.length
        fileUpload.value = file  
    }
}
const handleChange2 =(file: any , fileList: any) =>{
    // console.log(fileList)
    filesLength.value=fileList.length
    filesUpload.value = fileList
}
const submitUpload=()=> {
    if(fileLength.value=='0' || filesLength.value=='0' || satelliteType.value==''){
        ElMessage.error("请补全表格信息再上传")
        return false
    }
    loading.value=true
    const formData = new FormData()
    formData.append('metadataFile', fileUpload.value.raw)
    formData.append('satelliteType', satelliteType.value)
    filesUpload.value.forEach((element: { raw: string|Blob; }) => {
        formData.append('imageFiles',element.raw)
    });
    add(formData).then(res=>{
        if(res.data.code == 10005){
            loading.value=false
            ElMessage.success(res.data.msg)
        }else{
            loading.value=false
            ElMessage.error(res.data.msg)
        }
    })
}


</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 28px;
    color: #1f2f3d;
}
.content-p {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 18px;
    color: #1f2f3d;
}
.content-code {
    font-weight: 400;
    line-height: 30px;
    margin: 10px 0;
    font-size: 15px;
    color: #1f2f3d;
}
.upload-demo {
    width: 400px;
}
</style>
