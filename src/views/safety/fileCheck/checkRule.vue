<template>
  <div class="rule-list">
      <h3 class="title">文件一致性检测规则列表</h3>

      <div class="button">
        <el-row>
          <el-col :span="17">
            <el-button
              type="info"
              class="btn"
              @click="configServerChecked"
              :plain="true">配置生效服务器</el-button>
            <el-button
              type="info"
              class="btn"
              @click="configTime"
              :plain="true">配置检测时间</el-button>
            <el-button
              type="info"
              class="btn"
              @click="addRule">添加</el-button>
            <el-button
              type="info"
              class="btn"
              @click="deleteRule"
              :plain="true"
              >删除</el-button>
          </el-col>
          <el-col :span="7">
            <el-autocomplete
            class="right_input"
            popper-class="my-autocomplete"
            v-model="state3"
            :fetch-suggestions="querySearch"
            placeholder="请输入规则名称"
            @select="handleSelect"
            style="margin-left: -10px;">
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="ruleList">
            </i>
              
     
          </el-autocomplete>
          </el-col>
        </el-row>
        
      </div>
      
      <div class="table">
        <el-table
          :show-overflow-tooltip="true"
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :default-sort = "{prop: 'Issued', order: 'descending'}">
          <el-table-column
            type="selection"
            width="55"
           >  
            <!-- @selection-change="selectChange" -->
          </el-table-column>
          <el-table-column
            label="规则名称"
            
            >
            <!-- :show-overflow-tooltip = 'true' -->
            <template slot-scope="scope">
              <!-- {{ scope.row.Name }} -->
              <el-tooltip 
                placement="bottom" 
                class="item" 
                effect="dark" 
                :open-delay= "500">
                <!-- open-delay=1000 -->
                <div slot="content">{{scope.row.Name}}</div>
                <div class="itegrityStyle">{{scope.row.Name}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
         
          <el-table-column
            label="生效服务器"
            width="100">
            <template slot-scope="scope">
              
                <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">生效服务器</div>
                <span> {{ scope.row.count }} </span>
                </el-tooltip>
            </template>
          </el-table-column> 
          <el-table-column
            label="目录"
            width="90"
            :show-overflow-tooltip = 'true'>  
            <template slot-scope="scope">
              {{scope.row.path}}
              
            </template>    
          </el-table-column>
          <el-table-column
            prop="excludePatterns"
            label="忽略文件"
            width="100">  
            <template slot-scope="scope">
              <el-tooltip 
                placement="bottom" 
                class="item" 
                effect="dark"
                :open-delay= "500">
                  <div slot="content">{{scope.row.excludePatterns}}</div>
                  <div class="itegrityStyle">{{scope.row.excludePatterns}}</div>
                </el-tooltip> 
              </template>   
          </el-table-column>
          <el-table-column
            prop="detection"
            label="是否实时检测"
            width="130">
            <template slot-scope="scope">
              {{ scope.row.realtime }}
            </template>      
          </el-table-column>
          <el-table-column
            prop="Issued"
            label="最新更新时间"> 
            <!-- sortable -->
            <template slot-scope="scope">
              {{ scope.row.Issued }}
            </template>  
     
          </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <el-button
                
                type="text"
                size="small"
                @click="updateRule(scope.row)"
                :disabled="scope.row.count>0||scope.row.Type===2||multipleSelection.length>1">修改</el-button>
               
              <el-button
                type="text"
                size="small"
                @click="removeRule(scope.row)"
                :disabled="scope.row.count>0||scope.row.Type===2||multipleSelection.length>1">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="configServer(scope.row)">配置生效服务器</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-bottom">
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
      <!-- 添加规则 -->
      <el-dialog
        title="添加文件一致性检测规则"
        :visible.sync="dialogFormVisible"
        @close="resetForm('addForm')"
        :close-on-click-modal=false> 
        <el-form 
          :model="addForm" 
          :rules="rules" 
          ref="addForm">
          <div class="main_top">
            <p style="margin-bottom:10px;" class="black">常规信息</p>
            <el-form-item label="名称：" prop="name">
              <el-input v-model="addForm.name" style="margin-left:25px;width:248px;"></el-input>
            </el-form-item>
            <el-form-item label="严重性：" prop="Severity">
              <el-select 
                v-model="addForm.Severity" 
               
                style="width:248px;height:28px;margin-left:10px;" 
                @change="optionValue">
                <el-option label="严重" value="7"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述：" prop="description">
              <el-input 
                v-model="addForm.description" 
                style="margin-left:35px;margin-top:6px;"
                type="textarea"
                :rows="2"></el-input>
            </el-form-item>

          </div>
          <div class="main_center">
            <p class="black">内容</p>
            <el-form-item label="检测类型：" prop="flieType">
              <el-radio-group v-model="addForm.flieType">
                <el-radio label="文件"></el-radio>
                <el-radio label="注册表值" disabled></el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <span style="color:red"> * </span> --><el-form-item   label="基本目录：" prop="baseDirectory">
              <el-input  v-model="addForm.baseDirectory" style="width:248px;"></el-input>
            </el-form-item>
            <el-form-item label="忽略文件：" prop="excludePatterns">
              <el-input v-model="addForm.excludePatterns" style="margin-left:10px;width:248px;"></el-input>
            </el-form-item>
          </div>
          <div class="main_footer">
            <p style="margin-top:10px;margin-bottom:5px;" class="black">配置选项</p>
           <!--  {{addForm.checkAll}} -->
            <el-checkbox 
              :indeterminate="isIndeterminate" 
              v-model="addForm.checkAll" 
              @change="handleCheckAllChange">检测所有选项</el-checkbox>
            <div style="margin: 5px 0;"></div>
            <el-checkbox-group 
              v-model="checkedCities" 
              @change="handleCheckedCitiesChange">
              <el-checkbox class="c_box" v-for="(city,index) in cities" :label="city" :key="city.name">{{city.value}}
                <el-tooltip class="item" effect="dark" placement="right" v-if="city.message != '' ">
                  <div slot="content" >{{city.message}}</div>
                  <i class="el-icon-question" style="margin-left:5px;"></i>
                </el-tooltip>
              </el-checkbox> 
            </el-checkbox-group>
           
            <el-checkbox v-model="addForm.report_changes">报告文件改变内容 
              <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content" >被检测文件对于勾选的检测项，具体的内容进行报告</div>
                  <i class="el-icon-question" style="margin-left:5px;"></i>
                </el-tooltip>
            </el-checkbox><br>
            <!-- {{addForm.realtime}} -->
            <el-checkbox v-model="addForm.realtime">实时检测 
              <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content" >采用实时检测的方式，并实时发送到安全管理中心</div>
                  <i class="el-icon-question" style="margin-left:5px;"></i>
                </el-tooltip>
            </el-checkbox>

          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="resetForm('addForm')"
            class="f_btn f_btn_l">取 消</el-button>
             <!-- dialogFormVisible = false -->
          <el-button
            type="primary"
            @click="handleAddRule"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>
       <!-- 删除规则  -->
      <el-dialog
        title="删除规则"
        :visible.sync="dialogTableVisible"
        >
        <div class="content" style="overflow:hidden;">
          <div class="left" style="float:left;margin-right:20px;">
            <i class="">
              <svg-icon icon-class="warn" style="font-size:50px;color:#f9cd76"></svg-icon>
            </i>
          </div>
          <div class="right" style="float:left;margin-bottom:20px;">
            <p style="color:#333;">确定要删除以下规则吗？</p>
            <p style="color:#666;">规则删除后不能恢复，只能重新创建规则</p>
          </div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            label="规则名称"
            >
            <template slot-scope="scope">
              {{ scope.row.Name }}
            </template>  
          </el-table-column>
          <el-table-column
            width="180"
            label="生效服务器"
            >
            <template slot-scope="scope">
              {{ scope.row.count }}
            </template> 
          </el-table-column>
        </el-table>
        
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogTableVisible = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="closeRule(tableData[0].IntegrityRuleID)"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 按钮点击删除规则 -->
      <el-dialog
        title="删除规则"
        :visible.sync="dialogTableVisibleBtn"
        >
        <div class="content" style="overflow:hidden;">
          <div class="left" style="float:left;margin-right:20px;">
            <i class="">
              <svg-icon icon-class="warn" style="font-size:50px;color:#f9cd76"></svg-icon>
            </i>
          </div>
          <div class="right" style="float:left;margin-bottom:20px;">
            <p style="color:#333;">确定要删除以下规则吗？</p>
            <p style="color:#666;">规则删除后不能恢复，只能重新创建规则</p>
          </div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            label="规则名称"
           >
            <template slot-scope="scope">
              {{ scope.row.Name }}
            </template>  
          </el-table-column>
          <el-table-column
            width="180"
            label="生效服务器"
            >
            <template slot-scope="scope">
              {{ scope.row.count }}
            </template> 
          </el-table-column>
        </el-table>
        
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogTableVisibleBtn = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="deleteRuleBtn(tableData[0].IntegrityRuleID)"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 配置生效服务器 -->
      <el-dialog
        title="选择应用的云服务器"
        :visible.sync="dialogFormVisible1"
        @close='close1'
        >
        
        <el-form :model="selectForm">
          <div class="main_top" style="margin-bottom:20px;">
            <span style="color:red;"> * </span>地域：
            <el-select
              v-model="value"
              placeholder="请选择"
              @change="changeId(value)"
              style="width:248px;height:28px;margin-top:10px;margin-left:66px;">
              <el-option 
                id="option"
                v-for="item in options"
                :key="item.id"
                :label="item.zoneName"
                :value="item.id">
              </el-option>
            </el-select></br>
            <span style="color:red;"> * </span>应用的服务器：
            <el-select
              v-model="value1"
              placeholder="请选择" 
              multiple
              :disabled="value == ''"
              style="width:248px;margin-top:15px;margin-left:10px;">
              <el-option
                v-for="(item,index) in options2"
                :key="index"
                :label="item.hostname"
                :value="item.host_id"
                style="width:248px;">
                <span style="float: left">{{ item.agent_ip }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;margin-right:18px;">{{ item.hostname }}</span>
              </el-option>
            </el-select></br>
          </div>
          <div class="main_center">
            <!--  {{serverData}} -->
            <el-table
              :data="serverData"
              style="width: 100%;">
              <el-table-column
                
                label="云服务器"
                width="140">
                <template slot-scope="scope">
                  <span>{{scope.row.agent_ip}}</span>
                  <div class="serviceName">{{'('+ scope.row.hostname+')'}}</div>
                  <!-- {{scope.row.hostname}} -->
                </template>
              </el-table-column>
              <el-table-column
                label="检测频率"
                width="260">
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.radio">

                    <el-radio :label="scope.row.agent_ip" disabled>
                   <!--   {{scope.row.long}} -->
                      <input 
                        type="text" 
                        style="width:28px;height:24px;border-radius:4px;border:1px solid #c0c4cc;padding-left:10px;" 
                        v-model="scope.row.long"
                        disabled
                        ><span style="color:#b8b8b8;margin-left:10px;">分钟</span>
                    </el-radio>
                   
                    <el-radio :label="scope.row.agent_guid" disabled>
                    <!--  {{scope.row.time}} -->
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
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="close1"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="useCloudRule"
            class="f_btn f_btn_r">应 用</el-button>
        </div>
      </el-dialog>
      <!-- 按钮配置生效服务器 -->
      <el-dialog
        title="选择应用的云服务器"
        :visible.sync="dialogFormVisibleServer"
        @close='close2'
        >
        
        <el-form :model="selectForm">
          <div class="main_top" style="margin-bottom:20px;">
            <span style="color:red;"> * </span>地域：
            <el-select
              v-model="value2"
              placeholder="请选择"
              @change="changeIdCity(value2)"
              style="width:248px;height:28px;margin-top:10px;margin-left:66px;">
              <el-option 
                id="option"
                v-for="item in options3"
                :key="item.id"
                :label="item.zoneName"
                :value="item.id">
              </el-option>
            </el-select></br>

            <span style="color:red;"> * </span>应用的服务器：
            <el-select
              v-model="value1"
              placeholder="请选择"
              multiple
              :disabled="value2 == ''"
              style="width:248px;margin-top:15px;margin-left:10px;">
              <el-option
                v-for="(item,index) in optionsCity"
                :key="item.host_id"
                :label="item.hostname"
                :value="item.host_id"
                style="width:248px;">
                <span style="float: left">{{ item.agent_ip }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;margin-right:18px;">{{ item.hostname }}</span>
              </el-option>
            </el-select></br>
          </div>
          <div class="main_center">
              <!--  {{serverDataCity}} -->
            <el-table
              :data="serverData"
              style="width: 100%;">
              <el-table-column
                
                label="云服务器"
                width="140">
                <template slot-scope="scope">
                  <span >{{scope.row.agent_ip}}</span>
                  <div class="serviceName">{{'('+ scope.row.hostname+')'}}</div>
                  <!-- {{scope.row.hostname}} -->
                </template>
              </el-table-column>
              <el-table-column
                
                label="检测频率"
                width="260">
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.radio">

                    <el-radio :label="scope.row.agent_ip" disabled>
                   <!--   {{scope.row.long}} -->
                      <input 
                        type="text" 
                        style="width:30px;height:24px;border-radius:4px;border:1px solid #c0c4cc;padding-left:10px;" 
                        v-model="scope.row.long"
                        disabled
                        ><span style="color:#b8b8b8;margin-left:10px;">分钟</span>
                    </el-radio>
                   
                    <el-radio :label="scope.row.agent_guid" disabled>
                    <!--  {{scope.row.time}} -->
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
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="close2"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="useCloudRule1"
            class="f_btn f_btn_r">应 用</el-button>
        </div>
      </el-dialog>
      <!-- 配置检测时间 -->
      <el-dialog
        title="配置检测时间"
        :visible.sync="dialogFormVisible2"
        @close="close3"
        >
        
        <el-form :model="selectForm">
          <div class="main_top" style="margin-bottom:20px;">
            <span style="color:red;"> * </span>地域：<el-select
                                      v-model="valueTimeCity"
                                      placeholder="请选择"
                                      @change="changeIdTime"
                                      style="width:248px;height:28px;margin-top:15px;margin-left:66px;">
                                      <el-option 
                                        
                                        v-for="item in optionsTimeCity"
                                        :key="item.id"
                                        :label="item.zoneName"
                                        :value="item.id">
                                      </el-option>
                                    </el-select></br>
          </div>
          <div class="main_center">
            <el-table
              :data="serverTimeRule"
              style="width: 100%;">
              <el-table-column
               
                label="云服务器"
                width="140">
                <template slot-scope="scope">
                  <span >{{scope.row.agent_ip}}</span>
                  <div class="serviceName">{{ '('+ scope.row.hostname + ')'}}</div>
                </template>
              </el-table-column>
              <el-table-column
                
                label="检测频率"
                width="260">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.radio">

                    <el-radio :label="scope.row.agent_ip">
                   <!--   {{scope.row.long}} -->
                      <input 
                        type="text" 
                        style="width:30px;height:24px;border-radius:4px;border:1px solid #c0c4cc;padding-left:10px;" 
                        v-model="scope.row.long"
                        :disabled="scope.row.radio!=scope.row.agent_ip"
                        ><span style="color:#b8b8b8;margin-left:10px;">分钟</span>
                    </el-radio>
                   
                    <el-radio :label="scope.row.agent_guid" >
                    <!--  {{scope.row.time}} -->
                        <el-time-picker
                          arrow-control
                          size="small"
                          v-model="scope.row.time"
                          :disabled="scope.row.radio!=scope.row.agent_guid"
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
                    @click="deleteTime(scope.row)">删除</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="useTime(scope.row)">应用</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="close3"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="close3"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改云服务器 -->
      <el-dialog
        title="修改文件一致性检测规则"
        :visible.sync="dialogUpdateFormVisible"
        @close="resetForm('updateForm')"
        :close-on-click-modal=false>
        <el-form 
          :model="updateForm" 
          :rules="rules" 
          ref="updateForm">
          <div class="main_top">
            <p style="margin-bottom:10px;" class="black">常规信息</p>
            <el-form-item label="名称：" prop="name">
              <el-input v-model="updateForm.name" style="margin-left:27px;width:248px;"></el-input>
            </el-form-item>
            <el-form-item label="严重性：" prop="Severity">
              <el-select 
                v-model="updateForm.Severity" 
                placeholder="请选择" 
                style="width:248px;height:28px;margin-left:13px;" 
                @change="optionValue">
                <el-option label="严重" value="7"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述：" prop="description">
              <el-input 
                v-model="updateForm.description" 
                style="margin-left:37px;margin-top:6px;"
                type="textarea"
                :rows="2"></el-input>
            </el-form-item>
          </div>
          <div class="main_center">
            <p class="black">内容</p>
            <el-form-item label="检测类型：" prop="flieType">
              <el-radio-group v-model="updateForm.flieType">
                <el-radio label="文件"></el-radio>
                <el-radio label="注册表值" disabled></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="基本目录：" prop="baseDirectory" >
              <el-input v-model="updateForm.baseDirectory" style="width:248px;"></el-input>
            </el-form-item>
            <el-form-item label="忽略文件：" prop="excludePatterns">
              <el-input v-model="updateForm.excludePatterns" style="margin-left:10px;width:248px;"></el-input>
            </el-form-item>
          </div>
       
          <div class="main_footer">
            <p style="margin-top:10px;margin-bottom:5px;" class="black">配置选项</p>
           <!--  {{updateForm.checkAll}} -->
            <el-checkbox 
              :indeterminate="isIndeterminate" 
              v-model="updateForm.checkAll" 
              @change="handleCheckAllChangeV">检测所有选项</el-checkbox>
            <div style="margin: 5px 0;"></div>
          <!--   {{checkedCities}} -->
            <el-checkbox-group 
              v-model="checkedCities" 
              @change="handleCheckedCitiesChange">
              <el-checkbox class="c_box" v-for="city in cities" :label="city.name" :key="city.name">{{city.value}}
               <el-tooltip class="item" effect="dark" placement="right" v-if="city.message != '' ">
                  <div slot="content" >{{city.message}}</div>
                  <i class="el-icon-question" style="margin-left:5px;"></i>
                </el-tooltip> 
              </el-checkbox>
            </el-checkbox-group>
           
            <el-checkbox v-model="updateForm.report_changes">报告文件改变内容 
              <el-tooltip class="item" effect="dark" placement="right" content="2222">
                  <div slot="content" >被检测文件对于勾选的检测项，具体的内容进行报告</div>
                  <i class="el-icon-question" style="margin-left:5px;"></i>
                </el-tooltip>
            </el-checkbox><br>
            <el-checkbox v-model="updateForm.realtime">实时检测 
              <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content" >采用实时检测的方式，并实时发送到安全管理中心</div>
                  <i class="el-icon-question" style="margin-left:5px;"></i>
                </el-tooltip>
            </el-checkbox>

          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="resetForm('updateForm')"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="handleUpdateRule()"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>

      
      <!-- 至少选择一项 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogUpdateVisible"

        >
        
        <p
          style="text-align:center;display:block;margin:40px auto;">检测所有选项，至少选择一项！</p>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogUpdateVisible = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogUpdateVisible = false"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>

  
  </div>
</template>

<script>
import $ajax from 'axios';
import { delIntegrityRule,getRuleList,addRuleList,allArea,getHostListByZone,updateIntegrityRule,getHostListByRule,useRule } from '@/api/safety' 
const cityOptions = [
    {
      name:'check_sha1sum',
      value:'检测sha1sum',
      message:'使用sha1算法检测文件内容是否被篡改'
    },{
      name:'check_md5sum',
      value:'检测md5sum',
      message:'使用md5算法检测文件内容是否被篡改'
    },{
      name:'check_size',
      value:'检测文件大小',
      message:''
    },{
      name:'check_owner',
      value:'检测文件归属用户',
      message:''
    },{
      name:'check_group',
      value:'检测文件归属用户组',
      message:''
    },{
      name:'check_perm',
      value:'检测文件操作权限',
      message:'检测文件的读、写、执行权限是否被修改'
    },   
  ];
const cityOptionV = ['check_sha1sum','check_md5sum','check_size','check_owner','check_group','check_perm'];
   
export default {
  data() {
    var checkFile = (rule, value, callback) => {
      console.log(2222222, value)
        // value = value.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
        var patt = /(^(\\([0-9a-zA-Z._-]+))+$)|(^(\/([0-9a-zA-Z._-]+))+$)/;
        if (!value) {
          return callback(new Error('目录不能为空'));
        }
        setTimeout(() => {
          if (!patt.test(value)) {
            callback(new Error('请输入合法目录'));
          }else {
            callback();
          }
        }, 1000);
    };
   
    return {
      tableData3: [],
      restaurants: [],
      state3: '',
      multipleSelection: [],
      dialogFormVisible: false,
      dialogUpdateFormVisible:false,
      dialogFormVisibleServer:false,
      addForm: {
          name: '', // 名称
          baseDirectory: '', // 基本目录
          description: '', // 描述
          includeSubDirectories:false, // 包含子目录
          includePatterns: '', // 包含的文件的名称
          excludePatterns:'', // 忽略文件
          attributesToMonitor:'', // 要监控的属性
          configDataMap:'', // 配置
          checkAll: false, //全选
          report_changes:"",//文件改变内容
          realtime:"", //实时检测
          Severity:'严重',
          severity:'',
          flieType: '文件',
       },
      updateForm: {
          name: '', // 名称
          baseDirectory: '', // 基本目录
          description: '', // 描述
          includeSubDirectories:false, // 包含子目录
          includePatterns: '', // 包含的文件的名称
          excludePatterns:'', // 忽略文件
          attributesToMonitor:'', // 要监控的属性
          configDataMap:'', // 配置
          checkAll: "", //全选
          report_changes:"",//文件改变内容
          realtime:"", //实时检测
          Severity:'',
          flieType:'文件',
       },
      selectForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
       },
      selectForm1: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
       },
      formLabelWidth: '120px',
      options: [],
      options2: [],
      options3: [],
      options4: [],
      optionsCity:[],
      optionsTimeCity:[],
      optionsTimeServer:[],
      serverDataCity:[],
      textarea:'',
      value:'',
      value1:[],
      value2:'',
      value3:'',
      valueTimeCity:'',
      valueTimeServer:'',
      radio:'2',
      pp:'',
      pp1:'',
      time:'',
      checkedCities: [],
      checkedCities2: [],
      cities: cityOptions,
      cities2: cityOptions,
      isIndeterminate: true,
      dialogTableVisible: false,
      dialogTableVisibleBtn:false,
      tableData: [],
      updateTable:[],
      dialogFormVisible1: false,
      input: '',
      dialogUpdateVisible: false,
      dialogFormVisible2:false,
      serverData: [],
      timeData:[],
      optionstimeRule:[],
      serverTimeRule:[],
      checked:'',
      IntegrityRuleID:'',
      multipleSelection: [],
      item:{},
      city:'',
      timeCity:'',
      pageSize: 10, 
      currentPage: 1,
      totalPage: 1,
      flag:'readonly',
      option:[{label:'严重',value:'7'}],
      row:{},
      res:'',
      rows:{},
      zoneId:'',
      // tihsi:tihsi,

      rules: {
          name: [

            { required: true, message: '请输入名称', trigger: 'blur' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          Severity: [
            { required: true, message: '请选择严重性', trigger: 'change' }
          ],
          flieType: [
            { required: true, message: '请选择文件类型', trigger: 'change' }
          ],
          baseDirectory: [
            { validator: checkFile, required: true, message:'', trigger: 'change||blur' }
          ],
         
        },
    };
  },
  created(){
    this.ruleList();
    // this.getAllArea();
  },
  methods: {
    open() {
        this.$message('请选择一项数据进行处理');
    },
    open1(){
        this.$message('配置成功');
    },
    open2(){
        this.$message('添加成功');
    },
    open3(){
        this.$message('修改成功');
    },
    open4(){
        this.$message(this.res);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.ruleList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.ruleList();
    },
    handleSelect() {},
    
    handleIconClick() {},

    
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // if(this.multipleSelection.length > 1){
      //   this.multipleSelection.shift(this.multipleSelection[0]);
      // }
    },
    
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleCheckAllChangeV(val) {
      this.checkedCities = val ? cityOptionV : [];
      this.isIndeterminate = false;
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      console.log(value.length,888)
      if(value.length == 6){
        this.addForm.checkAll = true;
        this.updateForm.checkAll = true;

      }
      console.log(this.addForm.checkAll == false,111);
    },
    handleClick(row) {
     
    },
    //添加规则严重性值
    optionValue(value){
     
      this.addForm.severity = 7;
    },
    addRule(){
      this.dialogFormVisible = true;
      this.isIndeterminate = false;
      this.addForm.checkAll = false;
    },
    // 添加规则
    handleAddRule(){

            let addForm = this.addForm;
            let rule = /(^(\\([0-9a-zA-Z._-]+))+$)|(^(\/([0-9a-zA-Z._-]+))+$)/;
            if (addForm.name==''){
              this.$message('名称不能为空');
            }else if(addForm.Severity==''){
              this.$message('请选择严重性');
            }else if(addForm.flieType==''){
              this.$message('请选择文件类型');
            }else if(addForm.baseDirectory==''){
              this.$message('基本目录不能为空');
            }else if(!rule.test(addForm.baseDirectory)){
              this.$message('基本目录格式不正确');
            }else{

            if(addForm.checkAll == false){
              addForm.checkAll = '';
            }

            let checkedCities = this.checkedCities;
            
            let ch_Cities = [];
            let city = ["check_sha1sum","check_md5sum","check_size","check_owner","check_group","check_perm"];
            for(var i=0;i<checkedCities.length;i++){
              ch_Cities.push(checkedCities[i].name)
            }
            
            let check_sha1sum = "";
          
            if(ch_Cities.indexOf("check_sha1sum")!==-1){
              check_sha1sum = true;
            }else{
              check_sha1sum = "";
           
            }
            let check_md5sum = "";
            
            if(ch_Cities.indexOf("check_md5sum")!==-1){
              check_md5sum = true;
            }else{
              check_md5sum = "";
            }
            let check_size = "";
            if(ch_Cities.indexOf("check_size")!==-1){
              check_size = true;
            }else{
              check_size = "";
            }
            let check_owner = "";
            if(ch_Cities.indexOf("check_owner")!==-1){
              check_owner = true;
            }else{
              check_owner = "";
            }
            let check_group = "";
            if(ch_Cities.indexOf("check_group")!==-1){
              check_group = true;
            }else{
              check_group = "";
            }
            let check_perm = "";
            if(ch_Cities.indexOf("check_perm")!==-1){
              check_perm = true;
            }else{
              check_perm = "";
            }

            if(ch_Cities.length<6){
              addForm.checkAll = ''
            }
            if(addForm.realtime == false){
              addForm.realtime = '';
            }
            if(addForm.report_changes == false){
              addForm.report_changes = '';
            }
            let ser = 'addAllIntegrityRule';

            let paramStr = '<integrityRuleMsg>{"name":"'+ addForm.name + '"' +',"description":"'+ addForm.description + '"' +',"severity":2,"baseDirectory":"\\' + addForm.baseDirectory + '"' +',"includeSubDirectories":"false"'+',"includePatterns":""'+',"excludePatterns":"' + addForm.excludePatterns + '"' +',"attributesToMonitor":""'+',"configDataMap":"{\\"realtime\\":\\"'+ addForm.realtime +'\\"'+',\\"report_changes\\":\\"'+ addForm.report_changes +'\\"' +',\\"check_all\\":\\"' + addForm.checkAll + '\\",\\"check_sha1sum\\":\\"'+ check_sha1sum +'\\",\\"check_md5sum\\":\\"'+ check_md5sum +'\\",\\"check_size\\":\\"'+ check_size +'\\",\\"check_owner\\":\\"'+ check_owner +'\\",\\"check_group\\":\\"'+ check_group +'\\",\\"check_perm\\":\\"'+ check_perm +'\\"}" }'+'</integrityRuleMsg>';

            addRuleList(ser,paramStr).then(res=>{
              let tableData3 = res.integrityRuleList;
              this.tableData3 = tableData3;
              if(res == '完整性规则路径重复！'){
                this.$message(res)
              }else {
                this.dialogFormVisible = false;
                this.open2();
                this.ruleList();
                this.addForm.name = '';
                this.addForm.description = '';
                this.addForm.Severity = '';
                this.addForm.flieType = '';
                this.addForm.baseDirectory = '';
                this.addForm.excludePatterns = '';
                this.checkedCities = [];
              }
              
              }).catch(err=>{
              console.log('添加失败', err);
              this.dialogFormVisible = false;
              this.$mesage('添加失败');
              })
            }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
      this.dialogUpdateFormVisible = false;
      this.checkedCities = [];
      this.addForm.checkAll = false;
      // this.updateForm.checkAll = "";
      this.addForm.report_changes="";//文件改变内容
      this.addForm.realtime=""; //实时检测
      this.updateForm.report_changes="";//文件改变内容
      this.updateForm.realtime=""; //实时检测
      this.isIndeterminate = false;
    },
    // 修改规则
    updateRule(tableRow){
      this.dialogUpdateFormVisible = true;
      // 
      this.IntegrityRuleID = tableRow.IntegrityRuleID;
      let ser = 'getIntegrityRuleById';
      let paramStr = '<integrityRuleID>'+ this.IntegrityRuleID +'</integrityRuleID>';
      getRuleList(ser,paramStr).then(res=>{
        this.updateForm.name = res.Name;
        this.updateForm.description = res.Description;
        this.updateForm.baseDirectory = res.path;
        this.updateForm.excludePatterns = res.excludePatterns;
       
        this.row = res;
        this.updateForm.Severity = "严重";
       
        if(res.check_md5sum=="true"){
          this.checkedCities.push("check_md5sum");
         
        }
        if(res.check_sha1sum=="true"){
          this.checkedCities.push("check_sha1sum");
        }
        if(res.check_size=="true"){
          this.checkedCities.push("check_size");
        }
        if(res.check_owner=="true"){
          this.checkedCities.push("check_owner");
        }
        if(res.check_group=="true"){
          this.checkedCities.push("check_group");
        }
        if(res.check_perm=="true"){
          console.log(1111);
          this.checkedCities.push("check_perm");
        }
        if(res.check_all=="true"){
          console.log(res.check_all=="true",11122);
          this.updateForm.checkAll = true;
          this.isIndeterminate = false;
          // updateForm.isIndeterminate
        }else if(this.checkedCities.length>0&&this.checkedCities.length<6){
          console.log(0<this.checkedCities.length<6,444)
          this.updateForm.checkAll = false;
          this.isIndeterminate = true;

        }else {
          this.updateForm.checkAll = false;
          this.isIndeterminate = false;
        }

        if(res.report_changes=="true"){
          this.updateForm.report_changes = true;
        }
        if(res.realtime=="true"){
          this.updateForm.realtime = true;
        }

      }).catch(err=>{
        console.log('错误',err);
      })

    },
    // 处理修改规则
    handleUpdateRule(){
      let updateForm = this.updateForm;
      let rule = /(^(\\([0-9a-zA-Z._-]+))+$)|(^(\/([0-9a-zA-Z._-]+))+$)/;
      if (updateForm.name==''){
        this.$message('名称不能为空');
      }else if(updateForm.Severity==''){
        this.$message('请选择严重性');
      }else if(updateForm.flieType==''){
        this.$message('请选择文件类型');
      }else if(updateForm.baseDirectory==''){
        this.$message('基本目录不能为空');
      }else if(!rule.test(updateForm.baseDirectory)){
        this.$message('基本目录格式不正确');
      }else{
        let checkedCities = this.checkedCities;
        let ch_Cities = [];
        let city = ["check_sha1sum","check_md5sum","check_size","check_owner","check_group","check_perm"];
        for(var i=0;i<checkedCities.length;i++){
          ch_Cities.push(checkedCities[i])
        }
          if(ch_Cities.length==6){
            this.updateForm.checkAll =  true;
          }else {
            this.updateForm.checkAll = "";
          }
          let check_sha1sum = "";
        
          if(ch_Cities.indexOf("check_sha1sum")!==-1){
            check_sha1sum = true;
          }else{
            check_sha1sum = "";
               
          }
          let check_md5sum = "";
        
          if(ch_Cities.indexOf("check_md5sum")!==-1){
            check_md5sum = true;
          }else{
          check_md5sum = "";
         
          }
          let check_size = "";
      
          if(ch_Cities.indexOf("check_size")!==-1){
            check_size = true;
          }else{
            check_size = "";
          
          }
          let check_owner = "";
        
          if(ch_Cities.indexOf("check_owner")!==-1){
            check_owner = true;
          }else{
            check_owner = "";
        
          }
          let check_group = "";
        
          if(ch_Cities.indexOf("check_group")!==-1){
            check_group = true;
          }else{
            check_group = "";
        
          }
          let check_perm = "";
            
          if(ch_Cities.indexOf("check_perm")!==-1){
            check_perm = true;
          }else{
            check_perm = "";
      
          }
        if(updateForm.realtime == false){
          updateForm.realtime = '';
        }
        if(updateForm.report_changes == false){
          updateForm.report_changes = '';
        }
        let ser = 'updateIntegrityRuleById';

        let paramStr = '<integrityRuleMsg>{"name":"'+ updateForm.name +'","description":"'+ updateForm.description +'",     "integrityRuleID":'+ this.IntegrityRuleID +',     "baseDirectory":"'+ updateForm.baseDirectory +'",     "includeSubDirectories":"true","includePatterns":"","excludePatterns":"'+updateForm.excludePatterns +'","attributesToMonitor":"STANDARD","configDataMap":" {\\"realtime\\":\\"'+updateForm.realtime+'\\",\\"report_changes\\":\\"'+updateForm.report_changes+'\\",\\"check_all\\":\\"'+updateForm.checkAll+'\\",\\"check_sha1sum\\":\\"'+check_sha1sum+'\\",\\"check_md5sum\\":\\"'+check_md5sum+'\\",\\"check_size\\":\\"'+check_size+'\\",\\"check_owner\\":\\"'+check_owner+'\\",\\"check_group\\":\\"'+check_group+'\\",\\"check_perm\\":\\"'+check_perm+'\\"}" }</integrityRuleMsg>';

        updateIntegrityRule(ser,paramStr).then(res=>{
          this.dialogUpdateFormVisible = false;
          this.open3();
          this.ruleList();
          }).catch(err=>{
          console.log('修改失败', err);
          })
        }  
          
    },
          
    // 获取规则列表
    ruleList(){
      let ser = 'remoteGetIntegrityRuleList';
      let paramStr = '<paramStr>{"paramStr":{ "currentPage":'+this.currentPage+',"pageSize":'+this.pageSize+',"queryParam":"'+ this.state3 +'"}}</paramStr>';
      getRuleList(ser,paramStr).then(res=>{
        let tableData3 = res.integrityRuleList;
        this.tableData3 = tableData3;
        this.totalPage = res.totalElements;
        // console.log('获取列表成功',res);
      }).catch(err=>{
        console.log('获取列表失败', err);
      })

    },
    // 删除规则
    removeRule(tableRow){ 
      this.tableData[0] = tableRow;
      this.dialogTableVisible = true;
    },
    // 删除规则并关闭弹框
    closeRule(tableData){
      
      let table = this.tableData;
      
      let ser = 'delIntegrityRule';
      let paramStr = '<integrityRuleId>'+ tableData +'</integrityRuleId>';
      
      
      delIntegrityRule(ser,paramStr).then(res=>{
        this.dialogTableVisible = false;
        this.$message('删除成功');
        table = [];
        this.ruleList();
      }).catch(err=>{
        console.log('规则删除失败', err);
      })
    },
    //按钮删除规则
    deleteRule(){
      this.tableData = this.multipleSelection;
      if(this.multipleSelection.length == 0){
        this.$message({
            message: '请选择一项数据进行处理'
          });
      }else if(this.multipleSelection.length > 1){
        this.$message({
            message: '只能选择一条数据进行处理，请重新选择'
          });
      }else{
        this.dialogTableVisibleBtn = true;
      }
    },
    deleteRuleBtn(integrityRuleId){
      let ser = 'delIntegrityRule';
      let paramStr = '<integrityRuleId>'+ integrityRuleId +'</integrityRuleId>';
      
      
      delIntegrityRule(ser,paramStr).then(res=>{
        this.dialogTableVisibleBtn = false;
        this.res = res;
        this.open4();
        this.tableData = [];
        this.ruleList();
      }).catch(err=>{
        console.log('规则删除失败', err);
      })

    },
    // 配置生效服务器
    configServer(list){
      this.dialogFormVisible1 = true;
      this.IntegrityRuleID = list.IntegrityRuleID;
      this.getAllArea();
    },
    getAllArea(){
      let ser = 'remoteAllZone';
      allArea(ser).then(res=>{
                this.options = res.zonelist;
              }).catch( err => {
                console.log('获取存储数据失败', err)
              })
    },
    changeId(value){
      
      this.pp = value;
      this.value1 = [];
      this.getServerList(this.pp);
    },
    getServerList(zoneId){
     
      let ser1 = 'remoteGetHostListByRule';

      let paramStr = '<zoneId>'+ zoneId +'</zoneId>'+'<IntegrityRuleID>'+ this.IntegrityRuleID +'</IntegrityRuleID>';
      getHostListByRule(ser1,paramStr).then(res1=>{
        this.options2 = res1.hostList;
        this.serverData = res1.rulehostList;
        let serverTimeRule = this.serverData;
        for(var key in serverTimeRule){
          if (serverTimeRule[key].checkTime.indexOf(":") == -1 && serverTimeRule[key].checkTime != '') {
            serverTimeRule[key].radio = serverTimeRule[key].agent_ip;
            serverTimeRule[key].long = serverTimeRule[key].checkTime;
           
          }else if (serverTimeRule[key].checkTime != ''){
            serverTimeRule[key].radio = serverTimeRule[key].agent_guid;
            serverTimeRule[key].time = serverTimeRule[key].checkTime;
            
          }
        }
        // console.log('成功232323',res1);
      }).catch(err=>{
        console.log('失败2222666',err);
      })
    },
    useCloudRule(){
      // console.log(this.value1,3939939);
      let hostIdStr = this.value1.toString();
      // console.log(hostIdStr);
      let ser = 'distributingIntegrityRuleForHosts';
      let paramStr = '<distributeRuleId>'+ this.IntegrityRuleID +'</distributeRuleId><distributeHostIdStr>'+ hostIdStr +'</distributeHostIdStr>';
      useRule(ser,paramStr).then(res=>{
        console.log('应用成功',res);
        if(res == '完整性监控规则不存在！'){
          this.$message('该规则不能配置');
        }else{
          this.open1();
        }
        
        this.dialogFormVisible1 = false;
        this.pp = '';
        this.options = [];
        this.options2 = [];
        this.serverData = [];
        this.value = '';
        this.value1 = [];
        this.ruleList();
        this.item = {};
        this.multipleSelection = [];
      }).catch(err=>{
        console.log('应用失败',err);
      })
    },
    close1(){
      this.dialogFormVisible1 = false;
      this.pp = '';
      this.options = [];
      this.options2 = [];
      this.serverData = [];
      this.value = '';
      this.value1 = [];
      this.ruleList();
      this.item = {};
      this.multipleSelection = [];
    },
    // 删除规则下的应用服务器
    delRule(row){
      // console.log(row,999999);
      this.rows = row;
      // console.log(row.IntegrityRuleID,row.host_id);
      // let zoneId1 = row.zoneId;
      let ser = "deleteIntegrityRuleForHost";
      let paramStr = '<hostId>'+row.host_id+'</hostId><integrityRuleID>'+row.IntegrityRuleID+'</integrityRuleID>'
      useRule(ser,paramStr).then(res=>{
        if(res=="分配/取消完整性规则成功！"){
          this.$message("删除成功");
          this.getServerList22();
          this.ruleList();
        }
        
        console.log('删除成功',res);
      }).catch(err=>{
        console.log('删除失败',err);
      })
    },
    //删除应用服务器后重新获取配置的规则列表
    getServerList22(){
      // console.log(this.rows,'==========');
      let ser = 'remoteGetHostListByRule';

      let paramStr = '<zoneId>'+ this.rows.zoneId +'</zoneId>'+'<IntegrityRuleID>'+ this.rows.IntegrityRuleID +'</IntegrityRuleID>';
      getHostListByRule(ser,paramStr).then(res1=>{
        this.options2 = res1.hostList;
        this.serverData = res1.rulehostList;
        let serverTimeRule = this.serverData;
        for(var key in serverTimeRule){
          if (serverTimeRule[key].checkTime.indexOf(":") == -1 && serverTimeRule[key].checkTime != '') {
            serverTimeRule[key].radio = serverTimeRule[key].agent_ip;
            serverTimeRule[key].long = serverTimeRule[key].checkTime;
            // serverTimeRule[key].time = '';
          }else if (serverTimeRule[key].checkTime != ''){
            serverTimeRule[key].radio = serverTimeRule[key].agent_guid;
            serverTimeRule[key].time = serverTimeRule[key].checkTime;
            // serverTimeRule[key].long = '';
          }
        }
        console.log('成功232323',res1);
      }).catch(err=>{
        console.log('失败2222666',err);
      })
    },

    // 按钮配置生效服务器
    configServerChecked(){
      if(this.multipleSelection.length == 0){
        this.$message({
            message: '请选择一项数据进行处理'
          });
      }else if(this.multipleSelection.length > 1){
        this.$message({
            message: '只能选择一条数据进行处理，请重新选择'
          });
      }else{
        this.configServer1();
      }
      // if(this.multipleSelection.length !== 0){
        
      // }else {
      //   this.open();
      // }
    }, 
    configServer1(){
      this.dialogFormVisibleServer = true;
      let list = this.multipleSelection[0];
      this.getAllArea1();
    },
    getAllArea1(){
      let ser = 'remoteAllZone';
      allArea(ser).then(res=>{
               
                this.options3 = res.zonelist;
                
              }).catch( err => {
                console.log('获取存储数据失败', err)
              })
    },
    changeIdCity(value2){
      this.city = value2; 
      this.value3 = [];
      this.getServerList1(this.city);
    },
    getServerList1(zoneId){
      
      let ser1 = 'remoteGetHostListByRule';  
      let paramStr = '<zoneId>'+ zoneId +'</zoneId>'+'<IntegrityRuleID>'+ this.multipleSelection[0].IntegrityRuleID +'</IntegrityRuleID>';
      getHostListByRule(ser1,paramStr).then(res1=>{
        this.optionsCity = res1.hostList;
        this.serverData = res1.rulehostList;
        let serverTimeRule = this.serverData;
        for(var key in serverTimeRule){
          if (serverTimeRule[key].checkTime.indexOf(":") == -1 && serverTimeRule[key].checkTime != '') {
            serverTimeRule[key].radio = serverTimeRule[key].agent_ip;
            serverTimeRule[key].long = serverTimeRule[key].checkTime;
           
          }else if (serverTimeRule[key].checkTime != ''){
            serverTimeRule[key].radio = serverTimeRule[key].agent_guid;
            serverTimeRule[key].time = serverTimeRule[key].checkTime;
           
          }
        }
        // console.log('成功232323',res1);
      }).catch(err=>{
        console.log('失败2222666',err);
      })
    },
    useCloudRule1(){
      // console.log(this.value1,3939939);
      let hostIdStr = this.value1.toString();
      // console.log(hostIdStr,999,this.multipleSelection[0]);
     let ser = 'distributingIntegrityRuleForHosts';
      let paramStr = '<distributeRuleId>'+ this.multipleSelection[0].IntegrityRuleID +'</distributeRuleId><distributeHostIdStr>'+ hostIdStr +'</distributeHostIdStr>';
      useRule(ser,paramStr).then(res=>{
        // console.log('应用成功',res);
         if(res == '完整性监控规则不存在！'){
          this.$message('该规则不能配置');
        }else{
          this.open1();
        }
        this.dialogFormVisibleServer = false;
        this.city = '';
        this.value2 = '';
        this.value1 = [];
        this.options3 = [];
        this.optionsCity = [];
        this.serverDataCity = [];
        this.ruleList();
        this.item = {};
      }).catch(err=>{
        alert('应用失败');
        console.log('应用失败',res);
      })
    },
    close2(){
      this.dialogFormVisibleServer = false;
      this.city = '';
      this.value2 = '';
      this.value1 = [];
      this.options3 = [];
      this.optionsCity = [];
      this.serverDataCity = [];
      this.serverData = [];
      this.ruleList();
      this.item = {};
    },
    
    // 配置生效时间
    configTime(){
      this.dialogFormVisible2 = true;
      this.getAllAreaTime();
    },
    getAllAreaTime(){
      let ser = 'remoteAllZone';
      allArea(ser).then(res=>{
                this.optionsTimeCity = res.zonelist;
              }).catch( err => {
                console.log('获取存储数据失败', err)
              })
    },
    changeIdTime(valueTimeCity){
      this.timeCity = valueTimeCity;
      this.valueTimeServer = '';
      this.getTimeList(this.timeCity);
    },
    getTimeList(zoneId){
      this.zoneId = zoneId;
      let ser = 'remoteGetHostListByZone';  
      // let paramStr = '<zoneId>'+ zoneId +'</zoneId>'+'<IntegrityRuleID>'+ this.multipleSelection[0].IntegrityRuleID +'</IntegrityRuleID>';
      let paramStr = '<zoneId>'+ zoneId +'</zoneId>';
      // +'<type>'+'edit'+'</type>'
      getHostListByRule(ser,paramStr).then(res=>{
        console.log(res,34343434);
        // this.optionstimeRule = res.hostList;
       
        let serverTimeRule = res.allList;
        for(var key in serverTimeRule){
          serverTimeRule[key].long = '';
          serverTimeRule[key].time = '';
          serverTimeRule[key].radio = '';
          if (serverTimeRule[key].checkTime.indexOf(":") == -1 && serverTimeRule[key].checkTime != '') {
            serverTimeRule[key].radio = serverTimeRule[key].agent_ip;
            serverTimeRule[key].long = serverTimeRule[key].checkTime;
            // serverTimeRule[key].time = '';
          }else if (serverTimeRule[key].checkTime != ''){
            serverTimeRule[key].radio = serverTimeRule[key].agent_guid;
            serverTimeRule[key].time = serverTimeRule[key].checkTime;
            // serverTimeRule[key].long = '';
          }
          // else if(serverTimeRule[key].checkTime == ''){
          //   serverTimeRule[key].radio = serverTimeRule[key].agent_ip;
          //   serverTimeRule[key].long = serverTimeRule[key].checkTime;
          // }
        }
         
        this.serverTimeRule = serverTimeRule;
       
        console.log('成功232323',res);
      }).catch(err=>{
        console.log('失败2222666',err);
      })
    },
    useTime(items){
      if(items.radio == items.agent_ip){
          items.checkTime = items.long;
      }else if(items.radio == items.agent_guid) {
        items.checkTime = items.time;
      }else {
        items.checkTime = '';
      }
      let ser = 'setCheckFrenquencyConfig';
      let paramStr = '<frenquencyConfigStr>{ "frenquencyConfigStr":{"agent_ip":"'+ items.agent_ip +'","agent_guid":"'+ items.agent_guid +'","checkTime":"'+ items.checkTime +'","checkType":"'+ items.checkType +'" }}</frenquencyConfigStr>';
      useRule(ser,paramStr).then(res=>{
        if(res =="检测频率不能小于60分钟或大于7天！"){
          this.$message(res);
        }else if(res =="日期格式不正确！"){
          this.$message(res);
        }else if(res == '检测频率应该为整数！'){
          this.$message(res);
        }else if(res == 'checkTime不能为空！'){
          this.$message('检测频率不能为空！');
        }else{
          this.open1(); 
          this.getTimeList(this.zoneId);
          // this.zoneId = '';
        }
        console.log('应用成功',res);
      }).catch(err=>{
        // this.$message('应用失败 检测频率不能小于60分钟或大于7天！');
         let rule = /^[0-9]*[1-9][0-9]*$/;
          console.log(!rule.test(items.checkTime));
          if(!rule.test(items.checkTime)){
            this.$message('请输入整数');
          }else{
            this.$message(res);
          }
        console.log('应用失败',err);
      });
    },
    close3(){
      this.dialogFormVisible2 = false;
      this.serverTimeRule = [];
      this.valueTimeCity = '';
      this.optionsTimeCity = [];
    },

    // 配置生效服务器转换地区
    changeItem(item){
     this.item = item;
     this.value1 = item.hostname;
     console.log(item,9999);
    },
    // 删除检测频率
    deleteTime(item1){
     
      let ser = 'deleteCheckFrenquencyConfig';
      let item = item1;
      let paramStr = '<frenquencyConfigStr>{"agent_guid":"'+ item.agent_guid +'","checkType":"'+ item.checkType +'"}</frenquencyConfigStr>';
      useRule(ser,paramStr).then(res=>{
        if(res=='删除的数据不存在！'){
          this.$message('删除的数据为空，不能删除');
        }else{
          // this.valueTimeCity = '';
          this.$message('删除成功');
          this.getTimeList(this.timeCity);
        }
        console.log('删除成功',res);
      }).catch(err=>{
        console.log('删除失败',err);
      })
    },
    
  }
};
</script>

<style lang="scss" scoped="scoped">
  .rule-list {
    height: 100%;
    background-color: #fff;
    margin-left: 0px;
    padding-left: 20px;
    padding-bottom: 40px;

    .title {
      line-height: 60px;
    }
    .button {
      margin-top: 20px;
      margin-bottom: 22px;
    }
    .btn {
      background-color: #f0f2f7;
      border: 1px solid #f0f2f7;
      color:#606266;
      height: 35px;
      line-height: 35px;
      padding:0 20px;
    }
    .table {
      overflow: hidden;
      margin-right: 20px;
    }
    .el-input--suffix .el-input__inner {
    height:35px;
    }
  }
  .alert {
    /*position: relative;*/
    /*left:30px;*/
    width: 30px;
    height: 30px;
    background-color: #7d7d7d;
    opacity: 0.6;
  }
  .server {
    border: none;
  }
  .right_input {
    width:300px;
    height:35px;
    /*padding:0 20px;*/
    line-height: 35px;
    margin-left: 30px;
  
  }
  
</style>

<style lang="scss" >
  .rule-list{
    .el-table .el-table__header-wrapper thead tr th {
      background-color: #f0f2f7;
      padding: 0;
      height:35px;
    }
    .el-table .el-table__body-wrapper tbody tr td {
      height:35px;
      padding: 2px 0;
     
    }
    .el-dialog{
      width:40%;
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
    
    .el-input__inner {
      height:30px;
      /* margin-left: 40px; */
    }
    .el-input--suffix .el-input__inner {
      height:30px;
      /*margin-left: 8px;*/
  
    }
    .el-textarea {
      width:400px;
      vertical-align: top;
      margin-left: 51px; 
    }
    .el-textarea__inner {
      width:400px;
      height:60px;
      
    }
    .main_center {
      margin-top: 15px;
    }
    .c_box {
      /*margin-left: 50px;
      margin-right: 100px;*/
      width:210px;
    }
    .c_box:nth-child(1){
      margin-left: 30px;
    }
    .content-bottom {
      float: right;
      margin-top: 20px;
      margin-right: 20px;
    }
    .itegrityStyle{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .serviceName{
      line-height:15px;
      font-size:12px;
      margin-top:-5px
    }
    .el-icon-time {
      display:none;
    }
    .main_top {
      margin-top:-10px;
    }
    .black {
      color:black;
    }
    .el-form-item {
      margin-bottom:5px;
    }
    .el-input--prefix .el-input__inner {
      padding-left:15px;
    }
    .el-input--suffix .el-input__inner{
      padding-right:0;
    }
    
    .el-radio+.el-radio {
      margin-left: 20px;
    }
    .btn {
      background-color: #f0f2f7;
      border: 1px solid #f0f2f7;
      color:#606266;
      height: 35px;
      line-height: 35px;
      padding:0 20px;
    }
   
  }
  
</style>
