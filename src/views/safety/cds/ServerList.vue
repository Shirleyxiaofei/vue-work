<template>
  <div class="ecm_monitor">
    <div class="top">
      <el-row>
          <el-col :span="24">
            <div class="left">
              <p class="node_name">{{name}}</p>
              <span class="areaButton" :class="{'areaButton-bg': currentId == area.id}" @click="changeRegion(area,index)" v-for="(area,index) in areas" :key="index">
                {{area.zoneName}} ( {{area.count}} )
              </span>
            </div>
          </el-col>
      </el-row>
    </div>
    <div class="line"></div>
    <div class="content">
      <el-row>
        <el-col :span="15">
          <div class="content-top left">
            <span @click="openInstallAgent">安装Agent</span>
            <span @click="openUninstallAgent">卸载Agent</span>
            <span @click="openProtection">开启防护</span>
            <span @click="closeProtection">关闭防护</span>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="content_top right">
            <el-input placeholder="服务器名称或IP" v-model="input5" class="input-with-select" size="small" style="width:350px">
                <el-button slot="append" icon="el-icon-search" v-on:click="getServiceList"></el-button>
              </el-input>
          </div>
        </el-col>
      </el-row>
      <div class="mainTable">
        <el-table
            :show-overflow-tooltip="true"
            @selection-change="handleSelectionChange"
            @filter-change="filterChange"
            
            :data="ecmListData"
            style="width: 100%">
            <el-table-column
                  type="selection"
                  width="50">
          </el-table-column>
          <el-table-column
            label="服务器IP/名称"
            width="140">
            <template slot-scope="scope">
              <router-link :to='{ name: "serverdetails",params: {ip:scope.row.agent_ip,id:scope.row.host_id,zone_id: currentId,guid: scope.row.agent_guid,atype:atype}}'>
                <el-button size="mini" type="text">
                  {{scope.row.agent_ip}}
                </el-button>
                <div class="serviceName">{{scope.row.hostname}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="操作系统">
            <template slot-scope="scope">
              <el-tooltip placement="bottom" class="item" effect="dark">
                <div slot="content">{{scope.row.os_type}}</div>
                <div class="serviceStyle">{{scope.row.os_type}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="防护状态"
            width="100"
            :filters="[{ text: '未激活', value: '{a:14,b:0}' }, { text: '离线', value: '{a:13,b:0}' },{text: '防护中', value: '{a:12,b:1}'},{text: '关闭防护', value: '{a:12,b:0}'}]"
            column-key = 'filter1'
            :filter-multiple="true">
            <template slot-scope="scope">
              {{scope.row.statusName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="protect_level"
            label="防护级别"
            width="100"
            :filters="[{ text: '基础版', value: '0' }, { text: '专业版', value: '1' }]"
            column-key = 'filter2'
            :filter-multiple="true">
            <template slot-scope="scope">
              {{scope.row.protect_level == 1 ? "专业版" : "基础版"}}
            </template>
          </el-table-column>
          <el-table-column
            label="异常登录">
            <template slot-scope="scope">
              {{scope.row.legalLoginTotal}}
            </template>
          </el-table-column>
          <el-table-column
            label="进程数">
            <template slot-scope="scope">
              {{scope.row.processTotal}}
            </template>
          </el-table-column>
          <el-table-column
            label="端口数">
            <template slot-scope="scope">
              {{scope.row.portTotal}}
            </template>
          </el-table-column>
          <el-table-column
            label="文件检测不一致数"
            width="180">
            <template slot-scope="scope">
              {{scope.row.integrityEventCount}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="installAgent(scope.row.agent_guid)">安装
              </el-button>
              <el-button
                size="mini"
                type="text"
                :disabled="scope.row.agent_statecode !== '12'"
                @click="uninstallAgent(scope.row)">卸载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-if="totalPage>10"
            @size-change="handleSizeChange"
            @current-change="getServerRegion"
            :current-page="currentPage"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
          </el-pagination>
          <el-pagination
            v-else
            layout="">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="卸载"
        :visible.sync="dialogTableUninstall"
        >
        <div class="content" style="overflow:hidden;">
          <div class="left" style="float:left;margin-right:20px;">
            <i class="">
              <svg-icon icon-class="warn" style="font-size:50px;color:#f9cd76"></svg-icon>
            </i>
          </div>
          <div class="right" style="float:left;margin-bottom:20px;">
            <p>确定对所选服务器进行卸载吗？</p>
          </div>
        </div>
        <el-table
          :data="uninstallData"
          style="width: 100%">
          <el-table-column
            label="服务器名称">
            <template slot-scope="scope">
              {{ scope.row.hostname }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作系统">
            <template slot-scope="scope">
              {{ scope.row.os_type }}
            </template>
          </el-table-column>
          <el-table-column
            label="防护状态">
            <template slot-scope="scope">
              {{scope.row.statusName}}
            </template>
          </el-table-column>
        </el-table>
        <p style="color:#fd3434;margin-top:20px">
          提示 : 卸载Agent，会使服务器失去安全监控，处于安全风险中，请您谨慎操作！
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button
            class="f_btn1 f_btn_l" @click="uninstallDisappear1">取 消</el-button>
            <el-button
            class="f_btn1 f_btn_c" >手动卸载</el-button>
          <el-button
            type="primary"
            class="f_btn1 f_btn_r" @click="uninstallDisappear">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="安装"
        :visible.sync="dialogTableInstall"
        >
        <div class="content">
          <span>{{this.agentData.agent_ip}}</span>
          <span>{{this.agentData.hostname}}</span>
          <div class="agent_key" style="float:left;margin-right:20px; word-break:break-all;">
            {{this.agentData.useKey}}
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            class="f_btn f_btn_l" v-clipboard:copy="agentData.useKey"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">复 制</el-button>
          <el-button
            type="primary"
            class="f_btn f_btn_r"
            @click="closeInstallAgent">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="开启防护"
        :visible.sync="dialogTableOpenPro"
        >
        <div class="content" style="overflow:hidden;">
          <div class="left" style="float:left;margin-right:20px;">
            <i class="">
              <svg-icon icon-class="warn" style="font-size:50px;color:#f9cd76"></svg-icon>
            </i>
          </div>
          <div class="right" style="float:left;margin-bottom:20px;">
            <p>确定对所选服务器开启防护吗？</p>
          </div>
        </div>
        <el-table
          :data="openProtectionData"
          style="width: 100%">
          <el-table-column
            label="服务器名称">
            <template slot-scope="scope">
              {{ scope.row.hostname }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作系统">
            <template slot-scope="scope">
              {{ scope.row.os_type }}
            </template>
          </el-table-column>
          <el-table-column
            label="防护状态">
            <template slot-scope="scope">
              {{scope.row.statusName}}
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button
            class="f_btn f_btn_l" @click="openProDisappear">取 消</el-button>
          <el-button
            type="primary"
            class="f_btn f_btn_r" @click="openProDisappear1">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="关闭防护"
        :visible.sync="dialogTableClosePro"
        >
        <div class="content" style="overflow:hidden;">
          <div class="left" style="float:left;margin-right:20px;">
            <i class="">
              <svg-icon icon-class="warn" style="font-size:50px;color:#f9cd76"></svg-icon>
            </i>
          </div>
          <div class="right" style="float:left;margin-bottom:20px;">
            <p>确定对所选服务器关闭防护吗？</p>
          </div>
        </div>
        <el-table
          :data="closeProtectionData"
          style="width: 100%">
          <el-table-column
            label="服务器名称">
            <template slot-scope="scope">
              {{ scope.row.hostname }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作系统">
            <template slot-scope="scope">
              {{ scope.row.os_type }}
            </template>
          </el-table-column>
          <el-table-column
            label="防护状态">
            <template slot-scope="scope">
              {{scope.row.statusName}}
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            class="f_btn f_btn_l" @click="closeProDisappear">取 消</el-button>
          <el-button
            type="primary"
            class="f_btn f_btn_r" @click="closeProDisappear1">确 定</el-button>
        </div>
      </el-dialog>
     
      <el-dialog
        title="提示"
        :visible.sync="dialogTableConfirm"
        >
        <div class="content" style="overflow:hidden;">
          <div class="left" style="width:100%;text-align: center;margin-top: 20px; margin-bottom: 20px;">
            请选择要操作的计算机！
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="install_key_agent" @click="dialogTableConfirm = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>



<script>
  import RegionList from '@/components/RegionList'
  import ConsoleTable from '@/components/ConsoleTable'
  import {serverRegion} from '@/api/safety'
  import $ajax from 'axios'
  import i18n from '@/lang'
  import VueClipboard from 'vue-clipboard2'

  export default {
    components:{
      RegionList,
      ConsoleTable,
    },
    data (){
      return {
        name: i18n.common.serverList,
        input5: '',
        currentId: 1,
        atype: 1,
        areas: [],
        agentStateCode:[],
        uninstallData: [],
        openProtectionData: [],
        closeProtectionData: [],
        currentPage: 1,
        totalPage: 1,
        agentData:[],
        agentKey:'',
        agentGuid: '',
        agentGuid1: '',
        agentGuidOpenPro: '',
        dialogTableUninstall: false,
        dialogTableUninstall1: false,
        dialogTableInstall: false,
        dialogTableInstall1: false,
        dialogTableConfirm: false,
        dialogTableOpenPro:false,
        dialogTableClosePro: false,
        protectStatus:'',
        pageSize: 10,
      ecmListData:[],
      selectionChange: '',
      tableStatus:'12,13,14',
      protect_level: '1,2',
      protect_status: '0,1'

      }
    },
    created(){
        this.getServerRegion();
        this.getServiceList();
        // this.getAgentCode()
    },
    methods: {
      dedupe(array){
        return Array.from(new Set(array));
      },
      // 表头筛选
      filterChange(value) {

        if(value.filter1){
          // 筛选状态
          if(value.filter1.length>0){
            for(var i=0;i<value.filter1.length;i++){
              arr = eval('(' + value.filter1[i] + ')'),
              arr1.push(arr)
              arr2.push(arr1[i].a)
              arr3.push(arr1[i].b)
              this.tableStatus = this.dedupe(arr2).join(',')
              this.protect_status = this.dedupe(arr3).join(',')
            }
          }else{
            this.tableStatus = '12,13,14';
            this.protect_status = '0,1'
          }
        }else if(value.filter2){
          // 筛选告警类型
          if(value.filter2.length>0){
            this.protect_level = value.filter2.join(',')
          }else{
            this.protect_level = '1,2'
          }
        }
        this.getServiceList()
      },
      getServiceList(){
        let ser2 = 'remoteGetHostList',
            paramStr = '<paramStr>{"paramStr":{ "currentPage":"'+
                  this.currentPage +'","agent_statecode":"'+this.tableStatus+'","protect_level":"'+this.protect_level+'" ,"protect_status":"'+this.protect_status+'" ,"pageSize":"'+this.pageSize+'","zoneId":"'+ this.currentId +'","queryParam":"'+
                  this.input5 +'" }}</paramStr>'
        serverRegion(ser2,paramStr).then( res => {
          let serverContent = res.hostList;
          this.ecmListData = serverContent;
          this.totalPage = res.totalElements;
        }).catch( err => {
          console.log('获取存储数据失败', err )
        })
      },
      // 没有选中时，弹出提示框
      handleSelectionChange(val){
        this.selectionChange = val;
      },
      onCopy(){
        this.$message({
          message: "复制成功"
        })
      },
      onError(e){
        this.$message({
          message: "复制失败"
        })
      },
      // 行
      // 打开卸载的弹框
      uninstallAgent(val){
        let uninstallDataList = [];
        uninstallDataList.push(val);
        this.uninstallData = uninstallDataList;
        this.agentGuid1 = val.agent_guid;
        this.dialogTableUninstall = true;
      },
      // 关闭卸载的弹框-确定
      uninstallDisappear(){
        this.dialogTableUninstall = false;
        this.getUninstallAgent();
        this.agentGuid1 = '';
        this.uninstallData = []
      },
      // 关闭卸载的弹框-取消
      uninstallDisappear1(){
        this.dialogTableUninstall = false;
        this.agentGuid1 = '';
        this.uninstallData = []
      },
      // 总卸载
      openUninstallAgent(){
        if(this.selectionChange.length == '0'){
          this.$message({
            message: '请选择一项数据进行处理'
          });
        }else if(this.selectionChange.length > 1){
          this.$message({
            message: '只能选择一项数据进行处理'
          });
        }else{
          let uninstallDataList = [];
          uninstallDataList.push(this.selectionChange);
          this.uninstallData = uninstallDataList[0];
          if(this.uninstallData[0].agent_statecode == '13'){
            this.$message({
              message: '该计算机处于离线状态'
            });
          }else{
            this.agentGuid1 = this.selectionChange[0].agent_guid;
            this.dialogTableUninstall = true;
          }
          
        }
      },
      //安装
      installAgent(val){
        this.agentGuid = val;
        this.dialogTableInstall = true;
        this.getInstallAgent();
      },
      // 关闭安装
      closeInstallAgent(){
        this.dialogTableInstall = false;
        this.agentGuid = '';
      },
      // 总安装
      openInstallAgent(){
        if(this.selectionChange.length == '0'){
          this.$message({
            message: '请选择一项数据进行处理'
          });
        }else if(this.selectionChange.length > 1){
          this.$message({
            message: '只能选择一项数据进行处理'
          });
        }else{
          this.agentGuid = this.selectionChange[0].agent_guid;
          this.dialogTableInstall = true;
          this.getInstallAgent();
        }
      },
      // 安装接口
      getInstallAgent(){
        let ser = 'getComputerKeyByGuid',
            paramStr = '<hostguid>'+ this.agentGuid +'</hostguid>';
        serverRegion(ser,paramStr).then( res => {
          let agentDataList = res;
          agentDataList.useKey = res.key.replace(/&amp;/g,'&').replace(/\n/,'');
          this.agentData = agentDataList;
        }).catch( err => {
          console.log( '获取数据失败',err)
        })
      },
      // 卸载
      getUninstallAgent(){
        let ser = 'uninstallagent',
            paramStr = '<uninstallStr>{"agent_guid":"'+ this.agentGuid1 +'"}</uninstallStr>';
        serverRegion(ser,paramStr).then( res => {

        }).catch( err => {
          console.log( '获取数据失败',err)
        })
      },
      // 开启防护
      // 开启防护-打开弹框
      openProtection(){
        if(this.selectionChange.length == '0'){
          this.$message({
            message: '请选择一项数据进行处理'
          });
        }else if(this.selectionChange.length > 1){
          this.$message({
            message: '只能选择一项数据进行处理'
          });
        }else{
          let openProtectionList = [];
          openProtectionList.push(this.selectionChange);
          this.agentGuidOpenPro = this.selectionChange[0].agent_guid;
          this.openProtectionData = openProtectionList[0];
          if(this.openProtectionData[0].agent_statecode == "13"){
            this.$message({
              message: '该机器处于离线状态'
            })
          }else if(this.openProtectionData[0].statusName == "防护中"){
            this.$message({
              message: '该计算机已在防护中！'
            })
          }else{
            this.dialogTableOpenPro = true;
            this.protectStatus = '1';
          }
          
        }
      },
      // 开启防护-关闭弹框-关闭
      openProDisappear(){
        this.dialogTableOpenPro = false;
        this.agentGuidOpenPro = '';
        this.openProtectionData = []
        this.protectStatus = ''
      },
      // 开启防护-关闭弹框-确定
      openProDisappear1(){
        this.dialogTableOpenPro = false;
        this.getOpenProtection();
        this.agentGuidOpenPro = '';
        this.openProtectionData = []
        this.protectStatus = ''
      },
      // 关闭防护
      // 关闭防护-打开弹框
      closeProtection(){
        if(this.selectionChange.length == '0'){
          this.$message({
            message: '请选择一项数据进行处理'
          });
        }else if(this.selectionChange.length > 1){
          this.$message({
            message: '只能选择一项数据进行处理'
          });
          
        }else{
          let closeProtectionList = [];
          closeProtectionList.push(this.selectionChange);
          this.agentGuidOpenPro = this.selectionChange[0].agent_guid;
          this.closeProtectionData = closeProtectionList[0];
          if(this.closeProtectionData[0].agent_statecode == "13"){
            this.$message({
              message: '该机器处于离线状态'
            })
          }else if(this.closeProtectionData[0].statusName == "关闭防护"){
            this.$message({
              message: '该计算机已关闭防护！'
            })
          }else{
            this.dialogTableClosePro = true;
            this.protectStatus = '0';
          }
        }
      },
      // 关闭防护-关闭弹框-关闭
      closeProDisappear(){
        this.dialogTableClosePro = false;
        this.agentGuidOpenPro = '';
        this.closeProtectionData = []
        this.protectStatus = ''
      },
      // 关闭防护-关闭弹框-确定
      closeProDisappear1(){
        this.dialogTableClosePro = false;
        this.getCloseProtection();
        this.agentGuidOpenPro = '';
        this.closeProtectionData = []
        this.protectStatus = ''
      },
      // 防护-接口
      getOpenProtection(){
        let ser = 'remoteUpdateProtectStatusHost',
            paramStr = '<agent_guid>'+ this.agentGuidOpenPro +'</agent_guid>'+
                       '<protectStatus>'+ this.protectStatus +'</protectStatus>';
        serverRegion(ser,paramStr).then( res => {
          this.getServiceList();
        }).catch( err => {
          console.log('获取数据失败',err)
        })
      },
      getCloseProtection(){
        let ser = 'remoteUpdateProtectStatusHost',
            paramStr = '<agent_guid>'+ this.agentGuidOpenPro +'</agent_guid>'+
                       '<protectStatus>'+ this.protectStatus +'</protectStatus>';
        serverRegion(ser,paramStr).then( res => {
          this.getServiceList();
        }).catch( err => {
          console.log('获取数据失败',err)
        })
      },
      getAgentCode(value,row){
        return row.agent_statecode == value;
      },
      getAgentCode1(value,row){
        return row.protect_level == value;
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      changeRegion(zone,index) {
        this.currentId = zone.id;
        this.getServiceList();
      },
      getServerRegion(){
          let ser = 'remoteAllZone',
              ser1 = 'remoteGetHostZoneList';
          serverRegion(ser).then( res => {
            let areaName = res.zonelist;
            for(var key in areaName){
                  areaName[key].count = 0;
                }
                this.areas = areaName;
          }).catch( err => {
            console.log('获取存储数据失败', err )
          })
          serverRegion(ser1).then( res => {
            for(let key in this.areas){
              let areaCount = res.zoneList;
                for(let i in areaCount){
                  if(this.areas[key].id === areaCount[i].zoneId){
                    this.areas[key].count = areaCount[i].count;
                  }
                }
              }
          }).catch( err => {
            console.log('获取存储数据失败', err )
          })
      },

    }

  }
</script>

<style lang="scss" scoped="scoped">
  .ecm_monitor{

      background: #f6f8fb;
      .el-input{
        float:right;
        margin-right:20px;
      }
     .content{
        .content_top{
          background: #ffffff;
          padding-top: 34px;
          padding-left: 20px;
          padding-bottom: 20px;
          overflow:hidden;
        }
        .content-top{
        width:100%;
        height:100%;
        line-height:82px;
        background:#ffffff;
        padding-top:30px;
        padding-left:20px;
        padding-bottom:22px;
        overflow:hidden;
        span{
          display: block;
          padding:0 10px;
          height: 34px;
          background: #f0f2f7;
          float: left;
          text-align: center;
          line-height: 34px;
          border-radius: 5px;
          margin-right: 10px;
          font-size: 11px;
          padding: 0 19px;
          cursor: pointer;
          -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;

        }
      }
    }
    .top{
      background: #ffffff;
      border-bottom: 1px solid #f8f9fb;
      position: relative;
      &:after{
        content: '';
        height: 0;
        width: 0;
        border: 8px solid #f6f8fb;
        border-color: transparent transparent transparent #f6f8fb;
        position: absolute;
        bottom: -9px;
        left: 0px;
      }
      &:before{
        content: '';
        height: 0;
        width: 0;
        border: 8px solid #f6f8fb;
        border-color: transparent #f6f8fb transparent transparent;
        position: absolute;
        bottom: -9px;
        right: 0px;
      }
      .left{
        padding-left: 2%;
        text-align: left;
        .node_name{
        font-size: 14px;
        color: #333333;
        padding: 20px 0px;
      }
      .areaButton{
        display: block;
        min-width: 68px;
        height: 30px;
        margin-bottom: 15px;
        background: #f0f2f7;
        float: left;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
        margin-right: 10px;
        font-size: 11px;
        cursor: pointer;
        -webkit-user-select:none;
          -moz-user-select:none;
          -ms-user-select:none;
          user-select:none;
      }
      .areaButton-bg{
        background: #f9cd76;
        color: #ffffff;
      }
      .areaButton:hover{
        background: #f9cd76;
        color: #ffffff;
      }
    }
    .right{
        padding-top: 52px;
        .createButton{
        width: 120px;
        height: 36px;
        background: #3ac0f1;
        border-color: #3ac0f1;
        color: #ffffff;
        font-size: 12px;
        margin-right: 15px;
        &:hover{
          background: #5ed4ff;
        }
      }
    }
    }
    .line{
        height: 10px;
        width: 100%;
        background: #f0f2f7;
        background-size: 50% 100%;
        background-repeat: no-repeat;
      }
      .pagination{
        float:right;
        margin: 20px;
      }
    .serviceStyle{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
<style lang="scss">
.ecm_monitor{
  .el-dialog__header {
    background-color: #323c4e;
    height:40px;
    line-height: 40px;
    padding: 0;
    padding-left: 20px;
    &:nth-child(3){
      background-color: #fff !important;
    }
  }
  .el-dialog__title {
    color:#e4e5e7;
    font-size: 12px;
  }
  .el-dialog__footer {
    padding:0;
    width: 100%;
    font-size: 0;
  }
  .el-dialog__footer .f_btn {
    margin: 0;
    background-color: #0f0;
    width: 50%;
    border: none;
  }
  .el-dialog__footer .f_btn1 {
    margin: 0;
    background-color: #0f0;
    width: 33.3%;
    border: none;
  }
  .el-dialog__footer .f_btn_l,
  .el-dialog__footer .f_btn_c {
    background-color: #f0f2f7;
  }
  .agent_key{
    margin-bottom: 25px;
    border: 1px solid #eee;
    padding: 10px;
  }
  .install_key_agent{
    width:100%;
    background-color: #f9cd76;
    border:none;
  }
  .el-dialog__footer .f_btn_r {
    background-color: #f9cd76;
  }
  .el-select .el-input {
    width: 100px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-table .el-table__header-wrapper thead tr th{
    font-size: 14px;
    height: 35px;
      line-height: 35px;
      color: #333;
      padding: 0;
      background-color: #f0f2f7;

  }
  .el-table .el-table__body-wrapper tbody tr td{
    padding: 2px 0;
  }
  .servername{
    padding: 0 !important;
  }
  .server-hostname{
    line-height: 15px;
  }
  .el-input__inner:focus {
    border-color: #dcdfe6;
    outline: none;
  }
  .el-input__inner:hover {
    border-color: #dcdfe6;
    outline: none;
  }
  .el-button--mini{
    padding:0;
  }
  .serviceName{
    line-height:15px;
    font-size:12px;
    margin-top:-5px
  }
  .mainTable {
    background-color: #ffffff;
    padding: 20px;
    padding-top:4px;
    overflow:hidden;
  }
  .dialog-footer{
    background:#fff;
  }
}
</style>