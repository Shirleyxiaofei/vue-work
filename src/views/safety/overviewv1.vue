<template>
    <div class='safety_overview'>
        <el-container>
            <el-main class="p_t_l_0 ">
                <!-- 头部 -->
                <el-row :gutter="20">
                    <el-col :span="8" >
                        <div class="safety-block">
                            <div class="block-tip border_b_1">ECS保护状态</div>
                            <div class="block-article">
                                <el-row class="h90"> 
                                    <el-col :span="12" class="grid-content">
                                        <p class="m_b_7_t_6">
                                            <span class="font_28">{{amount.onlineHostCount}}</span>
                                            <span class="font_12_c">(台)</span>
                                        </p>
                                        <span class="font_12">在线</span>
                                    </el-col>
                                    <el-col :span="12"  class="grid-content">
                                        <p class="m_b_7_t_6">
                                            <span class="font_28">{{amount.outlineHostCount}}</span>
                                            <span class="font_12_c">(台)</span>
                                        </p>
                                        <span class="font_12">离线</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8" >
                        <div class="safety-block">
                            <div class="block-tip">异常登录</div>
                            <div class="block-article">
                                <el-row class="h90"> 
                                    <el-col :span="14" class="grid-content">
                                        <div class="err-login"></div>
                                    </el-col>
                                    <el-col :span="10"  class="grid-content">
                                        <p class="m_15">
                                            <span class="font_28">{{amount.exceptionEventCount}}</span>
                                            <span class="font_12_c">(条)</span>
                                        </p>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8" >
                        <div class="safety-block">
                            <div class="block-tip">文件一致性检测</div>
                            <div class="block-article">
                                <el-row class="h90"> 
                                    <el-col :span="14" class="grid-content">
                                        <div class="monitor-filetest"></div>
                                    </el-col>
                                    <el-col :span="10"  class="grid-content">
                                        <p class="m_15">
                                            <span class="font_28">{{amount.integrityEventCount}}</span>
                                            <span class="font_12_c">(条)</span>
                                        </p>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row> 
            </el-main>  
            <el-aside style="width:161px">
                <div class="p_t_l_0_update ">
                    <p class="p_t_l_0_update_w1">当前版本：基础版</p>
                    <p class="p_t_l_0_update_w2">升级专业版>></p>
                </div>
            </el-aside>
        </el-container>    
        <!-- 主体-->
        <div class="main-chart">
            <div class="chart-tip border_b_1">
                <p >入侵检测</p>
                <div class="float_r">
                    <el-radio-group v-model="chooseDays" size="small" @change="getExceptionEvent">
                        <el-radio-button label="7" >7天</el-radio-button>
                        <el-radio-button label="30">30天</el-radio-button>
                    </el-radio-group>
                    <!-- <button class="button-time button-active">7天</button>
                    <button class="button-time ">30天</button>       -->
                </div>
            </div>
            <el-row :gutter="20" >
                <el-col :span="14"  class="border_r_1 p_20"  style="padding:20px 20px 20px 30px;">
                    <p class="font_12">入侵检测/异常登录事件趋势</p>
                    <line-chart :chart-data="lineChartData"  v-loading='loading1'></line-chart>
                </el-col>
                    <el-col :span="10" class="p_20"  style="padding:20px 30px 20px 20px;">
                    <p class="font_12">TOP安全事件主机</p>
                    <div class="margin_t_25" v-loading='loading2'>
                        <ul class="box_Card">
                            <li class="center" v-if='boxLists.length == 0'>暂无数据</li>
                            <li v-for="(item,index) in boxLists" :key=index>
                                <p class="box_txt">{{item.agent_ip}}</p>
                                <div class="box_chart">
                                    <div class="bar_chart"  v-bind:style="{width: item.widthData}"></div>
                                    <span class="bar_num">{{item.sum}}(条)</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row> 
        </div>    
    </div>
</template>
<script>
import LineChart from './components/LineChart'
import {setsafetyUsername,setsafetyUserid} from '@/utils/auth'
import { amounts,exceptionEvent, getToken } from '@/api/safety'

