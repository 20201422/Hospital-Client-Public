<template>
  <div class="main"></div>
  <div class="st-part">
    <el-select class="el-st" placeholder="选择姓名" @change="getBlocklist" v-model="name" filterable clearable>
      <el-option v-for="option in nameList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-select class="el-st" placeholder="选择性别" @change="getBlocklist" v-model="sex" filterable clearable>
      <el-option v-for="option in sexList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-select class="el-st" placeholder="选择进入时间" @change="getBlocklist" v-model="joinTime" filterable clearable>
      <el-option v-for="option in joinTimeList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
    <el-select class="el-st" placeholder="选择移出时间" @change="getBlocklist" v-model="removeTime" filterable clearable>
      <el-option v-for="option in removeTimeList" :value="option">
        {{ option }}
      </el-option>
    </el-select>
  </div>
  <div class="row">
    <div class=col-6.5>
      <el-table class="table" :data="pagination.records" border>
        <el-table-column prop="recordsName" label="姓名" width="180" algin="center" />
        <el-table-column prop="recordsPatientPhoneNumber" label="电话号码" width="180" algin="center" />
        <el-table-column prop="recordsPatientSex" label="性别" width="180" algin="center" />
        <el-table-column prop="createTime" label="进入时间" width="180" algin="center" />
        <el-table-column prop="removeTime" label="移出时间" width="180" algin="center" />
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.current" :page-sizes="[6, 10]" :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" class="page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        current: 1, //当前页
        total: 0, //记录条数
        size: 6, //每页条数
      },
      name: "",
      nameList:[],
      sex: "",
      sexList:['男','女'],
      joinTime: "",
      joinTimeList:[],
      removeTime: "",
      removeTimeList:[],
    };
  },
  created() {
    this.init()
    this.getBlocklist()
  },
  methods: {
    init(){
      this.$axios.post('/blocklist/showBlockListObject').then(res=>{
        let datas = res.data.data
        datas.forEach(data => {
          if (!this.nameList.includes(data.recordsName)) {
            this.nameList.push(data.recordsName)
          }
          if (!this.joinTimeList.includes(data.createTime)) {
            this.joinTimeList.push(data.createTime)
          }
          if (!this.removeTimeList.includes(data.removeTime)) {
            this.removeTimeList.push(data.removeTime)
          }
        })
      }).catch(error=>{
        this.$message = error.message;
      })
    },

    getBlocklist() {
      //分页查询黑名单信息
      this.$axios.get('/blocklist/blocklist', {
        params: {
          page: this.pagination.current,
          size: this.pagination.size,
          recordsName: this.name,
          recordsPatientSex:this.sex,
          createTime: this.joinTime,
          removeTime:this.removeTime,
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
      this.getNumberSource();
    },

    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getNumberSource();
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