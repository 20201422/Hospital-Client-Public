<template>
  <el-dialog v-model="dialog" width="60%" :before-close="close">
    <el-row class="doctor-el-row">
      <el-avatar :size="90" :src="require('@/assets/24.png')" class="doctor-avatar-border"/>
      <h2>{{this.doctor.doctorName}}</h2><h4>{{this.doctor.doctorLevel}}</h4>
    </el-row>
    <el-divider />
    <div class="doctor-arrange-table">
      <h3>出诊时间</h3>
      <table class="arrange-table">
        <thead>
        <tr>
          <th></th>
          <th v-for="(date, index) in dates" :key="index">{{ getDateLabel(date) }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(time, timeIndex) in times" :key="timeIndex">
          <td>{{ time }}</td>
          <td v-for="(date, dateIndex) in dates" :key="dateIndex" :id="getCellId(date, time)"
              :style="{ color: getCellColor(date, time) }">
            {{ getUninsuredNum(date, time) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <el-divider />
    <div class="doctor-info">
      <el-row>
        <el-col :span="11" style="width: 50%">
          <h3>简介</h3>
          <span>
            {{this.doctor.doctorIntroduction}}
          </span>
        </el-col>
        <el-col :span="2">
        </el-col>
        <el-col :span="11" style="width: 50%">
          <h3>擅长</h3>
          <span>
            {{this.doctor.doctorMajor}}
          </span>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
import moment from "moment/moment";

export default {

  props: {
    doctorId: String,
    dialogVisible: Boolean,
  },

  setup(props, context) {
    const close = () => {
      context.emit("closeDialog");  // 关闭对话框并通知父组件
    }

    return {
      close,
    }

  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      dialog: this.dialogVisible,

      doctor: {},

      doctorArrange: {},
      dates: [], // 日期数组
      times: ['上午', '下午'] // 时间数组
    }
  },

  methods: {

    getDateLabel(date) {
      return date.format('YYYY-MM-DD')
    },
    getCellId(date, time) {
      return `day${date.format('MDD')}_${time}`;
    },
    getUninsuredNum(date, time) {
      date = date.format('YYYY-MM-DD')
      if (!Array.isArray(this.doctorArrange) || this.doctorArrange.length === 0) {
        return '未出诊';
      }
      const item = this.doctorArrange.find((item) => {
        return item.numberSourceDate === date && item.amorPM === time;
      });
      if (item && item.uninsuredNum > 6) {
        return '有号';
      } else if (item && item.uninsuredNum > 0) {
        return '紧缺';
      } else if (item && item.uninsuredNum === 0){
        return '无号';
      } else {
        return '未出诊';
      }
    },
    getCellColor(date, time) {
      const uninsuredNum = this.getUninsuredNum(date, time);

      if (uninsuredNum === '紧缺') {
        return '#e2452e';
      } else if (uninsuredNum === '有号') {
        return '#175850';
      } else {
        return '#7c7c7c';
      }
    },

    openDoctorInfo: function() {
      this.$axios.get("doctor/getDoctor/"+this.doctorId).then(resp => {
        this.doctor = resp.data.data;
        // console.log(this.doctor)
        this.$axios.get("doctor/getDoctorArrange/"+this.doctorId).then(resp => {
          this.doctorArrange = resp.data.data;
          // console.log(this.doctorArrange)
        }).catch(error => {
          console.log(error); // 处理错误信息
        });
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },
  },

  created() {
    // 初始化日期数组
    const today = moment();
    for (let i = 0; i < 7; i++) {
      this.dates.push(today.clone().add(i, 'days'));
    }
    this.openDoctorInfo()
  },
}
</script>

<style scoped>
.doctor-arrange-table {
  display: flex;
  justify-content: space-around;
  margin: 12px 0 12px 0;
  flex-direction: column;
}
.arrange-table {
  border-collapse: collapse;
  width: 100%;
}
.arrange-table th, .arrange-table td {
  border: 1px solid #175850;
  padding: 10px;
  text-align: center;
}

.doctor-el-row {
  display: flex;
  align-items: flex-end;
}
.doctor-el-row h4 {
  margin-left: 24px;
}
.doctor-avatar-border {
  border: 1px solid #175850;
  margin-right: 12px;
}
.doctor-info {
  padding: 0 12px 0 12px;
}
</style>
