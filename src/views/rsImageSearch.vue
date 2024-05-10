<template>
    <div class="container" >
        <el-row>
        <el-col :span="8" >
            <div class="form-box">
            <el-form  ref="formRef" :model="form"  label-width="100px" style="width:100%; height: 1000px;">
                <el-form-item label="地点" >
                    <el-input v-model="form.imageName"  style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="指标类型">
                    <el-checkbox-group v-model="form.satelliteType">
                        <el-checkbox label="LANDSAT_5">SPI</el-checkbox>
                        <el-checkbox label="LANDSAT_7">SDI</el-checkbox>
                        <el-checkbox label="LANDSAT_8">VCI</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                
                <el-form-item label="时间范围">
                    从：
                    <el-col :span="8">
                        <el-form-item >
                            <el-date-picker
                                type="date"
                                placeholder="开始日期"
                                v-model="form.shootDateStart"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2"> </el-col>
                    至：
                    <el-col :span="8" >
                        <el-form-item >
                            <el-date-picker
                                type="date"
                                placeholder="结束日期"
                                v-model="form.shootDateEnd"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button :icon="Search" type="primary" @click="onSubmit()">搜索</el-button>
                </el-form-item>
            </el-form>

        </div>
        </el-col>
        <el-col :span="16" >
            <div  id="map">
                <!-- <div id="map"></div> -->
            </div>
        </el-col>
        </el-row>

        <!-- 详情弹出框 -->
		<el-dialog title="影像详情信息" v-model="moreVisible" width="30%">
			<el-form label-width="180px"  :model="rsImage">
				<el-form-item style=" margin-bottom: 0px" label="影像名称："> {{rsImage.imageName}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="卫星："> {{rsImage.satellite}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="传感器："> {{rsImage.sensor}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="拍摄日期："> {{rsImage.shootDate}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="拍摄时间："> {{rsImage.shootTime}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="行号："> {{rsImage.path}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="列号："> {{rsImage.rowl}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="左上角纬度："> {{rsImage.topLeftLatitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="左上角经度："> {{rsImage.topLeftLongitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="右上角纬度："> {{rsImage.topRightLatitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="右上角经度："> {{rsImage.topRightLongitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="右下角纬度："> {{rsImage.bottomRightLatitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="下角经度："> {{rsImage.bottomRightLongitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="左下角纬度："> {{rsImage.bottomLeftLatitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="左下角经度："> {{rsImage.bottomLeftLongitude}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="影像存放路径："> {{rsImage.imageSavePath}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="元数据文件存放路径："> {{rsImage.metadataSavePath}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="上传日期："> {{rsImage.uploadDate}}</el-form-item>
			</el-form>
		</el-dialog>

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



var map;
//存放多边形的集合
var polygons = L.layerGroup();
onMounted(() => {
    map = L.map('map').setView([39.89945, 116.40769], 4);
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