<template>
	<div>
		<div class="container">
            <!-- 搜索区域 -->
			<div class="handle-box">
				<el-button type="primary" :icon="Plus" @click="handleAdd()">新增</el-button>
			</div>
            <!-- 表格 -->
            <el-table :data="tableData" table-layout="fixed" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="id" type="index" :index="tindex" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" width="100"></el-table-column>
            <el-table-column prop="gender" label="性别" ></el-table-column>
            <el-table-column property="phoneNumber" label="手机号码"  width="120"/>
            <el-table-column property="email" label="电子邮箱" width="230"/>
            <el-table-column property="education" label="教育程度"  />
            <el-table-column property="nationality" label="国籍"  />
            <el-table-column property="address" label="地址" width="120" />
            <el-table-column property="organization" label="组织" width="120" />
            <el-table-column property="loginTimes" label="登录次数"  />
            <el-table-column property="authority" label="用户类型"  />
            <el-table-column label="操作" width="220" align="center" fixed="right">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
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

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑用户" v-model="editVisible" width="30%">
			<el-form label-width="80px"  :model="editForm" :rules="rules" ref="formInstance">
                <el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username"></el-input>
				</el-form-item>
                <el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
                <el-form-item label="性别" prop="gender">
					<el-select v-model="editForm.gender" placeholder="性别">
                        <el-option value="男" label="男"></el-option>
                        <el-option value="女" label="女"></el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="手机号码" prop="phoneNumber">
					<el-input v-model="editForm.phoneNumber"></el-input>
				</el-form-item>
                <el-form-item label="电子邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
                <el-form-item label="教育程度" prop="education">
                    <el-select v-model="editForm.education" placeholder="教育程度">
                        <el-option value="高中" label="高中"></el-option>
                        <el-option value="本科" label="本科"></el-option>
                        <el-option value="硕士" label="硕士"></el-option>
                        <el-option value="博士" label="博士"></el-option>
                        <el-option value="其他" label="其他"></el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="国籍" prop="nationality">
					<el-input v-model="editForm.nationality"></el-input>
				</el-form-item>
                <el-form-item label="地址" prop="address">
					<el-input v-model="editForm.address"></el-input>
				</el-form-item>
                <el-form-item label="组织" prop="organization">
					<el-input v-model="editForm.organization"></el-input>
				</el-form-item>
                <el-form-item label="用户类型" prop="authority">
					<el-select v-model="editForm.authority" placeholder="用户类型">
                        <el-option value="管理员" label="管理员"></el-option>
                        <el-option value="普通用户" label="普通用户"></el-option>
                    </el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit(formInstance)">确 定</el-button>
				</span>
			</template>
		</el-dialog>

        <!-- 新增弹出框 -->
		<el-dialog title="增加用户" v-model="addVisible" width="30%">
			<el-form label-width="80px"  :model="editForm" :rules="rules" ref="formInstance">
                <el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username"></el-input>
				</el-form-item>
                <el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
                <el-form-item label="性别" prop="gender">
					<el-select v-model="editForm.gender" placeholder="性别">
                        <el-option value="男" label="男"></el-option>
                        <el-option value="女" label="女"></el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="手机号码" prop="phoneNumber">
					<el-input v-model="editForm.phoneNumber"></el-input>
				</el-form-item>
                <el-form-item label="电子邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
                <el-form-item label="教育程度" prop="education">
                    <el-select v-model="editForm.education" placeholder="教育程度">
                        <el-option value="高中" label="高中"></el-option>
                        <el-option value="本科" label="本科"></el-option>
                        <el-option value="硕士" label="硕士"></el-option>
                        <el-option value="博士" label="博士"></el-option>
                        <el-option value="其他" label="其他"></el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="国籍" prop="nationality">
					<el-input v-model="editForm.nationality"></el-input>
				</el-form-item>
                <el-form-item label="地址" prop="address">
					<el-input v-model="editForm.address"></el-input>
				</el-form-item>
                <el-form-item label="组织" prop="organization">
					<el-input v-model="editForm.organization"></el-input>
				</el-form-item>
                <el-form-item label="用户类型" prop="authority">
					<el-select v-model="editForm.authority" placeholder="用户类型">
                        <el-option value="管理员" label="管理员"></el-option>
                        <el-option value="普通用户" label="普通用户"></el-option>
                    </el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="addEdit(formInstance)">确 定</el-button>
				</span>
			</template>
		</el-dialog>


	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive,onMounted } from 'vue';
import { ElMessage, ElMessageBox,ElTable,FormInstance, FormRules } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getAll,deleteUser,update, addUser } from '../api/user';

const pageTotal = ref(0);
const query = reactive({
	pageIndex: 1,
	pageSize: 10
});
// 分页导航
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
let editForm = reactive({
    id:'',
	username: '',
    password:'',
    gender: '', //1=>male 2=>female
    phoneNumber: '',
    email: '',
    education: '',
    nationality: '',
    address: '',
    organization: '',
    authority:'',//1=>管理员 2=>普通用户
});
// 表单校验
const formInstance = ref<FormInstance>();
const rules: FormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
	phoneNumber: [{required: true,message: '请输入手机号码',trigger: 'blur'}],
	email: [{required: true,message: '请输入电子邮件',trigger: 'blur'}],
	education: [{required: true,message: '请选择教育程度',trigger: 'blur'}],
	nationality: [{required: true,message: '请输入国籍',trigger: 'blur'}],
	address: [{required: true,message: '请输入地址',trigger: 'blur'}],
	organization: [{required: true,message: '请输入组织',trigger: 'blur'}],
    authority: [{required: true,message: '请选择用户类型',trigger: 'blur'}]
};
// 获取表格数据
const getData = () => {
    getAll(query.pageIndex,query.pageSize).then(res => {
        tableData.value=res.data.data;
        pageTotal.value = res.data.data.pageTotal;
    })
};
onMounted(() => {
    getData()
})

//增加数据
const addVisible = ref(false);
const handleAdd = () => {
    editForm.id = '';
	editForm.username = '';
    editForm.password = '';
    editForm.gender = '';
    editForm.phoneNumber = '';
    editForm.email = '';
    editForm.education = '';
	editForm.nationality = '';
    editForm.address ='';
    editForm.organization = '';
    editForm.authority = '';
    addVisible.value = true;
}
const addEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) =>{
		if (valid) {
            addVisible.value = false;
            addUser(editForm).then(res=>{
            if(res.data.code == 10001){
                    ElMessage.success(res.data.msg);
                    getData();
                }else{
                    ElMessage.error(res.data.msg);
                }
             })
		}else{
			ElMessage.error('请补全表格信息');
			return false;
		}
	})
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
const handleEdit = (row: any) => {
	editForm.id = row.id;
	editForm.username = row.username;
    editForm.password = row.password;
    editForm.gender = row.gender;
    editForm.phoneNumber = row.phoneNumber;
    editForm.email = row.email;
    editForm.education = row.education;
	editForm.nationality = row.nationality;
    editForm.address = row.address;
    editForm.organization = row.organization;
    editForm.authority = row.authority;
	editVisible.value = true;
};
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) =>{
		if (valid) {
            editVisible.value = false;
            update(editForm).then(res=>{
            if(res.data.code == 10003){
                    ElMessage.success(res.data.msg);
                    getData();
                }else{
                    ElMessage.error(res.data.msg);
                }
             })
		}else{
			ElMessage.error('请补全表格信息');
			return false;
		}
	})
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(() => {
        deleteUser(tableData.value[index].id).then(res => {
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
