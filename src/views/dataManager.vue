<template>
	<div
	v-loading="loading"
    element-loading-text="数据可视化操作正在进行中，请稍等。">
		<div class="container">
            <!-- 表格 -->
            <el-table :data="tableData"  table-layout="fixed" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="id" type="index" :index="tindex" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="imageName" label="影像名称" />
			<el-table-column prop="satellite" label="卫星" />
			<el-table-column prop="sensor" label="传感器" />
			<el-table-column prop="shootDate" label="拍摄日期" />
			<el-table-column prop="shootTime" label="拍摄时间" />
			<el-table-column prop="imageSavePath" label="影像存放路径" width="240"/>
			<el-table-column prop="metadataSavePath" label="元数据文件存放路径" width="240"/>
			<el-table-column prop="uploadDate" label="上传日期" width="130"/>
            <el-table-column label="操作" width="200" align="center" fixed="right">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleMore(scope.$index)" v-permiss="15">
							详情
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="15">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
            <!-- 分页 -->
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

    
		 <!-- 详情弹出框 -->
		<el-dialog title="影像详情信息" v-model="moreVisible" width="30%">
			<template #default>
				<el-form label-width="180px"  :model="rsImage">
				<el-form-item style=" margin-bottom: 0px" label="影像名称："> {{rsImage.imageName}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="卫星："> {{rsImage.satellite}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="传感器："> {{rsImage.sensor}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="拍摄日期："> {{rsImage.shootDate}} </el-form-item>
				<el-form-item style=" margin-bottom: 0px" label="拍摄时间："> {{rsImage.shootTime}} </el-form-item>
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
			</template>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="getVisualizeList(rsImage.id)">
					  影像可视化
					</el-button>
					<el-button type="primary" @click="getDownloadList(rsImage.id)">
					  影像下载
					</el-button>
				</div>
    		</template>
		</el-dialog>

		<!-- 下载弹出框 -->
		<el-dialog title="影像下载" v-model="downloadVisible" width="600px">
			<template #default>
				<el-table :data="subImageData" style="width: 100%">
					<el-table-column prop="imageName" label="影像名称" width="450"></el-table-column>
					<el-table-column  label="操作" width="100">
						<template #default="scope1">
							<el-button type="primary" @click="downloadImage(scope1.$index)">
						    下载
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-dialog>

		<!-- 可视化弹出框 -->
		<el-dialog title="影像可视化" v-model="visualizeVisible" width="600px">
			<template #default>
				<el-table :data="subImageData" style="width: 100%">
					<el-table-column prop="imageName" label="影像名称" width="450"></el-table-column>
					<el-table-column  label="操作" width="100">
						<template #default="scope1">
							<el-button type="primary" @click="visualizeImage(scope1.$index)">
						    可视化
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-dialog>

	</div>
</template>

<script setup lang="ts" name="basetable">
import baseURL from '../utils/baseURL'
import { ref, reactive,onMounted } from 'vue';
import { ElMessage, ElMessageBox,ElTable,FormInstance, FormRules } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getAll,deleteRsImage, getList,publish} from '../api/rsImage';
import { useRouter } from 'vue-router';
// import { getList,download} from '../api/subImage';


const loading = ref(false)
const router = useRouter();


//影像详情
const rsImage=ref()
const moreVisible = ref(false);
const handleMore = (index: number) => {
	console.log(index)
	rsImage.value = tableData.value[index]
	moreVisible.value = true;
};


//影像下载
const subImageData=ref()
const downloadVisible = ref(false);
const downloadImage = (index:any) =>{
	window.open(baseURL+'/rsImage/download/?id='+subImageData.value[index].id)
}
const getDownloadList=(id:any)=>{
	downloadVisible.value = true;
	getList(id).then(res=>{
		if(res.data.code == 10004 ){
			subImageData.value=res.data.data
		}else{
			ElMessage.error(res.data.msg);
		}
	})
}
//影像可视化
const visualizeVisible = ref(false);
const getVisualizeList=(id:any)=>{
	visualizeVisible.value = true;
	getList(id).then(res=>{
		if(res.data.code == 10004 ){
			subImageData.value=res.data.data
		}else{
			ElMessage.error(res.data.msg);
		}
	})
}
const visualizeImage = (index:any) =>{
	visualizeVisible.value = false;
	moreVisible.value = false;
	loading.value=true;
	// ElMessage.info("数据可视化操作正在进行中，请稍等。")
	const id = subImageData.value[index].id;
	publish(id).then(res=>{
		console.log(res);
		if(res.data.code == 10004){
			ElMessage.success(res.data.msg);
			router.push({path:'/visualize',query:{imageName:subImageData.value[index].imageName}})
		}else{
			ElMessage.error(res.data.msg);
		}
		loading.value=false;
		visualizeVisible.value = true;
		moreVisible.value = true;
	})
}


// 分页导航
const pageTotal = ref(0);
const query = reactive({
	pageIndex: 1,
	pageSize: 10
});
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
const tindex = (index:number) =>{
      // 当前页数 - 1 * 每页数据条数 + 1
      const page = query.pageIndex; // 当前页码
      const pagesize =  query.pageSize; // 每页条数
      return index + 1 + (page - 1) * pagesize;
    };

//相关数据（表格+提交）
const tableData=ref()
// 获取表格数据
const getData = () => {
    // alert(query.pageIndex);
    getAll(query.pageIndex,query.pageSize).then(res => {
        tableData.value=res.data.data;
        pageTotal.value = res.data.data.pageTotal;
    })
};
onMounted(() => {
    getData()
})

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(() => {
        deleteRsImage(tableData.value[index].id).then(res => {
            if(res.data.code == 10002){
                ElMessage.success(res.data.msg);
                getData();
            }else{
                ElMessage.error(res.data.msg);
            }
        })
    })
    .catch(() => {});
};


</script>



<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
