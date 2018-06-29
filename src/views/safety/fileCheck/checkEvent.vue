<template>
  <div class="ind_monitor">
    <div class="top">
      <el-row>
        <el-col :span="19">
          <div class="left">
            <p class="node_name">{{name}}</p>
            <!-- {{areas}} -->
            <!-- <span class="areaButton" v-for="(item,index) in areas" :key=index>
                {{ item.zoneName }} ({{ item.count }})
            </span> -->
            <span class="areaButton"
                  :class="{'areaButton-bg':currentId==zone.id}"
                  @click="changeRegion(zone,index)"
                  v-for="(zone,index) in zoneList" :key='index'>
                  {{zone.zoneName + '（' + zone.count +'）'}}
            </span>
          </div>
        </el-col>
        <!-- <el-col :span="5">
          <div class="ind-header-right">
            <router-link :to='{ name:"checkRule" }'>
            <el-button class="areaRightButton right" type="primary">文件一致性检测规则</el-button>
            </router-link>
          </div>
        </el-col> -->
      </el-row>
    </div>
    <div class="line"></div>
    <div class="content">
      <el-row>
        <el-col :span="15">
          <div class="content_top content_left">
            <el-button
              class="node_name h_btn"
              type="info"
              @click="changeStatus()"
              :plain="true">{{buttontextLeft}}</el-button>
          </div>
        </el-col>
       
        <el-col :span="8">
                      <el-input placeholder="服务器或IP名称" v-model="input5" class="input-with-select group" size="small" >
                      
                        <el-button slot="append" icon="el-icon-search" @click="getIntegrityEventHostList"></el-button>
                      </el-input>
                    </el-col>
      </el-row>
      <div class="mainTable">
        <!-- {{tableData3}} -->
        <el-table
                :header-align="left"
                :select-on-indeterminate="true"
                :show-overflow-tooltip="false"
                :data="tableData3"
                 @selection-change="handleSelectionChange"
                @filter-change="filterChange"
                 >
          <el-table-column
                  type="selection"
                  :selectable="selectable"
                  width="50"
                  >
          </el-table-column>

          <el-table-column
                  prop="cloudServer"
                  label="服务器IP/名称"
                  width="110">
                  <template slot-scope="scope">
                    <router-link :to='{ name: "serverdetails",params: {ip:scope.row.agent_ip,id:scope.row.host_id,zone_id:currentId,guid:scope.row.agent_guid,atype:atype}}'> 
                      <el-button :to='serverdetails' type="text" size="mini">{{scope.row.agent_ip}}</el-button>
                      <div class="serviceName">{{scope.row.hostname}}</div>
                    </router-link>
                  </template>
          </el-table-column>
          <el-table-column      
            
            label="规则名称"
            :show-overflow-tooltip='true'>
            <template slot-scope="scope">
             <!--  {{scope.row.name}} -->
              <el-tooltip placement="bottom" class="item" effect="dark" :open-delay="500">
                <div slot="content">{{scope.row.name}}</div>
                <div class="itegrityStyle">{{scope.row.name}}</div>
              </el-tooltip>
            </template>
            
          </el-table-column>
          <el-table-column
                  :show-overflow-tooltip="false"
                  prop="status"
                  label="状态"
                  :filters="[{ text: '未处理', value: 1 }, { text: '已处理', value: 0 }]"
                  :filter-multiple="true"
                  column-key = 'filter1'
                  filter-placement="bottom">
            <template slot-scope="scope">
              {{scope.row.status === 0 ? '已处理' : '未处理'}}
            </template>
          </el-table-column>
          <el-table-column 
                  label="文件"
                  width="110">
            <template slot-scope="scope">
              <!-- {{scope.row.path}} -->
              <el-tooltip 
                placement="bottom" 
                class="item" 
                effect="dark" 
                :open-delay= "500">
                <div slot="content">{{scope.row.path}}</div>
                 <div class="itegrityStyle">{{scope.row.path}}</div>
               </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="检测周期">
            <template slot-scope="scope">
              {{scope.row.checkTime}}
            </template>
          </el-table-column>
          <el-table-column
                  prop="severity"
                  label="严重级别"
                  width="100"
                  :filters="[{ text: '严重', value: 7 }]"
                  :filter-multiple="true"
                  column-key = 'filter2'
                  filter-placement="bottom">
            <template slot-scope="scope">
              {{scope.row.severity === 7 ? '严重' : ''}}
            </template>
          </el-table-column>
          <el-table-column
                  :show-overflow-tooltip="true"
                  label="最近发生时间"
                  width="160">
            <template slot-scope="scope">
              {{scope.row.LogDate}}
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            >
            <template slot-scope="scope">
              <el-tooltip 
                placement="bottom" 
                class="item" 
                effect="dark"
                :open-delay= "500">
                <!-- open-delay=1000 -->
                <div slot="content">{{scope.row.description}}</div>
                <div class="itegrityStyle">{{scope.row.description}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button 
                type="text" 
                size="small" 
                @click="handleEventStauts(scope.row)" 
                :disabled="scope.row.status===0">标记为已处理</el-button>
               <!--  <el-button type="text" size="small" disabled>忽略</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-bottom" style="backgroud-color:#f6f8fb;">
        <el-pagination
            v-if="totalPage>10"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
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
    <!-- 是否标记为已处理弹框 -->
    <el-dialog style='width:80%;margin:0px auto 50px;'
        title="选择应用的云服务器"
        :visible.sync="dialoghandleVisible">
        <p
          style="text-align:center;display:block;margin:40px auto;">是否确定标记为已处理</p>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialoghandleVisible = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="defIntegrityEventStauts()"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog style='width:80%;margin:0px auto 50px;'
        title="选择应用的云服务器"
        :visible.sync="dialoghandleVisible2">
        <p
          style="text-align:center;display:block;margin:40px auto;">是否确定标记为已处理</p>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialoghandleVisible2 = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="changeStatusBtn()"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
    import { integrityEventHostList,allArea,integrityEventZoneList,updateIntegerityEventStatus } from '@/api/safety'
    import i18n from '@/lang'
    import $ajax from 'axios'
    export default {
      data (){
        return {
          atype:"3",
          activeIndex: '1',
          buttontextLeft:i18n.common.renew,
          buttontextRight:i18n.common.ignore,
          name: i18n.common.integrity,
          zoneList: [],
          tableData3: [],
          multipleSelection: [],
          indOperation:[{
            value: '展开',
            id:'telnet',
                fun:(data)=>{
                    return this.monitorInfo(data);
                }
            }],
          input5:'',
          select:'',
          left:'',
          currentPage: 1,
          totalPage: 1,
          currentId: 1,
          pageSize: 10,
          zoneId:'',
          value:'',
          dialoghandleVisible:false,
          dialoghandleVisible2:false,
          row:'',
          tableStatus: '0,1',
          severity: '7'
        }
      },
      created(){
        this.getAllarea();
        this.getIntegrityEventHostList();
      },
      methods:{
        // 表头筛选
        filterChange(value) {
          if(value.filter1){
            // 筛选状态
            if(value.filter1.length>0){
              this.tableStatus = value.filter1.join(',')
            }else{
              this.tableStatus = '0,1';
            }
          }else if(value.filter2){
            // 筛选告警类型
            if(value.filter2.length>0){
              this.severity = value.filter2.join(',')
            }else{
              this.severity = '7'
            }
          }
          this.getIntegrityEventHostList()
        },
        // 获取列表
        getIntegrityEventHostList(){
          console.log(this.currentId,777);
          let ser = 'remoteGetIntegrityEventHostList';
          let paramStr = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage +'","status":"'+this.tableStatus+'","severity":"'+this.severity+'","pageSize":'+this.pageSize+',"zoneId":'+this.currentId+',"queryParam":"'+ this.input5 +'"}}</paramStr>';
          integrityEventHostList(ser,paramStr).then(res=>{
            this.totalPage = res.totalElements;
            let tableData3 = res.hostList;
            this.tableData3 = tableData3;
            console.log(666,this.currentId,res);
            for(var key in tableData3){
              tableData3[key].severityValue = '';
              if(tableData3[key].severity===7){
                tableData3[key].severityValue = '严重';
              }
            
            }
          }).catch( err => {
            console.log('获取存储数据失败', err )
          })
        },
        open() {
          this.$message('请选择一项数据进行处理');
        },
        open1(){
          this.$message('处理成功');
        },
        // 筛选已处理未处理
        filterTag(value,row){
          this.value = value;
          return row.status === value;
        },
        // 筛选严重性  
        filterTag1(value,row){
          return row.severity === value;
        },
        // 多选框的选择，等于1时可以选择
        selectable(val){
          return val.status == 1;
        },
            
        // 多选框的选择，选择的每一项的值
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        changeRegion(zone,index) {
          this.currentId = zone.id
          this.getIntegrityEventHostList()
        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.getIntegrityEventHostList()
          
        },
            handleCurrentChange(val) {
              console.log(`第 ${val} 页`);
              this.currentPage = val;
              this.getIntegrityEventHostList()
              
            },
            serverdetails(){},
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            monitorInfo(data){
                console.log(data);
            },
            pagingChange(type,val){
                if(type == 'num'){
                    this.filter.limit = val;
                }else if(type == 'page'){
                    this.filter.page = val;
                }
                this.getEcmList();
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            // 获取地区
            getAllarea() {
              let ser = "remoteAllZone";
              allArea(ser)
                .then(res => {
                  let zoneAll = res.zonelist;
                  for (var key in zoneAll) {
                    zoneAll[key].count = 0;
                  }
                  this.getexceptionRegionNum(zoneAll);
                })
                .catch(err => {
                  console.log("获取地区失败", err);
                });
            },
            //获取地区数量
            getexceptionRegionNum(zoneAll) {
              let ser1 = "remoteGetIntegrityEventZoneList";
              let paramData = "<type>" + this.zoneType + "</type>";
              integrityEventZoneList(ser1, paramData)
                .then(res => {
                  console.log("获取地区数量成功", res);
                  if (res.length == 0) {
                    this.currentId = zoneAll[0].id;
                  } else {
                    console.log(this.currentId,8888)
                    for (var item in zoneAll) {
                      let zoneAllNum = res.zoneList;
                      for (var num in zoneAllNum) {
                        if (zoneAll[item].id === zoneAllNum[num].zoneId) {
                          zoneAll[item].count = zoneAllNum[num].count;
                        }
                      }
                    }
                    this.zoneList = zoneAll;
                    for (var i = 0; i < zoneAll.length; i++) {
                      if (zoneAll[i].count > 0) {
                        
                        this.currentId = zoneAll[i].id;
                        // 如果北京为0时会 出现没有数据，点一下上海才会出现数据，此处调用列表，北京为0时显示上海的列表
                        this.getIntegrityEventHostList();
                        return;
                      }
                    }
                  }

                  
                })
                .catch(err => {
                  console.log("获取地区数量失败", err);
                });
              // this.getIntegrityEventHostList();
            },
           
            //标记为已处理
            handleEventStauts(row){
              this.dialoghandleVisible = true;
              this.row = row;
            },
            defIntegrityEventStauts(){
             
              let ser = 'remoteUpdateIntegrityEvent';
              let paramsData = '<ids>'+ this.row.IntegrityEventID +'</ids>';
              
              updateIntegerityEventStatus(ser,paramsData).then(res=>{
                // if(tableData3.status===0){
                  this.row.status = 0;
                  // tableData3.value = '已处理';
                  this.$message('处理成功');
                // }
                  this.dialoghandleVisible = false;
                  this.getIntegrityEventHostList();
              }).catch(err=>{
                console.log('remoteUpdateIntegrityEvent文件一致性已处理数据失败', err);
              })
            },
            // 按钮标记为已处理
            changeStatus(){
              if(this.multipleSelection.length == 0){
                this.$message({
                    message: '请选择一项数据进行处理'
                  });
              }else if(this.multipleSelection.length > 1){
                this.$message({
                    message: '只能选择一条数据进行处理，请重新选择'
                  });
              }else{
                this.handleEventStauts2();
              }
              
            },
            handleEventStauts2(){
              this.dialoghandleVisible2 = true;
            },
            changeStatusBtn(){
              let ser = 'remoteUpdateIntegrityEvent';
              let paramsData = '<ids>'+ this.multipleSelection[0].IntegrityEventID +'</ids>';
              updateIntegerityEventStatus(ser,paramsData).then(res=>{
               // if(this.multipleSelection[0].status===0){
                  this.multipleSelection[0].status = 0;
                  this.multipleSelection[0].value = '已处理';

                // }
                this.getIntegrityEventHostList();
                this.open1();
              }).catch(err=>{
                console.log('remoteUpdateIntegrityEvent文件一致性已处理数据失败', err);
                
              })
            },

           
      },
    }
</script>
<style lang="scss" scoped="scoped">
  .ind_monitor{
    background: #f6f8fb;
    .content{
      background:#ffffff;
      padding-bottom:20px;
      .content_top{
        background: #ffffff;
        padding-left: 20px;
        padding-top:20px;
        padding-bottom: 20px;
      }
      .content-top-left{
        width:100%;
        height:100%;
        line-height:82px;
        background:#ffffff;
        padding-left:20px;
        overflow:hidden;
      }
      .content-top-right{
        width:100%;
        height:100%;
        line-height:82px;
        background:#ffffff;
        padding-left:20px;
        overflow:hidden;
      }
    }
    .top{
      width:100%;
      background: #ffffff;
      border-bottom: 1px solid #f8f9fb;
      position: relative;
      padding-bottom:20px;
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
        /*width: 65%;*/
        /*float: left;*/
        padding-left: 2%;
        text-align: left;
        .node_name{
          font-size: 14px;
          color: #333333;
          padding: 20px 0px;
        }
        .areaButton{
          padding: 0 10px;
          display: block;
          min-width: 68px;
          height: 30px;
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
        /*padding-top: 52px;*/
        .createButton{
          width: 120px;
          height: 36px;
          background: #3ac0f1;
          border-color: #3ac0f1;
          color: #ffffff;
          font-size: 12px;
          margin-right: 10px;
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
    .el-input-group {
      margin-top:20px;
      float:right;
    }
    .ind-header-right{
      float:right;
      margin-right:20px;
      margin-top:33px;
    }
    .group {
      width:350px;
      margin-right: -25px;
    }
    .el-table {
      margin-left:20px;
      margin-right:20px;
      color:#606266 ;
    }
    .mainTable {
      background-color:#ffffff;
      margin-right: 40px;
      padding-bottom:20px;
    }
  }
</style>
<style lang="scss">
  .ind_monitor {
    .el-select .el-input {
      width: 140px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    
    .el-table .el-table__header-wrapper thead tr th{
      height: 30px;
      background-color: #f0f2f7;
      padding:0;
    }
    .el-table .el-table__body-wrapper tbody tr td{
      height: 35px;
      padding:2px 0;
    }
    
    
    .content{
      overflow: hidden;
      padding:0;
    }
    .content-bottom{
      float: right;
      margin-top:20px;
      margin-right: 20px;
    }
    .serviceName{
      line-height:15px;
      font-size:12px;
      margin-top:-5px
    }
    .h_btn {
          background-color: #f0f2f7;
          border:1px solid #f0f2f7;
          height:35px;
          line-height:35px;
          padding:0 20px;
          color:#606266;
        }
    .h_btn:hover {
      background-color: #f0f2f7;
      border:1px solid #f0f2f7;
      color:#606266;
    }
    .itegrityStyle{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
   
    .el-dialog__header {
      background-color: #323c4e;
      height:40px;
      line-height: 40px;
      /*color:#e4e5e7;*/
      padding: 0;
      padding-left: 20px;
  
    }
    .el-dialog__title {
      color:#e4e5e7;
      font-size: 12px;
    }
    .el-dialog__footer {
        padding:0;
        width: 100%;
        font-size: 0;
        height:35px;
      }
    .el-dialog__footer .f_btn {
      margin: 0;
      background-color: #0f0;
      width: 50%;
      border: none;
    }
    .el-dialog__footer .f_btn_l {
      background-color: #f0f2f7;
    }
    .el-dialog__footer .f_btn_r {
      background-color: #f9cd76;
    }
    
  }
</style>

