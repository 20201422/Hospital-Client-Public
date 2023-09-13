<template>
  <div class="main"></div>
  <div class="st-part">
    <el-select class="el-st" placeholder="选择科室" @change="getBusiness" v-model="dept" filterable clearable>
      <el-option v-for="option in deptList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-select class="el-st" placeholder="选择开始时段" @change="getBusiness" v-model="begin" filterable clearable>
      <el-option v-for="option in beginList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-select class="el-st" placeholder="选择结束时段" @change="getBusiness" v-model="end" filterable clearable>
      <el-option v-for="option in endList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-select class="el-st" placeholder="选择门诊类型" @change="getBusiness" v-model="type" filterable clearable>
      <el-option v-for="option in typeList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-button class="el-btn" type="primary" @click="addBusiness">
      <el-icon>
        <Plus />
      </el-icon>添加
    </el-button>
  </div>
  <div class="row">
    <div class=col-6.5>
      <el-table class="table" :data="pagination.records" border>
        <el-table-column prop="departmentName" label="科室名称" width="180" algin="center" />
        <el-table-column prop="timeFrameBeginTime" label="时段开始时间" width="180" algin="center" />
        <el-table-column prop="timeFrameEndTime" label="时段结束时间" width="180" algin="center" />
        <el-table-column prop="consultingRoom" label="门诊类型" width="180" algin="center" />
        <el-table-column prop="numberSourceNumber" label="号源数量" width="180" algin="center" :editable="true">
          <template #default="{ row }">
            <el-input v-model="row.numberSourceNumber" @focus="initInput(row)" @change="updateData(row)"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.current" :page-sizes="[6, 12]" :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" class="page">
      </el-pagination>

      <el-dialog :draggable=true v-model="Visible" style="min-height: 300px;" width="50%" title="添加业务" append-to-body>
        <el-text style="margin-left: 200px;">科室名称：</el-text>
        <el-select @change="handleChange" v-model="deptname" filterable clearable placeholder="选择科室">
          <el-option v-for="deptn in deptnameList" :key="deptn.departmentId" :value="deptn.departmentId"
            :label="deptn.departmentName" />
        </el-select>
        <br><br>
        <el-text style="margin-left: 200px;">门诊类型：</el-text>
        <el-select @change="handleChange" v-model="roomtype" filterable clearable placeholder="门诊类型">
          <el-option v-for="room in rooms" :value="room" />
        </el-select>
        <br><br>
        <el-text style="margin-left: 200px;">号源数量：</el-text>
        <el-input-number :min="120" :integer=true style="width: 205px;" v-model="num" :step="1" />
        <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
          <el-button type="primary" @click="sumbit" :disabled="disabled">确认</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { ElTable, ElInput } from 'element-plus';