import $ajax from 'axios'
export default {
    components:{
        LineChart
    },
    data() {
        return {
            lineChartData: {
                actualData: [],
                lineChartTime:[],
            },
            boxLists:[{agent_ip:"",sum:0,host_Id:"", widthData:'0%' }],
            chooseDays: '7',
            amount: {
                onlineHostCount: 0,
                exceptionEventCount: 0,
                outlineHostCount: 0,
                integrityEventCount: 0
            },
            loginToken: '',
            loading1: true,
            loading2: true,
        };
    },
    created(){
        this.getAmounts();
        // this.getExceptionEvent();
    },
    methods: {
        handleSetLineChartData(type) {
            this.lineChartData = lineChartData[type]
        },
        getAmounts(){

        let url = 'http://172.18.208.18:8091/?ticket=ST-849-L4b6d14wopJksmlamhDn-com.ctg.cas001#/console' ;
            console.log(123,url);
            
            let firstI = url.indexOf('='),
                lastI = url.lastIndexOf('#');
            console.log(123,firstI,lastI);
                
              let  token = url.slice(firstI+1, lastI);
            console.log(123,token);
            // let ser = 'remoteGetHostInfoByUser'
            // amounts(ser).then(res=>{
            //     console.log('获取总览数据成功', res);
            //     this.amount = res
            // }).catch(err=>{
            //     console.log('获取总览数据失败', err);
            // })
        },
        getExceptionEvent(){
            this.getRemoteGetEvent()
            this.loading1 = true;            
            let ser = 'remoteGetExceptionEventByUser'
            let paramsData = '<days>'+this.chooseDays+'</days>'
            exceptionEvent(ser,paramsData).then(res=>{
                console.log('获取异常登录事件成功', res);
                var list =  res.exceptionEventList;
                var newList = [];
                var newListTime = [];
                for (var i=0 ;i<list.length;i++){
                    newList.push(list[i].sum)
                    newListTime.push(list[i].createTime)
                }
                this.lineChartData.actualData = newList;
                this.lineChartData.lineChartTime = newListTime;
                this.loading1 = false;
            }).catch(err=>{
                console.log('获取异常登录事件失败',err)
            })
        },
        getRemoteGetEvent(){
            this.loading2 = true;
            let ser = 'remoteGetEventCount'
            let paramsData = '<days>'+this.chooseDays+'</days>'
            exceptionEvent(ser,paramsData).then(res=>{
                console.log('获取安全事件主机信息成功', res);
                var list =  res.list;
                for (var i=0 ;i<list.length;i++){
                    list[i].widthData = (list[i].sum/list[0].sum*0.83*100).toFixed(1)+'%'
                }
                this.boxLists = list;
                this.loading2 = false;
            }).catch(err=>{
                console.log('获取安全事件主机信息失败',err)
            })
        }
    }
};
</script>
<style lang="scss">
// @import "./style.css";
.safety_overview {
  .p_t_l_0 {
    padding-left: 0;
    padding-top: 0;
    color: #333;
  }
  .safety-block {
    height: 130px;
    background-color: #fff;
  }
  .block-tip {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
  }
  .border_b_1 {
    border-bottom: 1px solid #f1f4f9;
  }
  .border_r_1{
    border-right: 1px solid #f1f4f9;      
  }
  .margin_t_25{
      margin-top: 25px;
  }
  .font_12_c {
    font-size: 12px;
    color: #c0c9dd;
  }
  .font_12 {
    font-size: 12px;
  }
  .font_28 {
    font-size: 28px;
    margin: 2px;
  }
  .m_b_7_t_6 {
    margin-bottom: 7px;
    margin-top: 6px;
  }
  .m_15 {
    margin-top: 15px;
    margin-left: 15px;
  }
  .p_20{
      padding: 20px;
  }
  .center{
      text-align: center;
  }
  .h90 {
    height: 90px;
    text-align: center;
    padding: 10px 20px;
    .grid-content {
      vertical-align: middle;
    }
  }
  .err-login {
    width: 125px;
    height: 64px;
    display: inline-block;
    background: url(../../assets/safety/monitor-Abnormal.png) no-repeat center
      center;
  }
  .monitor-filetest {
    width: 125px;
    height: 64px;
    display: inline-block;
    background: url(../../assets/safety/monitor-filetest.png) no-repeat center
      center;
  }
  .p_t_l_0_update {
    background-color: #fff;
    height: 130px;
    width: 161px;
    float: right;
  }
  .p_t_l_0_update_w1 {
    display: block;
    text-align: center;
    font-size: 12px;
    height: 22px;
    padding-top: 18px;
  }
  .p_t_l_0_update_w2 {
    text-align: center;
    color: #fff;
    font-size: 14px;
    display: block;
    width: 161px;
    height: 90px;
    line-height: 100px;
    background: url(../../assets/safety/monitor-update.png) no-repeat top
      center;
  }
  .main-chart {
    width: 100%;
    height: 473px;
    background-color: #fff;
    // margin-top: 20px;
  }
    .chart-tip {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        p {
        display: inline-block;
        }
        .float_r {
        float: right;
            .el-radio-group{
                margin-top: -3px;
            }
            .el-radio-button:first-child .el-radio-button__inner {
                height: 25px;
                line-height: 25px;
                width: 60px;
                padding: 0;
                color: #333;        
                border: 1px solid #fff;
                background-color: #fff;
            }
            .el-radio-button:last-child .el-radio-button__inner{
                height: 25px;
                line-height: 25px;
                width: 60px;
                padding: 0;
                color: #333;      
                border: 1px solid #fff;
                background-color: #fff;   
                box-shadow: none;            
            }
            .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                border: 1px solid #3cc1f0;
                color: #3cc1f0;
                border-radius: 4px;
                background-color: #fff;
            }
        }
    }
   
    .bar_chart {
        width: 83%;
        height: 15px;
        background-color: #f9cd76;
        float: left;
    }
    .bar_num{
        float: right;
    }
    .box_Card {
        .box_chart{
            width: 100%;
            height: 20px;
            margin: 10px 15px 15px 0;
        }
        li:nth-child(2) div  div{
            background-color: #f8d287;
        }
        li:nth-child(3) div div{
            background-color: #f5d69a;
        }
        li:nth-child(4) div div{
            background-color: #f4ddae;
        }
        li:nth-child(5) div div{
            background-color: #f5e5c5;
        }
        li:nth-child(6) div div{
            background-color: #f8ecd4;
        }
    }
    .box_txt{
        width: 200px;
    }
}
</style>