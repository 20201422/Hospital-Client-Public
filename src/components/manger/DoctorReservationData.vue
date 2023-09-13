<template>
  <div class="charts"></div>
  <el-select class="el-st" @change="getData(dept, week, doctorName)" v-model="week" filterable clearable>
    <el-option v-for="option in weekList" :value="option">
      {{ option }}
    </el-option>
  </el-select>
  <el-select class="el-st" @change="getData(dept, week, doctorName)" v-model="dept" filterable clearable>
    <el-option v-for="option in deptList" :value="option">
      {{ option }}
    </el-option>
  </el-select>
  <el-select class="el-st" @change="getData(dept, week, doctorName)" v-model="doctorName" filterable clearable>
    <el-option v-for="option in dctList" :value="option">
      {{ option }}
    </el-option>
  </el-select>
  <el-button class = "el-btn" type="primary" @click="exportData">
    <el-icon class="el-icon--left"><Download /></el-icon>DownLoad
  </el-button>
  <div class = "row">
    <div class = "col-5">
      <div class="pie" ref="pie"></div>
    </div>
    <div class = "col-5">
      <div class="box" ref="box"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      week: "本周",
      deptList: [],
      dctList:[],
      doctorName:"",
      dept: "",
      weekList: [],
      count: [0, 0, 0, 0, 0, 0, 0]
    }
  },

  created() {
    this.init()
    setTimeout(() => {
      this.getCharts1(this.count)
      this.getCharts2(this.count)
    }, 1000)
  },

  methods: {
    init() {
      this.$axios.post('/numberSourceDetail/doctorRegistrationData').then(res => {
        let datas = res.data.data;
        datas.forEach(data => {
          if (!this.deptList.includes(data.departmentName)) {
            this.deptList.push(data.departmentName)
          }
          if (!this.weekList.includes(data.weekType)) {
            this.weekList.push(data.weekType)
          }
          if(!this.dctList.includes(data.doctorName)){
            this.dctList.push(data.doctorName)
          }
          this.dept = this.deptList[0]
          this.doctorName = this.dctList[0]
          if (data.departmentName === this.dept && data.weekType === this.week && data.doctorName === this.doctorName) {
            this.count[data.date - 1] = data.count
          }
        })
      })
    },
    getData(dept, week,doctorName) {
      this.$axios.post('/numberSourceDetail/doctorRegistrationData').then(res => {
        let datas = res.data.data;
        const count = [0, 0, 0, 0, 0, 0, 0]
        datas.forEach(data => {
          if (data.departmentName === dept && data.weekType === week && data.doctorName === doctorName) {
            count[data.date - 1] = data.count
          }
        })
        this.getCharts1(count)
        this.getCharts2(count)
      })
    },
    getCharts1(array) {
      var chartDom = this.$refs['box'];
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '预约数量',
            type: 'bar',
            barWidth: '60%',
            data: array
          }
        ]
      };

      option && myChart.setOption(option);

    },
    getCharts2(count) {
      var chartDom = this.$refs['pie'];
      var myChart = this.$echarts.init(chartDom);
      var option;
      var seriesData = []
      var name = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      for (var i = 0; i < count.length; i++) {
        seriesData.push({
          value: count[i],
          name: name[i]
        })
      }
      option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '预约情况',
            type: 'pie',
            radius: '50%',
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);
    },
    exportData() {
    download().then((res) => {
        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement("a"); // 创建a标签
        link.href = url;
        link.download = "报表.xlsx"; // 重命名文件
        link.click();
        URL.revokeObjectURL(url);
      });
    },
  }
}
export function download() {
  return axios({
    url: '/excel/export',
    method: 'post',
    data: "1",
    responseType: 'blob'
  })
}
</script>
<style>
.box {
  width: 100%;
  height: 450px;
  margin-right: 30px;
  margin-top: 80px;
}

.pie {
  width: 100%;
  height: 450px;
  margin-top: 100px;
}

.charts {
  margin-top: 60px;
}

</style>