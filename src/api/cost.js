import request from '@/utils/request'
import { getRegionId } from '@/utils/auth'

//获取订单列表
export function getOrderList(params) {
	params.regionid || (params.regionid = getRegionId())
	return request({
		url:'console/pay/orderlist/',
		method:'get',
		params:params
	})
}
//获取云服务续费列表
export function getEcsServerList(params) {
	//params.regionid || (params.regionid = getRegionId())
	return request({
		url:'console/ecm/ecs/servers/',
		method:'get',
		params:params
	})
}
//ecm续费
export function renewPay(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/ecm/ecs/renew/',
		method:'post',
		data:params
	})
}
//获取弹性IP续费列表
export function getIpServerList(params) {
	params.regionid || (params.regionid = getRegionId());
	return request({
		url:'console/network/eipsdata/',
		method:'get',
		params:params
	})
}