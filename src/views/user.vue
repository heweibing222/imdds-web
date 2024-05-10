<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>
					<div class="info">
						<div class="info-image">
							<el-avatar :size="100" :src="avatarImg" />
						</div>
						<div class="info-name">{{ username }}</div>
						<div class="info-desc">{{ authority }}</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>账户编辑</span>
						</div>
					</template>
					<el-form label-width="100px" :model="form" :rules="rules" ref="editInstance">
						<el-form-item label="用户名："> {{ username }} </el-form-item>
						<el-form-item label="密码：" prop="password">
							<el-input  v-model="form.password"></el-input>
						</el-form-item>
						<el-form-item label="手机号码：" prop="phoneNumber">
							<el-input  v-model="form.phoneNumber"></el-input>
						</el-form-item>
						<el-form-item label="电子邮件：" prop="email">
							<el-input  v-model="form.email"></el-input>
						</el-form-item>
						<el-form-item label="教育程度：" prop="education">
							<el-input  v-model="form.education"></el-input>
						</el-form-item>
						<el-form-item label="国籍：" prop="nationality">
							<el-input  v-model="form.nationality"></el-input>
						</el-form-item>
						<el-form-item label="地址：" prop="address">
							<el-input  v-model="form.address"></el-input>
						</el-form-item>
						<el-form-item label="组织：" prop="organization">
							<el-input  v-model="form.organization"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit(editInstance)">保存</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="user">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import 'cropperjs/dist/cropper.css';
import avatar from '../assets/img/img.jpg';
import  {update}  from '../api/user';
import type { FormInstance, FormRules } from 'element-plus';

const avatarImg = ref(avatar);
const user = JSON.parse(localStorage.getItem('ms_user') || '');
const username = user["username"];
const authority = user["authority"]== '1' ? "管理员":"普通用户";

interface formInterface {
	id: string;
	username:string;
	password : string;
	phoneNumber : string;
	email : string;
	education : string;
	nationality : string;
	address : string;
	organization :string
}

const form = reactive<formInterface>({
	id:user["id"],
	username:user["username"],
	password : user["password"],
	phoneNumber : user["phoneNumber"],
	email : user["email"],
	education : user["education"],
	nationality : user["nationality"],
	address : user["address"],
	organization : user["organization"],
	// id: '',
	// username: '',
	// password : '',
	// phoneNumber : '',
	// email : '',
	// education : '',
	// nationality : '',
	// address : '',
	// organization : ''
});

const editInstance = ref<FormInstance>();
const rules: FormRules = {
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	phoneNumber: [{required: true,message: '请输入手机号码',trigger: 'blur'}],
	email: [{required: true,message: '请输入电子邮件',trigger: 'blur'}],
	education: [{required: true,message: '请输入教育程度',trigger: 'blur'}],
	nationality: [{required: true,message: '请输入国籍',trigger: 'blur'}],
	address: [{required: true,message: '请输入地址',trigger: 'blur'}],
	organization: [{required: true,message: '请输入组织',trigger: 'blur'}]
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) =>{
		if (valid) {
			update(form).then(res => {
				if(res.data.code==10003){
					ElMessage.success(res.data.msg);
					localStorage.removeItem('ms_user');
					localStorage.setItem('ms_user',JSON.stringify(res.data.data))
				}else{
					ElMessage.error(res.data.msg);
					return false;
				}
			})
		}else{
			ElMessage.error('请补全表格信息');
			return false;
		}
	})

};


</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}
.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}
.info-image:hover {
	opacity: 1;
}
.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}
</style>
