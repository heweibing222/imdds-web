<template>
	<div class="container">
        <el-row :gutter="50">
            <el-col :span="24" >
                <el-card shadow="hover" class="mgb20">
                    <div id="map"  style="height: 650px;"></div>
                </el-card>
            </el-col>
        </el-row>
	</div>
</template>

<script setup lang="ts" name="visualize">
import { reactive, ref,onMounted } from 'vue';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRoute } from 'vue-router';


// 使用 useRoute 钩子获取路由信息
const route = useRoute();
// 从路由参数中获取传递过来的值
const imageName = route.query.imageName;

var map;
onMounted(() => {
    map = L.map('map').setView([39.89945, 116.40769], 4);
    //OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map)

	// 添加 GeoServer 发布的图层
	L.tileLayer.wms('http://192.77.108.22:8888/geoserver/my_workspace_geotiff/wms', {
		layers: `my_workspace_geotiff:${imageName}`, // 图层名称，格式为 workspace:layerName
		format: 'image/png', // 图层格式
		transparent: true, // 图层是否透明
		attribution: 'GeoServer'
	}).addTo(map);
})

</script>

<style>

</style>
