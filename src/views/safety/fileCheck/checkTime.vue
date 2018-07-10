<template>
	<div class="check_server">
		<div class="top">
      <el-row>
        <el-col :span="19">
          <div class="left">
            <p class="node_name">配置检测频率</p>
            <span class="areaButton"
                  :class="{'areaButton-bg':currentId==zone.id}"
                  @click="changeRegion(zone,index)"
                  v-for="(zone,index) in zoneList" :key='index'>
                  <!-- :class="{'areaButton-bg':currentId==zone.id}" -->
                  {{zone.zoneName }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="line"></div>
    <div class="content">
    	<el-row>
        <el-col :span="15">
        	<el-button 
        		size="small" 
        		class="top_btn" 
        		:plain="false"
        		@click="configuredfBtn">配置检测频率</el-button>
        </el-col>
        <el-col :span="8">
            <el-input placeholder="服务器或IP名称" v-model="input" class="input-with-select group" size="small" @change="changeSearch" @keyup.native='showCheck'>
              <el-button slot="append" icon="el-icon-search" @click="getUseRule"></el-button>
            </el-input>
          </el-col>
      </el-row>
      <div class="mainTable">
      	<el-table
          :data="serverData"
          style="width: 100%;"
          :select-on-indeterminate="true"
          :show-overflow-tooltip="true"
          @selection-change="handleSelectionChange">
          <el-table-column
                  type="selection"
                  width="80">
          </el-table-column>
          <el-table-column
            label="云服务器"
            width="220">
            <template slot-scope="scope">
              <span>{{scope.row.hostname}}</span>
              <!-- <div class="serviceName">{{'('+ scope.row.hostname+')'}}</div> -->
            </template>
          </el-table-column>
          <el-table-column
            label="IP地址"
            width="220">
            <template slot-scope="scope">
              <span>{{scope.row.agent_ip}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="检测频率"
            width="380">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.radio">
                <el-radio :label="scope.row.agent_ip">
                  <input 
                    type="text" 
                    style="width:48px;height:24px;border-radius:4px;border:1px solid #c0c4cc;padding-left:10px;" 
                    v-model="scope.row.long"
                    :disabled="scope.row.radio!=scope.row.agent_ip"
                    @blur="onBlur(scope.row)"
                    ><span style="color:#b8b8b8;margin-left:10px;">分钟</span>
                </el-radio>
                <el-radio :label="scope.row.agent_guid" >
                  <el-time-picker
                    arrow-control
                    size="small"
                    v-model="scope.row.time"
                    :disabled="scope.row.radio!=scope.row.agent_guid"
                    @blur="onBlur(scope.row)"
                    value-format="HH:mm" 
                    format="HH:mm"
                    style="width:70px;" 
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:00'
                    }"
                    placeholder="00:00">
                  </el-time-picker>
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                :disabled="scope.row.checkTime == ''"
                @click="delRule(scope.row)">删除
              </el-button>
                <el-button
                type="text"
                size="mini"
                :disabled="scope.row.checkTime == ''"
                @click="configuredfFrequency(scope.row)">配置检测频率
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <p class="text">您已经选择3台服务器，其中2台已设置检测频率，位设置检测频率的服务器于每天01:30进行检测，或点击
      <router-link to="checkTime">
      <el-button type="text" class="foot_btn" @click="dialoghandleVisible=true"><a href="" style="text-decoration:underline;">设置检测频率</a></el-button></router-link>
      进行重新设置</p>
      	<!-- <div class="bottom_btn">
      		<el-button size="small" type="primary">应 用</el-button>
        	<el-button size="small" class="bottom_btn_r">取 消</el-button>
      	</div> -->
    </div>
    <el-dialog style='width:70%;margin:0px auto 50px;'
      title="禁用检测频率"
      :visible.sync="dialoghandleVisibleDe"
      :close-on-click-modal='false'>
      <div class="content" style="text-align:center">
        <span style="margin-left:10px;color:#333">是否要禁用检测频率?</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialoghandleVisibleDe = false"
          class="f_btn f_btn_l">取 消</el-button><el-button
          type="primary"
          @click="getDelete()"
          class="f_btn f_btn_r">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog style='width:70%;margin:0px auto 50px;'
      title="设置检测频率"
      :visible.sync="dialoghandleVisible"
      :close-on-click-modal='false'>
      <div class="content" style="text-align:center">
        <span style="margin-left:10px;color:#333">是否确定配置检测频率?</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialoghandleVisible = false"
          class="f_btn f_btn_l">取 消</el-button><el-button
          type="primary"
          @click="getDetermine()"
          class="f_btn f_btn_r">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
  import { allArea,useRule } from '@/api/safety'
  import i18n from '@/lang'
  import $ajax from 'axios'
	export default {
      data (){
        return {
         	zoneList:[],
         	input:'',
          currentId: 1,
         	serverData:[],
         	dialoghandleVisible:false,
           dialoghandleVisibleDe:false,
         	ruleForm:{},
          checkForm:{},
          multipleSelection:'',
        }
      },
      created(){
        this.getAllarea();
        this.getUseRule();
      },
      methods:{
        //获取所有地区
        getAllarea(){
          let ser = "remoteAllZone";
          allArea(ser).then(res => {
            let zonelist = res.zonelist;
            this.zoneList = zonelist;
          })
          .catch(err => {
            console.log("获取地区失败", err);
          });
        },
        // 获取列表
        getUseRule(){
          let ser = "remoteGetHostListByZone",
              paramStr = "<zoneId>"+ this.currentId +"</zoneId>"
          useRule(ser,paramStr).then(res => {
            let getAllList = res.allList;
            console.log(this.ruleForm,9988)
            getAllList.forEach((item) => {
              if (item.checkTime.indexOf(":") == -1 && item.checkTime != '') {
                item.radio = item.agent_ip;
                item.long = item.checkTime;
              }else if (item.checkTime != ''){
                item.radio = item.agent_guid;
                item.time = item.checkTime;
              }
            })
            this.serverData = getAllList;
            
          })
          .catch(err => {
            console.log("获取地区失败", err);
          });
        },
        // 删除-确定
        getDelete(){
          let ser = "deleteCheckFrenquencyConfig ",
              paramStr = '<frenquencyConfigStr>{"agent_guid":"'+ this.checkForm.agent_guid +'","checkType":"'+ this.checkForm.checkType +'"}</frenquencyConfigStr>'
          useRule(ser,paramStr).then(res => {
            this.serverData.checkTime = '';
            this.getUseRule();
            this.dialoghandleVisibleDe = false;
            this.$message({
              message: res
            })
          })
          .catch(err => {
            console.log("获取地区失败", err);
          });
        },
        // 配置-确定
        getDetermine(){
          let ser = "setCheckFrenquencyConfig",
              paramStr = '<frenquencyConfigStr>{ "frenquencyConfigStr":[{"agent_ip":"'+ this.checkForm.agent_ip +'","agent_guid":"'+ this.checkForm.agent_guid +'","checkTime":"'+ this.checkForm.checkTime +'","checkType":"'+ this.checkForm.checkType +'" }]}</frenquencyConfigStr>'

          useRule(ser,paramStr).then(res => {
            this.dialoghandleVisible = false;
            this.$message({
              message: res
            })
          })
          .catch(err => {
            console.log("获取地区失败", err);
          });
        },
        onBlur(item){
          this.configured(item);
          let allList = '';
          allList = this.serverData;
          allList.forEach((item) => {
            allList.checkTime = allList.hostId == this.ruleForm.hostId ? "this.ruleForm.checkTime" : allList.checkTime;
          })
          this.serverData = allList;
        },
      	// 切换地区
      	changeRegion(zone,index) {
          this.currentId = zone.id;
          this.currentPage = 1;
          this.getUseRule();
        },
        // 搜索的内容改变
        changeSearch(value){
          this.currentPage = 1;
        },
        // 按下回车搜索
        showCheck:function(ev){
          if(ev.keyCode == 13){
            this.getUseRule();
          }
        },
        // 多选框的选择，选择的每一项的值
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        configuredfBtn(){
          if(this.multipleSelection.length>1){
             this.$message({
              message: '只能选择一项数据进行处理'
            })
          }else if(this.multipleSelection.length==0){
             this.$message({
              message: '请选择一项数据进行处理'
            })
          }else if(this.multipleSelection.length==1){
            this.checkForm = this.multipleSelection[0];
            this.dialoghandleVisible = true;
          }
          
        },
        configured(items){
          if(items.radio == items.agent_ip){
            items.checkTime = items.long;
          }else if(items.radio == items.agent_guid) {
            items.checkTime = items.time;
          }else {
            items.checkTime = '';
          }
          this.ruleForm = items;
        },
        configuredfFrequency(val){
          this.checkForm = val;
          this.getUseRule();
          this.dialoghandleVisible = true;
        },
        delRule(val){
          this.checkForm = val;
          this.getUseRule();
          this.dialoghandleVisibleDe = true;
        },
      },
    }

</script>

<style lang="scss" scoped="scoped">
	.check_server {
		background-color:#fff;
		padding-bottom:100px;
		overflow:hidden;
    .content{
      background:#ffffff;
      padding-bottom:20px;
      .left {
      	height:20px;
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
    .group {
      width:350px;
      margin-right: -25px;
    }
    .mainTable {
      background-color:#ffffff;
      margin-right: 40px;
      padding-bottom:20px;
      margin-top:20px;
    }
    .el-table {
      margin-left:20px;
      margin-right:20px;
      color:#606266 ;
    }
    .content-bottom{
      float: right;
      margin-top:20px;
      margin-right: 20px;
    }
    .bottom {
    	margin-top:60px;
    	padding-left:20px;
    	.text {
    		font-size:12px;
    	}
    }
    .bottom_btn {
    	margin-top:20px;
    }
	}
</style>

<style lang="scss">
	.check_server {
		.el-icon-time {
      display:none;
    }
    .el-input--prefix .el-input__inner {
    	padding-left: 15px ;
		}
		.el-input--suffix .el-input__inner {
    	padding-right: 0px;
		}
		.el-table .el-table__body-wrapper tbody tr td {
   	 	padding: 5px 0;
		}
		.foot_btn {
			font-size:12px;
		}
		.bottom_btn_r {
			background-color:#f0f2f7;
			border:1px solid #f0f2f7;
		}
		.top_btn {
			background-color:#f0f2f7;
			border:1px solid #f0f2f7;
			margin-top:20px;
			margin-left:20px;

		}
		.top_btn:hover {
			background-color:#f0f2f7;
			border:1px solid #f0f2f7;
			margin-top:20px;
			margin-left:20px;
			color:#606266
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
      border-top-right-radius:0px;
      border-bottom-right-radius:0px;
    }
    .el-dialog__footer .f_btn_r {
      background-color: #f9cd76;
      border-top-left-radius:0px;
      border-bottom-left-radius:0px;
    }
	}
</style>