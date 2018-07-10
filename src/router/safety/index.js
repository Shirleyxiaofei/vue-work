import Layout from '@/views/Layout'
import overview from '@/views/safety/overview' //认证页

import portCount from '@/views/safety/assetInventory/MonitorPortCount'  //监听端口清点
import porcessCount from '@/views/safety/assetInventory/porcessCount'   //运行进程清点
import checkRule from '@/views/safety/fileCheck/checkRule' //检测规则
import checkEvent from '@/views/safety/fileCheck/checkEvent' //检测规则
//服务器列表，详情
import serverList from '@/views/safety/cds/ServerList'
import serverDetails from '@/views/safety/cds/ServerDetails'
import waringSetting from '@/views/safety/waringSetting'  //告警设置
import indList from '@/views/safety/IndList'     //异常登录
import loginsecurityset from '@/views/safety/loginsecurityset'    //登陆安全设置
import checkServer from '@/views/safety/fileCheck/checkServer' //配置生效服务器
import checkTime from '@/views/safety/fileCheck/checkTime' // 配置检测频率




let Router ={
	path:'/safety',
	name:'safety',
	component: Layout,
	redirect: '/safety/overview',//'/monitor/overview',
	children:[
      	{
      		path: 'overview',
      		name: 'overview',
      		component: overview,
		},
		{
			path: 'assetInventory/portCount',
			name: 'portCount',
			component: portCount,
		},
		{
			path: 'assetInventory/porcessCount',
			name: 'porcessCount',
			component: porcessCount,
		},
		{
			path: 'fileCheck/checkRule',
			name: 'checkRule',
			component: checkRule,
		},
		{
			path: 'cds/serverList',
			name: 'serverlist',
			component: serverList,
		},
		{
			path: 'cds/serverDetails/:ip/:id/:zone_id/:guid/:atype',
			name: 'serverdetails',
			component: serverDetails,
		},
		{
			path: 'waringSetting',
			name: 'waringSetting',
			component: waringSetting,
		},
		{
			path: 'indList',
			name: 'indList',
			component: indList,
		},{
            path: 'loginsecurityset',
            name: 'loginsecurityset',
            component: loginsecurityset,
        },
		{
			path: 'fileCheck/checkEvent',
			name: 'checkEvent',
			component: checkEvent,
		},
		{
			path: 'fileCheck/checkServer',
			name: 'checkServer',
			component: checkServer,
		},
		{
			path: 'fileCheck/checkTime',
			name: 'checkTime',
			component: checkTime,
		}


	]
};
export default Router;