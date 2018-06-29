import request from '@/utils/request'
import { getRegionId} from '@/utils/auth'

/************获取监控的下拉框配置************/
/*获取下拉框配置*/
export function getMonitorOptions(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/html/select/options/',
		method:'get',
		params:params
	})
}
/************告警模版************/
/*获取监控模板列表*/
export function getTemplateList(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/trigger/template/',
		method:'get',
		params:params
	})
}
/*添加监控模板*/
export function addTemplate(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/trigger/template/',
		method:'post',
		data:params
	})
}
/*修改监控模板*/
export function updateTemplate(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/trigger/template/',
		method:'put',
		data:params
	})
}
/*删除监控模版*/
export function delTemplate(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/trigger/template/',
		method:'delete',
		data:params
	})
}
/***监控面板***/
/*获取面板*/
export function getBoard(params) {
	params.regionid || (params.regionid = getRegionId() || 'all');
	return request({
		url:'console/ces/collect/board/',
		method:'get',
		params:params
	})
}
/*添加面板*/
export function addBoard(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/collect/board/',
		method:'post',
		data:params
	})
}
/*修改面板*/
export function updateBoard(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/collect/board/',
		method:'put',
		data:params
	})
}
/*删除面板*/
export function delBoard(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ces/collect/board/',
		method:'delete',
		data:params
	})
}
/************收藏配置信息接口************/
/*添加*/
export function addCollect(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/collect/info/',
		method:'post',
		data:params
	})
}
/*获取*/
export function getCollect(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/collect/info/',
		method:'get',
		params:params
	})
}
/*修改*/
export function updateCollect(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/collect/info/',
		method:'PUT',
		data:params
	})
}
/*删除*/
export function delCollect(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/collect/info/',
		method:'DELETE',
		data:params
	})
}
/************云服务器监控************/
/*获取列表*/
export function getEcmMonitor(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/ecs/list/',
		method:'get',
		params:params
	})
}
/************云硬盘监控************/
/*获取列表*/
export function getEvsMonitor(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/evs/list/',
		method:'get',
		params:params
	})
}
/************zabbix数据状态************/
export function getZabbixStatus(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/zds/'+params.uuid+'/',
		method:'get',
		params:params
	})
}
/************导出监控数据************/
export function exportData(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/export/',
		method:'post',
		data:params
	})
}
/************监控数据图表************/
export function getMonitorData(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ces/zbdata/',
		method:'get',
		params:params
	})
}
/************获取该用户下的资源池************/
export function getUserResources(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'/console/ecm/ecs/resources/',
		method:'get',
		params:params
	})
}