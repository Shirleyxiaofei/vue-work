<template>
  <div class="ecm_monitor">
    <div class="top">
      <el-row>
          <el-col :span="24">
            <div class="left">
              <p class="node_name bold-wei">{{name}} <span> 详情 </span></p>
              <span v-for="(area,index) in areas" class="head-content" :key=index>
                {{area.name}} : {{area.uuid}}
              </span>
            </div>
          </el-col>
      </el-row>
      <div class="content">
        <div class="template_title">
          <el-radio-group v-model="template_type" size="small" fill="#3ac7fa" @change="getDetailsCon">
            <el-radio-button label="default">资产清点</el-radio-button>
            <el-radio-button label="custom">异常登录</el-radio-button>
            <el-radio-button label="check">文件一致性检测</el-radio-button>

          </el-radio-group>
        </div>
      </div>

      <!-- 资产清点 -->
      <div class="template_default" v-show="isDefault && !isCustom && !isCheck">
        <h4 class="ser-choose bold-wei">资产清点</h4>
        <div class="content-list-1">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="监听端口" name="first" >
              <div class="server-table-content" >
                <div class="server-table-f">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="15">
                        <div class="table-left">
                          <p>数据最后获取时间：<span>
                            {{ecmListDataTime || '无'}}
                            </span>
                            <!-- <span class="reget-t" v-on:click="getCatchPort">重新获取</span> -->
                          </p>
                        </div>
                      </el-col>
                      <el-col :span="9">
                        <el-input placeholder="端口号" v-model="input1" class="input-with-select" size="small" style="width:350px">
                          <el-button slot="append" icon="el-icon-search" v-on:click="getCatchPort"></el-button>
                        </el-input>
                      </el-col>
                    </el-row>
                  </div>
                <div>
                  <el-table
                          :show-overflow-tooltip="true"
                          :data="ecmListData"
                          style="width: 100%">
                    <el-table-column
                            prop="port"
                            label="监听端口号">
                    </el-table-column>
                    <el-table-column
                            prop="proto"
                            label="网络协议"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="program_name"
                            label="对应进程"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="listen_ip"
                            label="绑定监听IP"
                           >
                    </el-table-column>
                  </el-table>
                  <div class="pagination">
                    <el-pagination
                      v-if="totalPageCP>10"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalPageCP">
                    </el-pagination>
                    <el-pagination
                      v-else
                      layout="">
                    </el-pagination>
                  </div>
                </div>

              </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="运行进程" name="second">
              <div class="server-table-content">
                <div class="server-table-f">
                <div class="server-date">
                  <el-row>
                    <el-col :span="15">
                      <div class="table-left">
                        <p>数据最后获取时间：
                          {{ecmListDataTime1 || '无'}}
                          <!-- <span class="reget-t" v-on:click="getRunProcess">重新获取</span> -->
                        </p>
                      </div>
                    </el-col>
                    <el-col :span="9">
                      <el-input placeholder="进程名称" v-model="input2" class="input-with-select" size="small" style="width:350px">
                        <el-button slot="append" icon="el-icon-search" v-on:click="getRunProcess">
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <el-table
                          :show-overflow-tooltip="true"
                          :data="ecmListData1"
                          style="width: 100%">
                    <el-table-column
                            prop="process_name"
                            label="进程名">
                    </el-table-column>
                    <el-table-column
                            prop="process_path"
                            label="进程路径"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="init_parameters"
                            label="启动参数"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="init_time"
                            label="启动时间"
                            width="200"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="user"
                            label="运行用户"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="PID"
                            label="PID"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="ppname"
                            label="父进程"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="file_md5"
                            label="文件MDS"
                           >
                    </el-table-column>
                  </el-table>
                  <div class="pagination">
                    <el-pagination
                      v-if="totalPageRP>10"
                      @size-change="handleSizeChange1"
                      @current-change="handleCurrentChange1"
                      :current-page="currentPage"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalPageRP">
                    </el-pagination>
                    <el-pagination
                      v-else
                      layout="">
                    </el-pagination>
                  </div>
                </div>

              </div>
              </div>

            </el-tab-pane>
            <el-tab-pane label="账号信息" name="third">
              <div class="server-table-content">
                <div class="server-table-f">
                <div class="server-date">
                  <el-row>
                    <el-col :span="15">
                      <div class="table-left">
                        <p>数据最后获取时间：
                          {{ecmListDataTime2 || '无'}}
                          <!-- <span class="reget-t" v-on:click="getUserMsg">重新获取</span> -->
                        </p>
                      </div>

                    </el-col>
                    <el-col :span="9">
                      <el-input placeholder="用户名" v-model="input3" class="input-with-select" size="small" style="width:350px">
                        <el-button slot="append" icon="el-icon-search" v-on:click="getUserMsg">
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <el-table
                          :show-overflow-tooltip="true"
                          :data="ecmListData2"
                          style="width: 100%">
                    <el-table-column
                            prop="username"
                            label="用户名">
                    </el-table-column>
                    <el-table-column
                            prop="groups"
                            label="用户组"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="expireTime"
                            label="到期时间"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="lastLoginTime"
                            label="上次登录"
                            width="350"
                           >
                           <template slot-scope="scope">
                            <span style="width: 190px">时间：{{scope.row.lastLoginTime}}</span>
                               来源：{{scope.row.sourceip}}
                          </template>
                    </el-table-column>

                  </el-table>
                  <div class="pagination">
                    <el-pagination
                      v-if="totalPageUM>10"
                      @size-change="handleSizeChange2"
                      @current-change="handleCurrentChange2"
                      :current-page="currentPage"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalPageUM">
                    </el-pagination>
                    <el-pagination
                      v-else
                      layout="">
                    </el-pagination>
                  </div>
                </div>

              </div>
              </div>

            </el-tab-pane>
            <el-tab-pane label="软件管理" name="fourth">
              <div class="server-table-content">
                <div class="server-table-f">
                <div class="server-date">
                  <el-row>
                    <el-col :span="15">
                      <div class="table-left">
                        <p>数据最后获取时间：<span>
                          {{ecmListDataTime3 || '无'}}
                          </span>
                          <!-- <span class="reget-t" v-on:click="getSoftManagement">重新获取</span> -->
                        </p>
                      </div>

                    </el-col>
                    <el-col :span="9">
                      <el-input placeholder="软件名称" v-model="input4" class="input-with-select" size="small" style="width:350px">
                        <el-button slot="append" icon="el-icon-search" v-on:click="getSoftManagement">
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <el-table
                          :show-overflow-tooltip="true"
                          :data="softWareListData"
                          style="width: 100%">
                    <el-table-column
                            prop="software_name"
                            label="软件名">
                    </el-table-column>
                    <el-table-column
                            prop="version"
                            label="软件版本"
                           >
                    </el-table-column>
                    <el-table-column
                            prop="LogDate"
                            label="软件最后更新时间"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="softdirect"
                            label="软件安装目录"
                           >
                    </el-table-column>
                  </el-table>
                  <div class="pagination">
                    <el-pagination
                      v-if="totalPageSM>10"
                      @size-change="handleSizeChangeSoft"
                      @current-change="handleCurrentChangeSoft"
                      :current-page="currentPageSoft"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalPageSM">
                    </el-pagination>
                    <el-pagination
                      v-else
                      layout="">
                    </el-pagination>
                  </div>
                </div>

              </div>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>

      </div>
      <!-- 异常登录 -->
      <div class="template_custom" v-show="!isDefault && isCustom && !isCheck">
        <h4 class="ser-choose bold-wei">异常登录</h4>
        <div class="content-list-1">
          <el-tabs v-model="activeName1" @tab-click="handleClick">
            <el-tab-pane label="异地登录" name="first">
              <div class="server-table-content">
                <div class="server-table-f server-table-f-1">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="24">
                        <div class="table-left">
                          <p class="marked-pro" type="plain" @click="markDispose">
                            标记为已处理
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-table
                            :show-overflow-tooltip="true"
                            :data="ecmListData3"
                            style="width: 100%"
                            @filter-change="errorFilterChange"
                            @selection-change="handleSelectionChange">
                      <el-table-column
                              type="selection"
                              width="50">
                      </el-table-column>
                      <el-table-column
                              prop="agent_ip"
                              label="云服务器"
                              width="180">
                      </el-table-column>
                      <el-table-column
                              prop="logindate"
                              width="180"
                              label="登录时间"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="status"
                              label="状态"
                              width="80"
                              :filters="[{ text: '未处理', value: '0' }, { text: '已处理', value: '1' }]"
                              column-key = 'filter1'
                              :filter-multiple="true"
                      >
                      <template slot-scope="scope">
                        {{scope.row.status == 0 ?　"未处理" : "已处理"}}
                      </template>
                      </el-table-column>
                      <el-table-column
                              prop="loginuser"
                              label="对应用户名"
                              width="100"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="logintype"
                              label="登录类型"
                              >
                      </el-table-column>
                      <el-table-column
                              prop="sourceip"
                              label="登录源IP"
                              width="200"
                              >
                      </el-table-column>
                      <!-- <el-table-column
                              prop="warningType"
                              label="告警类型"
                              width="140"
                              :filters="[{text: '异地登录', value: '异地登录'}, {text: '爆破登录', value: '爆破登录'}, {text: '非法IP登录', value: '非法IP登录'}, {text: '非法账号登录', value: '非法账号登录'}, {text: '非法时间登录', value: '非法时间登录'}]"
                              :filter-multiple="false"
                      >
                      </el-table-column> -->
                      <el-table-column
                              prop="operation"
                              label="操作"
                              >
                              <template slot-scope="scope" >
                                <el-button
                                  size="small"
                                  type="text" v-on:click="getModel(scope.row.sshexceptioneventid)" :disabled="scope.row.status == 1">标记为已处理</el-button>
                              </template>
                      </el-table-column>
                    </el-table>
                    <div class="pagination">
                      <el-pagination
                        v-if="totalPageLE1>10"
                        @size-change="handleSizeChange3"
                        @current-change="handleCurrentChange3"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPageLE1">
                      </el-pagination>
                      <el-pagination
                        v-else
                        layout="">
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="爆破登陆" name="second"><div class="server-table-content">
                <div class="server-table-f server-table-f-1">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="24">
                        <div class="table-left">
                          <p class="marked-pro" @click="markDispose">
                            标记为已处理
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div>
                    <el-table
                            :show-overflow-tooltip="true"
                            :data="ecmListData7"
                            @filter-change="errorFilterChange"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                      <el-table-column
                              type="selection"
                              width="50">
                      </el-table-column>
                      <el-table-column
                              prop="cserver"
                              label="云服务器"
                              width="180">
                      </el-table-column>
                      <el-table-column
                              prop="logintime"
                              width="180"
                              label="登录时间"
                             >
                      </el-table-column>
                      <el-table-column
                              :show-overflow-tooltip="true"
                              prop="status"
                              label="状态"
                              width="80"
                              :filters="[{ text: '未处理', value: '未处理' }, { text: '已处理', value: '已处理' }]"
                              column-key = 'filter2'
                              :filter-multiple="false"
                      >
                      </el-table-column>
                      <el-table-column
                              prop="username"
                              label="对应用户名"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="type"
                              label="登录类型"
                              >
                      </el-table-column>
                      <el-table-column
                              prop="loginip"
                              label="登录源IP"
                              width="200"
                              >
                      </el-table-column>
                      <el-table-column
                              prop="typewarn"
                              label="告警类型"
                              width="140"
                              :filters="[{text: '异地登录', value: '异地登录'}, {text: '爆破登录', value: '爆破登录'}, {text: '非法IP登录', value: '非法IP登录'}, {text: '非法账号登录', value: '非法账号登录'}, {text: '非法时间登录', value: '非法时间登录'}]"
                              :filter-multiple="false"
                      >
                      </el-table-column>
                      <el-table-column
                              prop="operation"
                              label="操作"
                              >
                        <template slot-scope="scope">
                          <el-button type="text" size="small" v-on:click="getModel(scope.row.sshexceptioneventid)">标记为已处理</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div></el-tab-pane>
            <el-tab-pane label="非法IP登录" name="third"><div class="server-table-content">
                <div class="server-table-f server-table-f-1">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="24">
                        <div class="table-left">
                          <p class="marked-pro" @click="markDispose">
                            标记为已处理
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div>
                    <el-table
                            :show-overflow-tooltip="true"
                            :data="ecmListData4"
                            @filter-change="errorFilterChange"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                      <el-table-column
                              type="selection"
                              width="50">
                      </el-table-column>
                      <el-table-column
                              prop="agent_ip"
                              label="云服务器"
                              width="180">
                      </el-table-column>
                      <el-table-column
                              prop="logindate"
                              width="180"
                              label="登录时间"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="status"
                              label="状态"
                              width="80"
                              :filters="[{ text: '未处理', value: '0' }, { text: '已处理', value: '1' }]"
                              column-key = 'filter3'
                              :filter-multiple="true"
                      >
                        <template slot-scope="scope">
                          {{scope.row.status === "0" ? "未处理" : "已处理"}}
                        </template>
                      </el-table-column>
                      <el-table-column
                              prop="loginuser"
                              label="对应用户名"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="logintype"
                              label="登录类型"
                              >
                      </el-table-column>
                      <el-table-column
                              prop="sourceip"
                              label="登录源IP"
                              width="200"
                              >
                      </el-table-column>
                      <!-- <el-table-column
                              prop="typewarn"
                              label="告警类型"
                              width="140"
                              :filters="[{text: '异地登录', value: '异地登录'}, {text: '爆破登录', value: '爆破登录'}, {text: '非法IP登录', value: '非法IP登录'}, {text: '非法账号登录', value: '非法账号登录'}, {text: '非法时间登录', value: '非法时间登录'}]"
                              :filter-multiple="false"
                      >
                      </el-table-column> -->
                      <el-table-column
                              prop="operation"
                              label="操作"
                              >
                        <template slot-scope="scope">
                          <el-button type="text" size="small" v-on:click="getModel(scope.row.sshexceptioneventid)" :disabled="scope.row.status == 1">标记为已处理</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="pagination">
                      <el-pagination
                        v-if="totalPageLE2>10"
                        @size-change="handleSizeChange4"
                        @current-change="handleCurrentChange4"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPageLE2">
                      </el-pagination>
                      <el-pagination
                        v-else
                        layout="">
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="非法账号登陆" name="fourth">
              <div class="server-table-content">
                <div class="server-table-f server-table-f-1">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="24">
                        <div class="table-left">
                          <p class="marked-pro" @click="markDispose">
                            标记为已处理
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div>
                    <el-table
                            :show-overflow-tooltip="true"
                            :data="ecmListData5"
                            @filter-change="errorFilterChange"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                      <el-table-column
                              type="selection"
                              width="50">
                      </el-table-column>
                      <el-table-column
                              prop="agent_ip"
                              label="云服务器"
                              width="180">
                      </el-table-column>
                      <el-table-column
                              prop="logindate"
                              width="180"
                              label="登录时间"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="status"
                              label="状态"
                              width="80"
                              :filters="[{ text: '未处理', value: '0' }, { text: '已处理', value: '1' }]"
                              column-key = 'filter4'
                              :filter-multiple="true"
                      >
                      <template slot-scope="scope">
                        {{scope.row.status === "0" ? "未处理" : "已处理"}}
                      </template>
                      </el-table-column>
                      <el-table-column
                              prop="loginuser"
                              label="对应用户名"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="logintype"
                              label="登录类型"
                              >
                      </el-table-column>
                      <el-table-column
                              prop="sourceip"
                              label="登录源IP"
                              width="200"
                              >
                      </el-table-column>
                      <!-- <el-table-column
                              prop="typewarn"
                              label="告警类型"
                              width="140"
                              :filters="[{text: '异地登录', value: '异地登录'}, {text: '爆破登录', value: '爆破登录'}, {text: '非法IP登录', value: '非法IP登录'}, {text: '非法账号登录', value: '非法账号登录'}, {text: '非法时间登录', value: '非法时间登录'}]"
                              :filter-multiple="false"
                      >
                      </el-table-column> -->
                      <el-table-column
                              prop="operation"
                              label="操作"
                              >
                        <template slot-scope="scope">
                          <el-button type="text" size="small" v-on:click="getModel(scope.row.sshexceptioneventid)"  :disabled="scope.row.status == 1">标记为已处理</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="pagination">
                      <el-pagination
                        v-if="totalPageLE3>10"
                        @size-change="handleSizeChange5"
                        @current-change="handleCurrentChange5"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPageLE3">
                      </el-pagination>
                      <el-pagination
                        v-else
                        layout="">
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="非法时间登陆" name="fifth"><div class="server-table-content">
                <div class="server-table-f server-table-f-1">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="24">
                        <div class="table-left">
                          <p class="marked-pro" v-on:click="markDispose">
                            标记为已处理
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-table
                            :show-overflow-tooltip="true"
                            :data="ecmListData6"
                            @filter-change="errorFilterChange"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                      <el-table-column
                              type="selection"
                              width="50">
                      </el-table-column>
                      <el-table-column
                              prop="agent_ip"
                              label="云服务器"
                              width="180">
                      </el-table-column>
                      <el-table-column
                              prop="logindate"
                              width="180"
                              label="登录时间"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="status"
                              label="状态"
                              width="80"
                              :filters="[{ text: '未处理', value: '0' }, { text: '已处理', value: '1' }]"
                              column-key = 'filter5'
                              :filter-multiple="true"
                      >
                      <template slot-scope="scope">
                        {{scope.row.status == 0 ? "未处理" : "已处理"}}
                      </template>
                      </el-table-column>
                      <el-table-column
                              prop="loginuser"
                              label="对应用户名"
                             >
                      </el-table-column>
                      <el-table-column
                              prop="logintype"
                              label="登录类型"
                              >
                      </el-table-column>
                      <el-table-column
                              prop="sourceip"
                              label="登录源IP"
                              width="200"
                              >
                      </el-table-column>
                      <!-- <el-table-column
                              prop="typewarn"
                              label="告警类型"
                              width="140"
                              :filters="[{text: '异地登录', value: '异地登录'}, {text: '爆破登录', value: '爆破登录'}, {text: '非法IP登录', value: '非法IP登录'}, {text: '非法账号登录', value: '非法账号登录'}, {text: '非法时间登录', value: '非法时间登录'}]"
                              :filter-multiple="false"
                      >
                      </el-table-column> -->
                      <el-table-column
                              prop="operation"
                              label="操作"
                              >
                        <template slot-scope="scope">
                          <el-button type="text" size="small" v-on:click="getModel(scope.row.sshexceptioneventid)"  :disabled="scope.row.status == 1">标记为已处理</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="pagination">
                      <el-pagination
                        v-if="totalPageLE4>10"
                        @size-change="handleSizeChange6"
                        @current-change="handleCurrentChange6"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPageLE4"
                        >
                      </el-pagination>
                      <el-pagination
                        v-else
                        layout=""
                        >
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>
      <!-- 文件检测一致性 -->
      <div class="template_check" v-show="!isDefault && !isCustom && isCheck">
        <h4 class="ser-choose bold-wei">文件一致性检测</h4>
        <div class="content-list-1">
          <el-tabs v-model="activeName2" @tab-click="handleClick">
            <el-tab-pane label="严重" name="first">
              <div class="server-table-content">
                <div class="server-table-f server-table-f-1">
                  <div class="server-date">
                    <el-row>
                      <el-col :span="24">
                        <div class="table-left">
                          <p class="marked-pro" v-on:click="markDispose1">
                            标记为已处理
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div>
                    <el-table
                            :show-overflow-tooltip="true"
                            :data="integrityData"
                            @filter-change="itegrityFilterChange"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                      <el-table-column
                              type="selection"
                              width="50">
                      </el-table-column>
                      <el-table-column
                              prop="agent_ip"
                              label="云服务器"
                              width="130">
                      </el-table-column>
                      <el-table-column
                              label="规则名称"
                             >
                        <template slot-scope="scope">
                          <el-tooltip placement="bottom" class="item" effect="dark">
                            <div slot="content">{{scope.row.Name}}</div>
                            <div class="itegrityStyle">{{scope.row.Name}}</div>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column
                              prop="status"
                              label="状态"
                              width="80"
                              :filters="[{ text: '未处理', value: '0' }, { text: '已处理', value: '1' }]"
                              column-key = 'filter1'
                              :filter-multiple="true"
                      >
                        <template slot-scope="scope">
                          {{scope.row.status == "0" ? "已处理" : "未处理"}}
                        </template>
                      </el-table-column>
                      <el-table-column
                              label="文件"
                              width="80"
                             >
                        <template slot-scope="scope">
                          <el-tooltip placement="bottom" class="item" effect="dark">
                            <div slot="content">{{scope.row.Path}}</div>
                            <div class="itegrityStyle">{{scope.row.Path}}</div>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column
                              prop="checkTime"
                              label="检测周期"
                              >

                      </el-table-column>
                      <el-table-column
                              prop="Severity"
                              width="100"
                              label="严重级别"
                              :filters="[{ text: '严重', value: '7' }]"
                              column-key = 'filter2'
                              :filter-multiple="true"
                              >
                        <template slot-scope="scope">
                          {{scope.row.Severity == 7 ? "严重" : ""}}
                        </template>
                      </el-table-column>
                      <el-table-column
                              prop="LogDate"
                              label="最近发生时间"
                              width="160"
                      >
                      </el-table-column>
                      <el-table-column
                              label="描述"
                      >
                        <template slot-scope="scope">
                          <el-tooltip placement="bottom" class="item" effect="dark">
                            <div slot="content">{{scope.row.description}}</div>
                            <div class="itegrityStyle">{{scope.row.description}}</div>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column
                              prop="operation"
                              label="操作"
                              width="150"
                              >
                        <template slot-scope="scope">
                          <el-button
                            v-on:click="getModel1(scope.row.IntegrityEventID)"
                            type="text"
                            size="small"
                            :disabled="scope.row.Status == 0">标记为已处理
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="pagination">
                      <el-pagination
                        v-if="totalPageIE>10"
                        @size-change="handleSizeChange7"
                        @current-change="handleCurrentChange7"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPageIE"
                        >
                      </el-pagination>
                      <el-pagination
                        v-else
                        layout=""
                        >
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <el-dialog style='width:80%;margin:0px auto 50px;'
        title="选择应用的云服务器"
        :visible.sync="dialogUpdateVisiblePose">
        <p
          style="text-align:center;display:block;margin:40px auto;">是否确定标记为已处理</p>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogUpdateVisiblePose = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="getUpdateExceptionStatus()"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog style='width:80%;margin:0px auto 50px;'
        title="选择应用的云服务器"
        :visible.sync="dialogUpdateVisiblePose1">
        <p
          style="text-align:center;display:block;margin:40px auto;">是否确定标记为已处理</p>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogUpdateVisiblePose1 = false"
            class="f_btn f_btn_l">取 消</el-button>
          <el-button
            type="primary"
            @click="getUpdateIntegerityEventBtnStatus()"
            class="f_btn f_btn_r">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</div>

