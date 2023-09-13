<template>
  <el-dialog v-model="dialog" width="60%" :before-close="close" title="挂号">
    <el-row class="doctor-el-row">
      <el-avatar :size="90" :src="require('@/assets/24.png')" class="doctor-avatar-border"/>
      <h2>{{this.doctor.doctorName}}</h2>
      <h4>{{this.department.departmentName}}({{this.department.departmentType}}){{this.doctor.doctorLevel}}</h4>
    </el-row>
    <div class="registration-content">
      <div class="registration-row">
        <el-row>
          就诊医院：三联协和医院
        </el-row>
        <el-row>
          就诊科室：{{this.department.departmentName}}({{this.department.departmentType}})
        </el-row>
        <el-row>
          就诊时间：{{this.numberSource.numberSourceDate}}&nbsp;
          {{moment(this.numberSource.numberSourceDate).format('ddd')}}&nbsp;
          {{this.amOrPm}}&nbsp;{{this.numberSource.consultingRoomType}}
        </el-row>
        <el-row>
          医事服务费：¥{{this.numberSource.numberSourceFee.toFixed(2)}}
        </el-row>
        <el-row>
          就诊人：
          <el-select v-model="this.form.recordsId" placeholder="请选择就诊档案" clearable>
            <el-option v-for="(record, index) in medicalRecords[0]" :key="index"
                       :label="record.recordsName" :value="record.recordsId"/>
          </el-select>
        </el-row>
      </div>
      <el-row>
        <a @click="goMedicalRecords">没有就诊档案？去添加</a>
      </el-row>
    </div>
    <el-alert title="温馨提示：1.当日预约（挂号）（1） 可以进行当日预约（挂号）。支付成功后，请在手机短信或挂号记录中查看当日预约成功或失败结果。
      （2） 按照短信或挂号详情提示，在指定的就诊时问及就诊地点进行分诊、等待叫号，按序就诊。2.预约挂号（1） 可以预约未来7天的号源，当天15:00停止
      预约次日的号源。（2） 需在10分钟内支付医事服务费，10分钟内未支付的预约号源将自动释放。（3） 预约成功后，如取消预约，一小时之内不能再次预约
      本专业号源。"
              type="warning" :closable="false" style="margin:12px 0 12px 0;" />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="registration" :disabled="this.form.recordsId === ''">挂号</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import {ref} from "vue";
import {ElMessage} from "element-plus";

export default {

  props: {
    numberSource: {},
    departmentId: String,
    amOrPm: String,
    dialogVisibleForRegion: Boolean,
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

      dialog: this.dialogVisibleForRegion,

      userId: this.$store.state.userId,
      userName: this.$store.state.userName,

      doctor: {},
      department: {},
      medicalRecords: {},

      moment: moment,

      form: {
        departmentId: '',
        doctorId: '',
        numberSourceDate: '',
        aMOrPm: '',
        recordsId: '',
      },
    }
  },

  methods: {

    getDoctorInfo: function() {
      this.$axios.get("doctor/getDoctor/"+this.numberSource.doctorId).then(resp => {
        this.doctor = resp.data.data;
        // console.log(this.doctor)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    getDepartmentInfo: function() {
      this.$axios.get("department/get/"+this.departmentId).then(resp => {
        this.department = resp.data.data;
        // console.log(this.department)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },
    getMedicalRecords: function() {
      this.$axios.get("patientMedicalRecords/findAll", {params: {patientId: this.$store.state.userId}})
          .then(resp => {
        this.medicalRecords = resp.data.data
        // console.log(this.medicalRecords)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    goMedicalRecords: function () {
      this.$router.push("/Patient/MedicalRecords")
    },

    registration: function () {
      this.form.departmentId = this.department.departmentId
      this.form.doctorId = this.numberSource.doctorId
      this.form.numberSourceDate = this.numberSource.numberSourceDate
      this.form.aMOrPm = this.amOrPm
      // console.log(this.form)

      if (new Date().getHours() < 5) {  // 5:00之前不可预约
        ElMessage({
          message: '5:00开放预约号源',
          type: 'warning',
        })
      } else {
        if (this.todayNumberSource()) {  // 要预约今天的号并且当前时间在8:00后或14:00后
          if (this.form.aMOrPm === '上午') {
            ElMessage({
              message: '8:00后不可在线预约上午的号',
              type: 'warning',
            })
          } else {
            ElMessage({
              message: '14:00后不可在线预约下午的号',
              type: 'warning',
            })
          }
        } else if (this.tomorrowNumberSource()) {  // 如果要约明天的号并且当前已在14:00后
          ElMessage({
            message: '14:00后不可预约次日的号',
            type: 'warning',
          })
        } else {
          this.$axios.post('registration/register', this.form).then(resp => {
            // console.log(resp.data.data); // 处理响应数据

            if (resp.data.data === 0) {
              ElMessage({
                message: '您的档案当前在黑名单，暂不支持线上预约',
                type: 'warning',
              })
            } else if (resp.data.data === -1) {
              ElMessage({
                message: '您有未支付的挂号单，请支付后再挂号',
                type: 'warning',
              })
            } else if (resp.data.data === -2) {
              ElMessage({
                message: '请一个小时后再预约该科室',
                type: 'warning',
              })
            } else if (resp.data.data === -3) {
              ElMessage({
                message: '未支付的号源超过三次，今日不可线上预约',
                type: 'warning',
              })
            } else if (resp.data.data === -4) {
              ElMessage({
                message: '您已预约该号，请勿重复预约',
                type: 'warning',
              })
            } else {
              this.$router.push("/Patient/MyRegistration")

              ElMessage({
                message: '预约成功，请在10分钟内完成支付',
                type: 'success',
              })
            }

          }).catch(error => {
            console.log(error); // 处理错误信息
          });
        }
      }

    },

    todayNumberSource: function() { // 今天的号
      const now = new Date()
      const numberSourceDate = new Date(this.form.numberSourceDate);

      if (this.form.aMOrPm === '上午') {
        return numberSourceDate.getDate() === now.getDate() && now.getHours() >= 8
      } else {
        return numberSourceDate.getDate() === now.getDate() && now.getHours() >= 14
      }
    },
    tomorrowNumberSource: function() {  // 明天的号
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const numberSourceDate = new Date(this.form.numberSourceDate);

      return numberSourceDate.getDate() === tomorrow.getDate() && now.getHours() >= 14;
    },

  },

  created() {
    this.getDoctorInfo()
    this.getDepartmentInfo()
    this.getMedicalRecords()
  },
}
</script>

<style scoped>
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

.registration-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.registration-row {
  display: flex;
  flex-direction: column;
  font-size:18px;
  margin: 27px 0 27px 0;
}
.el-row {
  padding: 8px 0 8px 0;
}
a {
  color: #175850;
}
a:hover {
  cursor: pointer;
}
</style>
