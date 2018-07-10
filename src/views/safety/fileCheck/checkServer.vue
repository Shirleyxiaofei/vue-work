<template>
	<div class="check_server">
		<div class="top">
      <el-row>
        <el-col :span="19">
          <div class="left">
            <p class="node_name">配置生效服务器</p>
            <span class="areaButton"
                  :class="{'areaButton-bg':currentId==zone.id}"
                  @click="changeRegion(zone,index)"
                  v-for="(zone,index) in zoneList" :key='index'>
                  {{zone.zoneName}}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="line"></div>
    <div class="content">
    	<el-row>
        <el-col :span="15">
        	<div class="btn">
        		<el-button size="small" class="bottom_btn_r" :plain="false">应 用</el-button>
        		<el-button size="small" class="bottom_btn_r" :plain="false">取 消</el-button>
        	</div>
        </el-col>
        <el-col :span="8">
            <el-input placeholder="服务器或IP名称" v-model="input" class="input-with-select group" size="small" @change="changeSearch" @keyup.native='showCheck'>
              <el-button slot="append" icon="el-icon-search" @click="getIntegrityEventHostList"></el-button>
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
              <span>{{scope.row.agent_ip}}</span>
              <!-- <div class="serviceName">{{'('+ scope.row.hostname+')'}}</div> -->
            </template>
          </el-table-column>
          <el-table-column
            label="IP地址"
            width="220">
            <template slot-scope="scope">
              <span>{{scope.row.agent_ip}}</span>
              <!-- <div class="serviceName">{{'('+ scope.row.hostname+')'}}</div> -->
            </template>
          </el-table-column>
          <el-table-column
            label="检测频率"
            width="380">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.radio">
              	<el-radio :label="scope.row.agent_ip" disabled>
                  <input 
                    type="text" 
                    style="width:48px;height:24px;border-radius:4px;border:1px solid #c0c4cc;padding-left:10px;" 
                    v-model="scope.row.long"
                    disabled>
                  <span style="color:#b8b8b8;margin-left:10px;">分钟</span>
                </el-radio>
                   
                <el-radio :label="scope.row.agent_guid" disabled>
                  <el-time-picker
                    arrow-control
                    size="small"
                    v-model="scope.row.time"
                    disabled
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
                size="small"
                @click="delRule(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content-bottom" style="backgroud-color:#f6f8fb;">
        <el-pagination
            v-if="totalPage>1"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
          </el-pagination>
          <!-- <el-pagination
            v-else
            layout="">
          </el-pagination> -->
      </div>
      <div class="bottom">
      	<p class="text">未设置检测频率的服务器于每天01:30进行检测，或点击
      	<router-link to="checkTime">
      	<el-button type="text" class="foot_btn"><a href="" style="text-decoration:underline;">设置检测频率</a></el-button></router-link>
      	进行重新设置</p>
      </div>
	</div>
</template>

<script>
	export default {
      data (){
        return {
         	zoneList:[{"regionId":"1f97eb062e8011e8a4bc0242ac110002","zoneEngName":"BEIJING","id":1,"zoneName":"北京"},{"zoneEngName":"SHANGHAI","id":2,"zoneName":"上海"}],
         	input:'',
         	serverData:[{"agent_ip":"10.0.1.59","checkType":"integrityType","hostname":"ctcss-agent2-6b46","checkTime":"","zoneId":"1","IntegrityRuleID":"398","agent_guid":"baeac628-84ff-4fff-92d1-0fcb6dca9d45","host_id":"623"},{"agent_ip":"10.0.1.59","checkType":"integrityType","hostname":"ctcss-agent2-6b46","checkTime":"","zoneId":"1","IntegrityRuleID":"398","agent_guid":"baeac628-84ff-4fff-92d1-0fcb6dca9d45","host_id":"623"}],
         	totalPage:2,
         	currentPage:1,
         	pageSize:10,
        }
      },
      created(){
       
      },
      methods:{
      	// 切换地区
      	changeRegion(zone,index) {
          this.currentId = zone.id;
          this.currentPage = 1;
          this.getIntegrityEventHostList();
        },
        // 搜索的内容改变
        changeSearch(value){
          this.currentPage = 1;
        },
        // 按下回车搜索
        showCheck:function(ev){
          if(ev.keyCode == 13){
            this.getIntegrityEventHostList();
          }
        },
        // 多选框的选择，选择的每一项的值
        handleSelectionChange(val) {

          this.multipleSelection = val;
          // if(this.multipleSelection.length==1){
          //   this.isActive = true;
          // }else {
          //   this.isActive = false;
          // }
        },
        // 改变分页大小
        handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this.getIntegrityEventHostList()
          
        },
        // 改变页码
        handleCurrentChange(val) {
          this.currentPage = val;
          this.getIntegrityEventHostList()
        },
        // 获取列表
        getIntegrityEventHostList(){

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
    .btn {
    	margin-top:20px;
    	margin-left:20px;
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
	}
</style>