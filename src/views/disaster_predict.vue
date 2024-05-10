<template>
    <div 
     v-loading="loading"
    element-loading-text="预测任务正在进行中，请稍后...">
        <el-row :gutter="50">
            <el-col :span="24" >
                <el-card shadow="hover" class="mgb20">
                    <div class="form-box"  style="height: 230px;">
                        <el-form  ref="formRef" :model="form"  label-width="100px" style="width:100%; ;">
                      
                            <!-- <el-form-item label="地点选择" prop="options">
                                <el-cascader :options="options" v-model="form.location"></el-cascader>
                            </el-form-item> -->

                            <el-form-item label="数据类型" prop="resource">
                                <el-radio-group v-model="form.dataType">
                                    <el-radio label="sm">土壤水分含量</el-radio>
                                    <el-radio label="temperature_2m">地表温度</el-radio>
                                    <el-radio label="surface_pressure">降雨量</el-radio>
                                    <el-radio label="total_precipitation_sum">气压</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        
                            <el-form-item label="预测日期选择">
                                <el-form-item prop="date1">
                                    <el-date-picker
                                        type="date"
                                        placeholder="选择日期"
                                        v-model="form.date"
                                        style="width: 100%"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-form-item>

                            <el-form-item label="预测模型选择" prop="resource">
                                <el-radio-group v-model="form.modelType">
                                    <el-radio label="ABST-Net"></el-radio>
                                    <el-radio label="ConvLSTM"></el-radio>
                                    <el-radio label="SimVP"></el-radio>
                                    <el-radio label="PredRNN"></el-radio>
                                    <el-radio label="MAU"></el-radio>
                                </el-radio-group>
                            </el-form-item>
  

                            <el-form-item>
                                <el-button :icon="Search" type="primary" @click="onSubmit()">预测</el-button>
                                <el-button @click="onReset(formRef)">重置</el-button>
                            </el-form-item>
                        </el-form>
                </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="50">
            <el-col :span="24" >
                <el-card shadow="hover" class="mgb20">
                    <div id="map"  style="height: 450px;"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>


<script setup lang="ts" name="baseform">
import { reactive, ref,onMounted } from 'vue';
import { ElMessage, ElMessageBox,ElTable,FormInstance, FormRules } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getAll,deleteRsImage} from '../api/rsImage';
import { test } from "../api/predict";
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const loading = ref(false)
var map: any;

onMounted(() => {
    map = L.map('map').setView([39.89945, 116.40769], 4);
    //OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map)

})


const formRef = ref<FormInstance>();
const form = reactive({
    // location: [],
    dataType: '',
    date: '',
    modelType: ''
});

const prediceParams = reactive({
    dataset: '',
    config:'',
    ex_name:''
});

// 提交
const onSubmit = () => {
    const {dataType,date,modelType } = form;
    
    // Check if all form fields are filled
    if ( !dataType || !date || !modelType) {
        ElMessage.error('请填写所有字段！');
    return;}

    loading.value=true
    const predictDate = new Date(form.date);
    const final_predictDate = predictDate.getFullYear() + '.' + (predictDate.getMonth() + 1);

    console.log(dataType,final_predictDate,modelType);

    prediceParams.dataset = 'custom';
    prediceParams.config = 'configs/custom/compare/custom_TAU.py';
    prediceParams.ex_name = '2024.03.25_custom_5000_1_ABST-6_2_200epoch';

    // alert(prediceParams.dataset + prediceParams.config + prediceParams.ex_name);
    
    test(prediceParams).then(res=>{
        loading.value=false;
        ElMessage.success("预测完成！")
        // console.log(res.data);

        const blobUrl = window.URL.createObjectURL(res.data)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.download = 'predict_result.nc'
        a.href = blobUrl
        a.click()

        // 添加 GeoServer 发布的图层
        L.tileLayer.wms('http://192.77.108.22:8888/geoserver/my_workSpace_netCDF/wms', {
            layers: `my_workSpace_netCDF:${dataType}`, // 图层名称，格式为 workspace:layerName
            format: 'image/png', // 图层格式
            transparent: true, // 图层是否透明
            attribution: 'GeoServer'
        }).addTo(map);

    })

};


// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};


const options = [
    {
        value: 'huhehaote',
        label: '呼和浩特市',
    },
    {
        value: 'baotou',
        label: '包头市',
    },
    {
        value: 'wuhai',
        label: '乌海市',
    },
    {
        value: 'chifeng',
        label: '赤峰市',
    },
    {
        value: 'tongliao',
        label: '通辽市',
    },
    {
        value: 'eerduosi',
        label: '鄂尔多斯市',
    },
    {
        value: 'hulunbeier',
        label: '呼伦贝尔市',
    },
    {
        value: 'bayannaoer',
        label: '巴彦淖尔市',
    },
];


</script>

<style scoped>
    #map  { 
        /* height: 780px; */
        height: 100%;
        width: 100%;
    }
    .form-box{
        width: 100%;
    }
</style>