export default {
  components: {
    ElTable,
    ElInput,
  },
  data() {
    return {
      pagination: {
        current: 1, //当前页
        total: 0, //记录条数
        size: 6, //每页条数
      },
      dept: "", //科室名称
      begin: "", //开始时间
      end: "", //结束时间
      type: "", //门诊类型
      deptList: [],
      beginList: [],
      endList: [],
      typeList: [],
      Visible: false,
      deptname: "",
      deptnameList: [],
      roomtype: "",
      rooms: ['普通门诊', '专家门诊', '特需门诊'],
      num: 120,
      beforeNum: 0,
      disabled: true,
      inputBeforeDate: 0,
      inputMin: 0,
      inputMax: 0,
    };
  },
  created() {
    this.getBusiness()
    this.init()
    this.initDepartment()
  },
  methods: {

    init() {
      this.$axios.post('/business/businessList').then(res => {
        let datas = res.data.data
        datas.forEach(data => {
          if (!this.deptList.includes(data.departmentName)) {
            this.deptList.push(data.departmentName)
          }
          if (!this.beginList.includes(data.timeFrameBeginTime)) {
            this.beginList.push(data.timeFrameBeginTime)
          }

          if (!this.endList.includes(data.timeFrameEndTime)) {
            this.endList.push(data.timeFrameEndTime)
          }

          if (!this.typeList.includes(data.consultingRoom)) {
            this.typeList.push(data.consultingRoom)
          }
        })
      })
        .catch(error => {
          this.$message = error.message;
        })
    },

    initDepartment() {
      this.$axios.post('/department/departmentList').then(res => {
        this.deptnameList = res.data.data
      })

    },

    addBusiness() {
      this.Visible = true
      this.beforeNum = this.num
    },

    getBusiness() {
      //分页查询业务信息
      this.$axios.get('/business/businessPart', {
        params: {
          page: this.pagination.current,
          size: this.pagination.size,
          departmentName: this.dept,
          timeFrameBeginTime: this.begin,
          timeFrameEndTime: this.end,
          consultingRoom: this.type
        }
      }).then(res => {
        this.pagination = res.data.data
        this.total = res.data.total
      }).catch(error => {
        this.$message = error.message;
      })
    },

    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getBusiness();
    },

    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getBusiness();
    },

    handleChange() {
      if ((this.deptname.length === 0 || this.deptname === "") || (this.roomtype.length === 0 || this.roomtype === "") || (this.num === 0)) {
        this.disabled = true
      }
      else {
        this.disabled = false
      }
    },

    initInput(row) {
      this.inputBeforeDate = row['numberSourceNumber']
      this.$axios.get('/arrangement/maxAndmin',{
        params: {
          departmentName:row['departmentName'],
          timeFrameBeginTime:row['timeFrameBeginTime'],
          timeFrameEndTime:row['timeFrameEndTime'],
          consultingRoomType:row['consultingRoom']
        }
      }).then(res => {
          let datas = res.data.data
          if(datas!==null){
            this.inputMax = datas.max
            this.inputMin = datas.min
          }
          else{
            this.inputMax = 0
            this.inputMin = 0
          }
        })
    },

    updateData(row) {
      if (this.isPositiveInt(row['numberSourceNumber'])) {
        if(row['numberSourceNumber'] < this.inputMax){
          ElMessage({
            message: '请输入大于'+this.inputMax+'的正整数！',
            type: 'warning'
          })
          row['numberSourceNumber'] = this.inputBeforeDate
        }
        else{
          this.$axios.get('/business/updateNumber',{
            params:{
              numberSourceNumber:row['numberSourceNumber'],
              departmentName:row['departmentName'],
              timeFrameBeginTime:row['timeFrameBeginTime'],
              timeFrameEndTime:row['timeFrameEndTime'],
              consultingRoomType:row['consultingRoom']
            }
          }).then(res => {
            ElMessage({
            message: res.data.data,
            type: 'warning'
          })
        })
        }
      }
      else {
        ElMessage({
          message: '请输入正整数！',
          type: 'warning'
        })
        row['numberSourceNumber'] = this.inputBeforeDate
      }
    },

    isPositiveInt(num) {
      return /^[1-9]\d*$/.test(num);
    },

    sumbit() {
      if (this.isPositiveInt(this.num)) {
        this.$axios.get('/business/addBusiness', {
          params: {
            departmentId: this.deptname,
            consultingRoomType: this.roomtype,
            numberSourceNumber: this.num
          }
        }).then(res => {
          ElMessage({
            message: res.data.data,
            type: 'warning'
          })
          this.cancel()
          this.getBusiness();
          this.init();
          this.initDepartment();
        }).catch(error => {
          this.$message = error.message;
        })
      }
      else {
        ElMessage({
          message: '请输入正整数！',
          type: 'warning'
        })
      }
    },

    cancel() {
      this.Visible = false
    },
  }
};
</script>
<style>
.table {
  width: 100%;
  margin-top: 10px;
  margin-left: 10%;
}

.example-pagination-block+.example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 10px;
}

.main {
  margin-top: 10px;
}

.st-part {
  margin-top: 60px;
  margin-left: 45px;
}

.page {
  margin-top: 20px;
  margin-left: 23%;
  display: flex;
  align-items: center;
}
</style>
