import request from '@/utils/request'
import { getRegionId, getZoneId } from '@/utils/auth'


export function listZone(){
	let data = {
		regionid:getRegionId(),
	}
  return request({
    url:'console/ecm/ecs/zones/',
    method:'get',
    aysnc:'false',
    params:data
  })

}

export function getEbsList(params){
	let data;
	if(params.name){
		data = {
			regionid:getRegionId(),
			zoneid:getZoneId(),
			limit: params.limit || 10,
			page:params.page || 1,
			status:params.status,
			attached:params.attached,
			name:params.name,
			has_disk:params.has_disk
		}
	}else if(params.id){
		data = {
			limit: params.limit || 10,
			regionid:getRegionId(),
			page:params.page || 1,
			attached:params.attached,
			status:params.status,
			id:params.id,
			has_disk:params.has_disk
		}
	}else{
		data = {
			regionid:getRegionId(),
			zoneid:getZoneId(),
			limit: params.limit || 10,
			page:params.page || 1,
			status:params.status,
			attached:params.attached,
			keyword:params.keyword,
			has_disk:params.has_disk
		}
	}
	return request({
		url:'console/ecm/ebs/volumes/',
		method:'get',
		params:data
	})

}
export function GetEbsDetailBackup(serverId){
	let data = {
		regionid:getRegionId(),
		volume_id:serverId
	}
	return request({
		url:'console/ecm/bks/volumebackupdata/',
		method:'get',
		params:data
	})

}

export function GetEbsDetail(serverId){
	let data = {
		regionid:getRegionId(),
		id:serverId
	}
	return request({
		url:'console/ecm/ebs/volumes/',
		method:'get',
		params:data
	})

}

export function EbsDetach(volumed_id,serverId){
	let data = {
		regionid:getRegionId(),
		instance_id:serverId
	}
	return request({
		url:'console/ecm/ebs/volumedetach/'+volumed_id+'/',
		method:'post',
		data
	})
}

export function EbsAttach(volume_id,serverId){
	let data = {
		regionid:getRegionId(),
		instance_id:serverId
	}
	return request({
		url:'console/ecm/ebs/volumeattach/'+ volume_id + '/',
		method:'post',
		data
	})
}

export function CreateEbs(data){
//	data.regionid = getRegionId();
	return request({
		url:'console/ecm/ecs/addvolume/',
		method:'post',
		data
	})
}

export function renewEbs(data){
	data.regionid = getRegionId();
	return request({
		url:'console/ecm/ecs/renew/',
		method:'post',
		data
	})
}

export function unsubscribeEbs(volumed_id){
	let data = {
		regionid:getRegionId(),
	}
	return request({
		url:'console/refundorder/'+volumed_id+'/',
		method:'post',
		data
	})
}

export function changeEbsName(data){
	data.regionid = getRegionId();
	return request({
		url:'console/ecm/ebs/volumes/',
		method:'put',
		data
	})
}
