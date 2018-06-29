import request from '@/utils/request'
import { getRegionId } from '@/utils/auth'


//创建
export function CreateElb(data){
//	data.regionid = getRegionId();
	return request({
		url:'/console/network/loadbalancer/',
		method:'post',
		data
	})
}
export function getVpcList(params){
  	let data;
	data= {
      	limit: params.limit,
      	regionid:params.regionid,
      	page:params.page,
      	status:params.status,
      	id:params.id,
      	name:params.name,
      	is_lb:1
	}

  console.log(data)
  return request({
    url:'console/network/vpcs/',
    method:'get',
    params:data
  })
}

export function getElbList(params){
	let data;
	if(params.name){
		data = {
			regionid:getRegionId(),
			limit: params.limit || 10,
			page:params.page || 1,
			status:params.status,
			attached:params.attached,
			name:params.name,
		}
	}else{
		data = {
			regionid:getRegionId(),
			limit: params.limit || 10,
			page:params.page || 1,
			status:params.status,
			attached:params.attached,
			keyword:params.keyword,
		}
	}
	console.log(data)
	return request({
		url:'/console/network/loadbalancer/',
		method:'get',
		params:data
	})

}

//详情
export function GetElbDetail(ipaddress){
	let data = {
		regionid:getRegionId(),
		ipaddress:ipaddress
	}
	return request({
		url:'/console/network/loadbalancer/',
		method:'get',
		params:data
	})
}