<template>
    <div >
        <el-row :gutter="50">
            <el-col :span="24" >
                <el-card shadow="hover" class="mgb20">
                    <div class="form-box"  style="height: 200px;">
                        <el-form  ref="formRef" :model="form"  label-width="100px" style="width:100%; ;">
                      
                            <el-form-item label="地点选择" prop="options">
                                <el-cascader :options="options" v-model="form.options"></el-cascader>
                            </el-form-item>

                            <el-form-item label="数据类型" prop="resource">
                            <el-radio-group v-model="form.resource">
                                <el-radio label="土壤水分含量"></el-radio>
                                <el-radio label="地表温度"></el-radio>
                                <el-radio label="降雨量"></el-radio>
                                <el-radio label="气压"></el-radio>
                            </el-radio-group>
                            </el-form-item>
                        
                            <el-form-item label="日期选择">
                                <el-form-item prop="date1">
                                    <el-date-picker
                                        type="date"
                                        placeholder="选择日期"
                                        v-model="form.date1"
                                        style="width: 100%"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-form-item>

                            <el-form-item>
                                <el-button :icon="Search" type="primary" @click="onSubmit()">搜索</el-button>
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
                    <div id="map"  style="height: 480px;"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>


<script setup lang="ts" name="baseform">
import { reactive, ref,onMounted } from 'vue';
import { search } from '../api/rsImage';
import { ElMessage, ElMessageBox,ElTable,FormInstance, FormRules } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getAll,deleteRsImage} from '../api/rsImage';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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


var map;
//存放多边形的集合
var polygons = L.layerGroup();
onMounted(() => {
    map = L.map('map').setView([39.89945, 116.40769], 4);
    //OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map)


    map.addLayer(polygons)
})
const addPolygons = (dataList: any) => {
    dataList.forEach(function(i:any,index: any){
        var arr = new Array();
        arr[0]=i.topLeftLatitude;
        arr[1]=i.topLeftLongitude;
        arr[2]=i.topRightLatitude;
        arr[3]=i.topRightLongitude ;
        arr[4]=i.bottomRightLatitude;
        arr[5]=i.bottomRightLongitude;
        arr[6]=i.bottomLeftLatitude;
        arr[7]=i.bottomLeftLongitude;
        arr[8]=i.id;
        arr[9]=i.imageName;
        arr[10]=index;
        addImageLayers(arr,index);
					});
}
const addImageLayers = (arr:any,index: any)=>{
    var imageId = arr[8];
    var imageName = arr[9];
    polygons.addLayer(L.polygon([
        [arr[0],arr[1]],[arr[2],arr[3]],[arr[4],arr[5]],[arr[6],arr[7]]
    ]).on('click', (imageId: any) => {
            rsImage.value = tableData.value[index]
            moreVisible.value = true;
				})
    // .bindPopup(
    //    imageName
    //    +"<br><button onclick=popinfo() >点击查看影像详情</button>"
    // //    +"<el-button text :icon='Edit' @click='handleMore(scope.$index)'>详情</el-button>"

    // )
    );
}

const popinfo = () =>{
    alert("!")
}

const pageTotal = ref(0);
const query = reactive({
	pageIndex: 1,
	pageSize: 6
});
const formRef = ref<FormInstance>();
const form = reactive({
    imageName: '',
    satelliteType:[],
    sensorType:[],
    north:'',
    south:'',
    west:'',
    east:'',
    shootDateStart:'',
    shootDateEnd:'',
    pageIndex:query.pageIndex,
    pageSize:query.pageSize
});
// 提交
const onSubmit = () => {
    tableData.value ='';
    polygons.clearLayers();
    search(form).then(res=>{
        if(res.data.code==10006){
            ElMessage.success(res.data.msg);
            tableData.value=res.data.data.data;
            pageTotal.value = res.data.data.pageTotal;
            addPolygons(res.data.data.data)
            console.log(res.data)
        }else{
            ElMessage.error(res.data.msg);
        }
    })
};

// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	form.pageIndex = val;
    onSubmit();
};
const tindex = (index:number) =>{
      // 当前页数 - 1 * 每页数据条数 + 1
      const page = query.pageIndex; // 当前页码
      const pagesize =  query.pageSize; // 每页条数
      return index + 1 + (page - 1) * pagesize;
    };

//相关数据（表格+提交）
const tableData=ref()

//影像详情
const rsImage=ref()
const moreVisible = ref(false);
const handleMore = (index: number) => {
	console.log(index)
	rsImage.value = tableData.value[index]
	moreVisible.value = true;
};

// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

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