</template>

<script>
  import RegionList from '@/components/RegionList'
  import ConsoleTable from '@/components/ConsoleTable'
  import {catchPort,runProcess,userMsg,logException,integrityEventList,updateIntegerityEventStatus,softManage,agentDetails} from '@/api/safety'
  import $ajax from 'axios'
  import i18n from '@/lang'

  export default {
    components:{
      RegionList,
      ConsoleTable,
    },
    data(){
      return {
        name:'123.123.123.12',
        loading:false,
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        select: '',
        markPose: '',
        detailsType: '',
        agentGuid: '',
        hostId: 267,
        template_type: 'default',
        activeName: 'first',
        activeName1: 'first',
        activeName2: 'first',
        value4: '',
        multipleSelection:[],
        loading1: true,
        loading2: true,
        currentId: 1,
        pageSize: 10,
        pageSize1: 10,
        pageSize2: 10,
        pageSize3: 10,
        pageSize4: 10,
        pageSize5: 10,
        pageSize6: 10,
        pageSize7: 10,
        pageSizeSoft: 10,
        totalPageCP: 1,
        totalPageRP: 1,
        totalPageSM: 1,
        totalPageUM: 1,
        currentPage: 1,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        currentPage5: 1,
        currentPage6: 1,
        currentPage7: 1,
        currentPageSoft: 1,
        totalPageLE1: 1,
        totalPageLE2: 1,
        totalPageLE3: 1,
        totalPageLE4 : 1,
        totalPageIE : 1,
        exception_status:'0,1',
        dialogUpdateVisiblePose: false,
        dialogUpdateVisiblePose1: false,
        areas: [
          {
            name: '名称',
            uuid: ''
          },
          {
            name: 'ID',
            uuid: ''
          },
          {
            name: '所在区域',
            uuid: ''
          },
          {
            name: '公网IP',
            uuid: ''
          },
          {
            name: '内网IP',
            uuid: ''
          },
          {
            name: '操作平台',
            uuid: ''
          },
          {
            name: '防护状态',
            uuid: '在线'
          },
        ],
        Pagination:{
          'pagingData':[10,20,50],
              'total':0,
              'show':false
        },
        ecmListData: [],
        ecmListData1: [],
        ecmListData2: [],
        ecmListData3: [],
        ecmListData4: [],
        ecmListData5: [],
        ecmListData6: [],
        ecmListData7: [],
        integrityData: [],
        softWareListData: [],
        ecmListDataTime: '',
        ecmListDataTime1: '',
        ecmListDataTime2: '',
        ecmListDataTime3: '',
        aaa: ''
      }
    },
    created(){
      this.create();
      this.getCatchPort();
      this.getRunProcess();
      this.getUserMsg();
      this.getLogException();
      this.getIntegrityEventList();
      this.getSoftManagement();
      this.getAgentDetails();
      this.judgeType();
      window.onbeforeunload=function (e){
        e = e || window.event
        if(e.clientX>document.body.clientWidth && e.clientY < 0 || e.altKey){
            sessionStorage.removeItem('templateType');
        }else{
            console.log("你正在刷新页面");

        }
      }
    },

    methods:{
      errorFilterChange(value) {
        if(value.filter1){
          // 筛选状态
          if(value.filter1.length>0){
            this.exception_status = value.filter1.join(',')
          }else{
            this.exception_status = '1,0'
          }
          this.getLogExceptionRegion()
        }else if(value.filter2){
          console.log(value.filter2)
          // 筛选状态
          if(value.filter2.length>0){
            this.exception_status = value.filter2.join(',')
          }else{
            this.exception_status = '1,0'
          }
        }else if(value.filter3){
          // 筛选状态
          if(value.filter3.length>0){
            this.exception_status = value.filter3.join(',')
          }else{
            this.exception_status = '1,0'
          }
          this.getLogExceptionIp()
        }else if(value.filter4){
          // 筛选状态
          if(value.filter4.length>0){
            this.exception_status = value.filter4.join(',')
          }else{
            this.exception_status = '1,0'
          }
          this.getLogExceptionUser()
        }else if(value.filter5){
          // 筛选状态
          if(value.filter5.length>0){
            this.exception_status = value.filter5.join(',')
          }else{
            this.exception_status = '1,0'
          }
          this.getLogExceptionTime()
        }
      },
      itegrityFilterChange(value){
        if(value.filter1){
          // 筛选状态
          if(value.filter1.length>0){
            this.exception_status = value.filter1.join(',')
          }else{
            this.exception_status = '1,0'
          }
          this.getLogExceptionRegion()
        }
      },
      filterTag(value, row) {
        return row.status === value;
      },
      filterTag1(value, row) {
        return row.Severity == value;
      },
      judgeType(){
        this.detailsType = window.location.href.substring(window.location.href.length-1);
        let aa = this.detailsType === "1" ? "default" : this.detailsType === "2" ? "custom" : "check";
        this.template_type = aa;
        this.getTemplateType()

      },
      getTemplateType(){
        let tType = sessionStorage.getItem('templateType');
        if(tType == null) {
          return
        }else{
          this.template_type = tType;
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getCatchPort()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getCatchPort()
      },
      handleSizeChange1(val) {
        this.pageSize1 = val
        this.getRunProcess()
      },
      handleCurrentChange1(val) {
        this.currentPage1 = val;
        this.getRunProcess()
      },
      handleSizeChange2(val) {
        this.pageSize2 = val
        this.getUserMsg()
      },
      handleCurrentChange2(val) {
        this.currentPage2 = val;
        this.getUserMsg()
      },
      handleSizeChange3(val) {
        this.pageSize3 = val
        this.getLogException()
      },
      handleCurrentChange3(val) {
        this.currentPage3 = val;
        this.getLogException()
      },
      handleSizeChange4(val) {
        this.pageSize4 = val
        this.getLogException()
      },
      handleCurrentChange4(val) {
        this.currentPage4 = val;
        this.getLogException()
      },
      handleSizeChange5(val) {
        this.pageSize5 = val
        this.getLogException()
      },
      handleCurrentChange5(val) {
        this.currentPage5 = val;
        this.getLogException()
      },
      handleSizeChange6(val) {
        this.pageSize6 = val
        this.getLogException()
      },
      handleCurrentChange6(val) {
        this.currentPage6 = val;
        this.getLogException()
      },
      handleSizeChange7(val) {
        this.pageSize7 = val
        this.getIntegrityEventList()
      },
      handleCurrentChange7(val) {
        this.currentPage7 = val;
        this.getIntegrityEventList()
      },
      handleSizeChangeSoft(val) {
        this.pageSizeSoft = val
        this.getSoftManagement()
      },
      handleCurrentChangeSoft(val) {
        this.currentPageSoft = val;
        this.getSoftManagement()
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      checkSelectable(row){
        return row.status == 0
      },
      checkSelectable1(row){
        return row.Status == 0
      },
      create(){
        let agentIp = this.$route.params.ip,
            hostId = this.$route.params.id,
            zoneId = this.$route.params.zone_id,
            agentGuid =  this.$route.params.guid,
            aType = this.$route.params.atype;
        this.name = agentIp;
        this.hostId = hostId;
        this.currentId = zoneId;
        this.agentGuid = agentGuid;
        let aa = window.location.href;
      },
      //计算机详情信息
      getAgentDetails(){
        let ser = 'queryVMDetailByhost',
            paramStr = '<zoneId>'+ this.currentId +'</zoneId>'+
                      '<agentGuid>'+ this.agentGuid +'</agentGuid>'
        agentDetails(ser,paramStr).then( res => {
            let serverDetails = eval('(' + res.vmDetail + ')');
            this.areas[0].uuid = serverDetails.vmName;
            this.areas[1].uuid = serverDetails.id;
            this.areas[2].uuid = serverDetails.zoneName;
            this.areas[3].uuid = serverDetails.publicip;
            this.areas[4].uuid = serverDetails.nic[0].ipaddress;
            this.areas[5].uuid = serverDetails.osStyle;
            this.areas[6].uuid = res.statusName;
        }).catch( err => {
          console.log('获取数据存储失败',err)
        })
      },
      //端口监听
      getCatchPort(){
        let ser = 'getPortNewEventByHostId',
            paramStr = '<hostId>'+ this.hostId +'</hostId>'+
                      '<portCondition>'+ this.input1 +'</portCondition>'+
                      '<page>'+ this.currentPage +'</page><onePageSize>'+ this.pageSize +'</onePageSize>'
        catchPort(ser,paramStr).then( res => {
          this.ecmListDataTime = res.newportList ? res.newportList[0].LogDate : '无数据'
          this.ecmListData = res.newportList
          this.totalPageCP = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败',err)
        }) 
      },
      //运行进程
      getRunProcess(){
        let ser = 'getProcessNewEventByHostId',
            paramStr = '<hostId>'+ this.hostId +'</hostId>'+
                      '<processCondition>'+ this.input2 +'</processCondition>'+
                      '<page>'+ this.currentPage1 +'</page><onePageSize>'+ this.pageSize1 +'</onePageSize>'
        runProcess(ser,paramStr).then( res => {
          this.ecmListDataTime1 = res.newProcessList ? res.newProcessList[0].LogDate : '无数据';
          this.ecmListData1 = res.newProcessList;
          this.totalPageRP = res.totalPage;
        }).catch( err => {
          console.log('获取数据存储失败',err)
        })
      },
      // 用户信息
      getUserMsg(){
        let ser = 'getUserInfoNewEventByHostId',
            paramStr = '<hostId>'+ this.hostId +'</hostId>'+
                      '<userInfoCondition>'+ this.input3 +'</userInfoCondition>'+
                      '<page>'+ this.currentPage2 +'</page><onePageSize>'+ this.pageSize2 +'</onePageSize>'
        userMsg(ser,paramStr).then( res => {
          this.ecmListDataTime2 = res.newUserInfoList ? res.newUserInfoList[0].lasttime : '无数据'
          this.ecmListData2 = res.newUserInfoList
          this.totalPageUM = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
      },

      // 软件管理
      getSoftManagement(){
        let ser = 'getSoftWareNewEventByHostId',
            paramStr = '<hostId>'+ this.hostId +'</hostId>'+
                  '<softWareCondition>'+ this.input4 +'</softWareCondition>'+
                  '<page>'+ this.currentPageSoft +'</page><onePageSize>'+ this.pageSizeSoft +'</onePageSize>';
        softManage(ser,paramStr).then(res=>{
          this.ecmListDataTime3 = res.newSoftWareList ? res.newSoftWareList[0].LogDate : '无数据'
          this.softWareListData = res.newSoftWareList
          this.totalPageSM = res.totalElements;
        })
      },
      //异常登录-异地登录
      getLogExceptionRegion(){
          let ser = 'remoteGetExceptionEventList',
          paramStr = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage3 +'","pageSize":"'+ this.pageSize3 +'","zoneId":"'+ this.currentId +'","status":"'+ this.exception_status +'","warningtype":"4","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>';
        logException(ser,paramStr).then( res => {
          let ecmListData3 = res.eventList;
          this.ecmListData3 = ecmListData3;
          this.totalPageLE1 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
      },
      //异常登录-非法ip登录
      getLogExceptionIp(){
          let ser = 'remoteGetExceptionEventList',
          paramStr = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage3 +'","pageSize":"'+ this.pageSize3 +'","zoneId":"'+ this.currentId +'","status":"'+ this.exception_status +'","warningtype":"1","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>';
        logException(ser,paramStr).then( res => {
          let ecmListData4 = res.eventList;
          this.ecmListData4 = ecmListData4;
          this.totalPageLE2 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
      },
      //异常登录-非法账号登录
      getLogExceptionUser(){
          let ser = 'remoteGetExceptionEventList',
          paramStr = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage3 +'","pageSize":"'+ this.pageSize3 +'","zoneId":"'+ this.currentId +'","status":"'+ this.exception_status +'","warningtype":"3","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>';
        logException(ser,paramStr).then( res => {
          let ecmListData5 = res.eventList;
          this.ecmListData5 = ecmListData5;
          this.totalPageLE3 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
      },
      //异常登录-非法时间登录
      getLogExceptionTime(){
          let ser = 'remoteGetExceptionEventList',
          paramStr = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage3 +'","pageSize":"'+ this.pageSize3 +'","zoneId":"'+ this.currentId +'","status":"'+ this.exception_status +'","warningtype":"2","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>';
        logException(ser,paramStr).then( res => {
          let ecmListData6 = res.eventList;
          this.ecmListData6 = ecmListData6;
          this.totalPageLE4 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
      },
      // 异常登录
      getLogException(){
        // console.log(111)
        let ser = 'remoteGetExceptionEventList',
        //异地登录
            paramStr = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage3 +'","pageSize":"'+ this.pageSize3 +'","zoneId":"'+ this.currentId +'","status":"0,1","warningtype":"4","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>',
            //非法ip登录
            paramStr1 = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage4 +'","pageSize":"'+ this.pageSize4 +'","zoneId":"'+ this.currentId +'","status":"0,1","warningtype":"1","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>',
            //非法账号登录
            paramStr2 = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage5 +'","pageSize":"'+ this.pageSize5 +'","zoneId":"'+ this.currentId +'","status":"0,1","warningtype":"3","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>',
            //非法时间登录
            paramStr3 = '<paramStr>{"paramStr":{"currentPage":"'+ this.currentPage6 +'","pageSize":"'+ this.pageSize6 +'","zoneId":"'+ this.currentId +'","status":"0,1","warningtype":"2","host_id":"'+ this.hostId +'","queryParam":""}}</paramStr>'
        logException(ser,paramStr).then( res => {
          let ecmListData3 = res.eventList;
          this.ecmListData3 = ecmListData3;
          this.totalPageLE1 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
        //非法ip登录
        logException(ser,paramStr1).then( res => {
          let ecmListData4 = res.eventList;
          this.ecmListData4 = ecmListData4;
          this.totalPageLE2 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
        // 非法账号登录
        logException(ser,paramStr2).then( res => {
          let ecmListData5 = res.eventList;
          this.ecmListData5 = ecmListData5;
          this.totalPageLE3 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
        // 非法时间登录
        logException(ser,paramStr3).then( res => {
          let ecmListData6 = res.eventList;
          this.ecmListData6 = ecmListData6;
          this.totalPageLE4 = res.totalElements;
        }).catch( err => {
          console.log('获取数据存储失败', err )
        })
      },

      //文件一致性检测
      getIntegrityEventList(){
        let ser = 'getIntegrityEventListByHostId'
        let paramsData = '<hostId>'+ this.hostId +'</hostId>'+
                         '<page>'+ this.currentPage7 +'</page><onePageSize>'+ this.pageSize7 +'</onePageSize>';
        integrityEventList(ser,paramsData).then(res=>{
          let itd = res.eventList;
          this.integrityData = itd;
          this.totalPageIE = res.totalElements;
        }).catch( err => {
          console.log("获取存储数据失败",err)
        })
      },
      //文件一致性标记为已处理
      markDispose1(){
        if(this.multipleSelection.length == 0){
          this.$message({
              message: '请选择一项数据进行处理'
            });
        }else if(this.multipleSelection.length > 1){
          this.$message({
              message: '只能选择一条数据进行处理，请重新选择'
            });
        }else if(this.multipleSelection[0].status == 1){
          this.$message({
              message: '您所选择的数据已处理过，请重新选择'
            });
        }else{
          this.markPose = this.multipleSelection[0].IntegrityEventID;
          this.dialogUpdateVisiblePose1 = true;
        }
      },
      getModel1(IntegrityEventID){
        this.dialogUpdateVisiblePose1 = true
        this.markPose = IntegrityEventID
      }, 
      getUpdateIntegerityEventBtnStatus(){  
        let ser = "remoteUpdateIntegrityEvent";
        let paramStr ='<ids>'+this.markPose+'</ids>';
        updateIntegerityEventStatus(ser,paramStr).then(res => {
          //调接口刷新表格              
          this.dialogUpdateVisiblePose1 = false
          this.$message({
              message: ''
          });
          this.getIntegrityEventList();
          }).catch(err=>{
          this.$message({
            message: '标记失败'
          });
        })
      },
      // 异常登录标记为已处理
      markDispose(){
        if(this.multipleSelection.length == 0){
          this.$message({
              message: '请选择一项数据进行处理'
            });
        }else if(this.multipleSelection.length > 1){
          this.$message({
              message: '只能选择一条数据进行处理，请重新选择'
            });
        }else if(this.multipleSelection[0].status == 1){
          this.$message({
              message: '您所选择的数据已处理过，请重新选择'
            });
        }else{
          this.markPose = this.multipleSelection[0].sshexceptioneventid;
          this.dialogUpdateVisiblePose = true;
        }
        
      },
      getModel(sshexceptioneventid){
        this.dialogUpdateVisiblePose = true
        this.markPose = sshexceptioneventid
      },
      getUpdateExceptionStatus(){
          //调接口刷新表格 
          let ser = "remoteUpdateExceptionStatus",
              paramStr ='<Ids>'+this.markPose+'</Ids>';        
          updateIntegerityEventStatus(ser,paramStr).then(res => {
            this.dialogUpdateVisiblePose = false
            this.$message({
                message: '标记成功'
              });
            this.getLogException();
            }).catch(err=>{
            this.$message({
              message: '标记失败'
            });
          })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      getDetailsCon(val){
        sessionStorage.setItem('templateType',val)
      },
    },
    computed:{
      isDefault:function(){
        return this.template_type === 'default';
      },
      isCustom:function(){
        return this.template_type === 'custom';
      },
      isCheck:function(){
        return this.template_type === 'check';
      },
    },
    mounted(){

    },
    beforeDestroy(){

    }

  }
</script>

<style lang="scss" scoped="scoped">
  .ecm_monitor{
      background: #ffffff;
      font-size: 12px;
      .bold-wei{
          font-weight: 600;
          color: #333333;
        }
     .content{
       background:#ffffff;
        .content_top{
          background: #ffffff;
          padding-top: 30px;
          padding-left: 20px;
          padding-bottom: 20px;
        }
    }
    .template_title{

      width:100%;
      background-color: #f0f2f7;

    }
    .top{
      background: #ffffff;
      min-height: 119px;
      border-bottom: 1px solid #f8f9fb;
      position: relative;
      .head-content{
        width:30%;
        display: inline-block;
        line-height: 58px;
      }
      .marked-pro{
        background: #f0f2f7;
        width:100px;
        height: 30px;
        text-align:center;
        line-height: 30px;
        float:left;
        cursor:pointer;
        margin-right: 10px;
        margin-bottom: 20px;
        &:nth-child(1){
          margin-left: -10px;
        }
      }
      .content-list{
        height: 35px;
        background: #f0f2f7;
        line-height: 35px;
        span{
          padding: 0 20px;
          display:inline-block;
          height: 100%;
          height: 100%;
        }
      }
      .ser-choose{
        margin-left: 20px;
        line-height: 54px;
      }
      .content-list-1{
        margin-top: -20px;
        .e-tabs__item{
          padding-left:20px;
        }
        height: 40px;
        span{
          text-align:center;
          line-height: 40px;
          display:inline-block;
        }
      }
      .input-with-select{
        margin-top: 21px;
      }
      .server-table-content{
        overflow: hidden;
        background: #fff;
        .server-table-f{
          margin:20px;
          margin-top: 0;
          border: 1px solid #e8edf5;
          .table-left{
            margin: 16px 0 11px 10px;
            .reget-t{
              color: #3ac0f1;
              cursor:pointer;
            }
          }
        }
        .server-table-f-1{
          border:none;
        }
      }

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
    }
    .itegrityStyle{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
  .el-input {
    // width:250px;
    height:30px;
    padding: 0; 
  }
  .el-input__inner {
    height:30px;
    /* margin-left: 40px; */
  }
  .el-input--suffix .el-input__inner {
    height:30px;
    margin-left: 8px;

  }
  .el-select .el-input {
        width: 100px;
      }
      .input-with-select .el-input-group__prepend {
        background-color: #fff;
      }
  .el-table .el-table__body-wrapper tbody tr td{
    height:35px;
    padding: 2px 0;

  }
  .el-table .el-table__header-wrapper thead tr th{
    font-size: 14px;
    height: 35px;
      line-height: 35px;
      color: #333;
      padding: 0;
      background-color: #f0f2f7;

  }
  .el-radio-button__inner {
    background: transparent ;
    border: none;
  }
  .el-tabs__header {
      padding: 0;
      position: relative;
      margin: 0 ;
  }
  .el-tabs__nav {
    margin-left: 20px;
  }
  .el-input__inner:focus {
    border-color: #dcdfe6;
    outline: none;
  }
  .el-input__inner:hover {
    border-color: #dcdfe6;
    outline: none;
    }
    .el-tabs__nav-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0;
      background-color: transparent;
      z-index: 1;
  }
  .template_check{
    .el-tabs__active-bar{
      width:100% !important;
    }
  }
  
  }
</style>