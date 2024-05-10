<template>
    <div >
        <el-row :gutter="50">
            <el-col :span="24" >
                <el-card shadow="hover" class="mgb20">
                    <div class="form-box"  style="height: 200px;">
                        <el-form  ref="formRef" :model="form"  label-width="100px" style="width:100%; ;">
                      
                            <el-form-item label="地点选择" prop="options">
                                <el-cascader :options="options" v-model="form.locations"></el-cascader>
                            </el-form-item>

                            <el-form-item label="数据类型" prop="resource">
                            <el-radio-group v-model="form.dataType">
                                <el-radio label="土壤水分含量"></el-radio>
                                <el-radio label="气温"></el-radio>
                                <el-radio label="降雨量"></el-radio>
                                <el-radio label="气压"></el-radio>
                            </el-radio-group>
                            </el-form-item>
                        
                            <el-form-item label="日期范围">
                                <el-form-item prop="date1">
                                    <el-date-picker
                                        type="date"
                                        placeholder="开始日期"
                                        v-model="form.date1"
                                        style="width: 100%"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-col class="line" :span="2">-</el-col>
                                <el-form-item prop="date">
                                    <el-date-picker
                                        type="date"
                                        placeholder="结束日期"
                                        v-model="form.date2"
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
                    <div  style="display: flex; justify-content: center; align-items: center;">
                    <div class="schart-box" >
                        <!-- <div class="content-title">折线图</div> -->
                        <schart class="schart" canvasId="line" :options="options2"></schart>
                    </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>


<script setup lang="ts" name="basecharts">

import Schart from 'vue-schart';
import { reactive, ref,onMounted } from 'vue';
import { ElMessage, ElMessageBox,ElTable,FormInstance, FormRules } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';

let options2 = reactive({
    type: 'line',
    yAxis: {
          min: -10 // 设置 y 轴的最小值为 -10，使其从负数开始
        },
    title: {
        text: '呼和浩特2021年3月~9月气温变化趋势'
    },
    bgColor: '#fbfbfb',
    labels: [ '3月', '4月', '5月', '6月', '7月', '8月', '9月', ],
    datasets: [
        {
            label: '气温',
            data: [  0, 10, 15, 20, 25, 23, 18]
        }
    ],
});

const options = [
    {
        value: '呼和浩特',
        label: '呼和浩特',
    },
    {
        value: '包头',
        label: '包头',
    },
    {
        value: '乌海',
        label: '乌海',
    },
    {
        value: '赤峰',
        label: '赤峰',
    },
    {
        value: '通辽',
        label: '通辽',
    },
    {
        value: '鄂尔多斯',
        label: '鄂尔多斯',
    },
    {
        value: '呼伦贝尔',
        label: '呼伦贝尔',
    },
    {
        value: '巴彦淖尔',
        label: '巴彦淖尔',
    },
];

// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};



const formRef = ref<FormInstance>();
const form = reactive({
    locations: [],
    dataType: '',
    date1: '',
    date2: '',
});
// 提交
const onSubmit = () => {
    // Fetch form inputs
    const { locations, dataType, date1, date2 } = form;
    console.log(locations, dataType, date1, date2);

    // Check if all form fields are filled
    if (!locations.length || !dataType || !date1 || !date2) {
    ElMessage.error('请填写所有字段！');
    return;}

    const startDate = new Date(form.date1);
    const endDate = new Date(form.date2);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    // Generate random data
    const generateRandomData = () => {
        const data = [];
        for (let i = 0; i < months; i++) {
            data.push(Math.floor(Math.random() * 30));
        }
        return data;
    };
    // Update options2 with random data
    options2.datasets[0].data = generateRandomData();
    options2.datasets[0].label = dataType;
    options2.labels = Array.from({ length: months }, (_, i) => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return `${year}年${month}月`;
    });
    options2.title.text = `${locations.join('、')} ${startDate.getFullYear()}年${startDate.getMonth() + 1}月~${endDate.getFullYear()}年${endDate.getMonth() + 1}月${dataType}变化趋势`;
};

</script>

<style scoped>
.form-box{
    width: 100%;
}
.schart-box {
	display: inline-block;
	margin: 20px;
}
.schart {
	width: 1200px;
	height: 450px;
}
.content-title {
	clear: both;
	font-weight: 400;
	line-height: 50px;
	margin: 10px 0;
	font-size: 22px;
	color: #1f2f3d;
}
</style>