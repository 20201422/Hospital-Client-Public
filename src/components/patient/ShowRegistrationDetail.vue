<template>
  <el-dialog v-model="dialog" width="65%" :before-close="close" title="挂号单">

    <template #default>
      <el-row class="doctor-el-row">
        <el-avatar :size="90" :src="require('@/assets/24.png')" class="doctor-avatar-border"/>
        <h2>{{this.doctor.doctorName}}</h2>
        <h4>{{this.department.departmentName}}({{this.department.departmentType}}){{this.doctor.doctorLevel}}</h4>
      </el-row>
      <div class="registration-content">
        <div class="registration-row">
          <el-row>
            就诊医院：三联协和医院&nbsp;&nbsp;&nbsp;&nbsp;
            就诊科室：{{this.department.departmentName}}({{this.department.departmentType}})&nbsp;&nbsp;&nbsp;&nbsp;
            {{this.registration.consultingRoomType}}
          </el-row>
          <el-row>
            就诊时间：{{this.registration.numberSourceDate}}&nbsp;
            {{moment(this.registration.numberSourceDate).format('ddd')}}&nbsp;
            {{this.registration.aMOrPm}}&nbsp;{{this.registration.consultationPeriod}}
          </el-row>
          <el-row>
            医事服务费：¥{{this.registration.numberSourceFee}}
          </el-row>
          <el-row>
            挂号状态：<el-tag v-if="this.registration.registrationState"
                             :type="getTagType(this.registration.registrationState)">
            {{this.registration.registrationState}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            挂号时间：{{this.registration.registrationTime}}
          </el-row>
          <el-row>
            就诊人：{{this.registration.recordsName}}({{this.registration.recordsPatientSex}})
          </el-row>
          <el-row v-if="this.payment">
            订单编号：{{this.payment.outTradeNo}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            支付时间：{{this.payment.gmtPayment}}
          </el-row>
        </div>

      </div>
      <el-alert title="温馨提示：1.需在10分钟内支付医事服务费，10分钟内未支付的预约号源将自动释放。支付成功后，请在手机短信或挂号记录中查看预约成功或失败结果。
      预约成功后，请于就诊当日持有效证件及手机确认短信来医院取号。2.预约成功后，如取消预约，一小时之内不能再次预约本专业号源。
      3.当天未支付的号源数量达到3次后将不可再进行预约挂号。4.有挂号单处于待支付状态时将不能进行预约挂号。
      5.请根据短信息提示分时就诊，务必注意取号时间，上午号请于11:30之前取号，下午号请于16:30之前取号，过时无法取号。
      6.社保患者，请确保先就诊档案与就诊人医保卡关联，再使用社保卡取号。
      7.如就诊当日不能前来就诊，请主动于就诊前一日14:00之前取消预约。接诊医师因疾病、紧急救治任务等原因停诊时，系统将自动取消预约，同时退还已支付费用。
      同时医院会对您的预约给予转诊处理，请注意保持电话畅通。超过14:00无法取消次日预约号，只能按退号处理，3个月内累计退号两次将进入黑名单，6个月内无法通过手机预约。
      退号将不会退还医事服务费，请注意可以取消预约的日期或者按时就诊。如遇特殊情况，请拨打 010-596XXXX (24小时）进行咨询。"
                type="warning" :closable="false" style="margin:12px 0 12px 0;" />
      <el-dialog v-model="innerVisible" width="30%" center>
        <el-result icon="success" title="点击查看支付结果" />
        <template #footer>
          <el-button type="primary" @click="goBack">点这儿</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="innerVisibleExit" width="30%" center>
        <el-result icon="warning" title="确定要退号吗？可不退钱哦" />
        <template #footer>
          <el-button type="primary" @click="exit">确定</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="innerVisibleCancel" width="30%" center>
        <el-result icon="warning" :title="this.registration.registrationState === '成功' ? '确定要取消挂号吗？医事服务费会在24小时内退回原账户'
        : '确定要取消挂号吗？'" />
        <template #footer>
          <el-button type="primary" @click="cancel">确定</el-button>
        </template>
      </el-dialog>
    </template>

    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="(this.registration.registrationState === '待支付'
        || this.registration.registrationState === '成功') && !exitTime()" type="danger"
                   @click="innerVisibleCancel = true">取消挂号</el-button>
        <el-button v-if="(this.registration.registrationState === '待支付'
        || this.registration.registrationState === '成功') && exitTime()" type="danger"
                   @click="innerVisibleExit = true">退号</el-button>
        <el-button v-if="this.registration.registrationState === '待支付'" type="primary" @click="pay">支付</el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import {ElMessage} from "element-plus";

export default {

  props: {
    registration: {},
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
      innerVisible: false,
      innerVisibleExit: false,
      innerVisibleCancel: false,

      userId: this.$store.state.userId,
      userName: this.$store.state.userName,

      moment: moment,

      doctor: {},
      department: {},
      medicalRecords: {},
      payment: {},

    }
  },

  methods: {

    getTagType(state) {
      switch (state) {
        case '成功':
          return 'success';
        case '取消':
          return 'info';
        case '待支付':
          return '';
        case '未支付':
          return 'danger';
        case '退号':
          return 'warning';
        default:
          return '';
      }
    },

    goBack: function () {
      location.reload()
    },

    pay: function () {
      const alipay = {
        traceNo: this.registration.registrationId,
        subject: '三联协和医院医事服务费（挂号费）&' + this.registration.registrationId,
        totalAmount: this.registration.numberSourceFee
      }
      this.$axios.post("alipay/pay", alipay).then(resp => {
        if (resp.data.data === '0') { // 超时未支付
          location.reload()
        } else {
          this.innerVisible = true
          const newWindow = window.open('', '_blank');
          newWindow.document.write(resp.data.data);
        }
      }).catch(error => {
        console.log(error); // 处理错误信息
      });

    },

    cancel: function () {
      if (this.payment) { // 已支付
        const alipay = {
          traceNo: this.payment.outTradeNo,
          totalAmount: this.payment.totalAmount,
          alipayTraceNo: this.payment.tradeNo,
        }
        // console.log(alipay)

          this.$axios.post('alipay/return', alipay).then(resp => {
            if (resp.data.data === '退款成功') {
              this.$axios.post('registration/cancel', {"registrationId":this.registration.registrationId}).then(resp => {
                // console.log(resp.data.data); // 处理响应数据

                location.reload()
                ElMessage({
                  message: '取消成功，医事服务费将在24小时内原路返回',
                  type: 'success',
                })

              }).catch(error => {
                console.log(error); // 处理错误信息
              });
            } else {
              ElMessage({
                message: '取消失败',
                type: 'warning',
              })
            }
          }).catch(error => {
            console.log(error); // 处理错误信息
          })
      } else {  // 未支付
        this.$axios.post('registration/cancel', {"registrationId":this.registration.registrationId}).then(resp => {
          // console.log(resp.data.data); // 处理响应数据

          location.reload()
          ElMessage({
            message: '取消成功',
            type: 'success',
          })

        }).catch(error => {
          console.log(error); // 处理错误信息
        });
      }

    },

    exit: function() {
      this.$axios.post('registration/exit', {"registrationId":this.registration.registrationId}).then(resp => {
        // console.log(resp.data.data); // 处理响应数据

        location.reload()
        ElMessage({
          message: '退号成功',
          type: 'success',
        })

      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    exitTime: function() {

      const currentDateTime = new Date();// 获取当前日期和时间
      const registrationDateTime = new Date(this.registration.numberSourceDate);// 将字符串日期转换为Date对象
      const isTomorrow = registrationDateTime.getDate() <= currentDateTime.getDate() + 1;// 判断日期是否是明天
      const isAfter3PM = currentDateTime.getHours() >= 14;// 判断当前时间是否在14:00之后

      return isTomorrow && isAfter3PM;
    },

    getDoctorInfo: function() {
      this.$axios.get("doctor/getDoctor/"+this.registration.doctorId).then(resp => {
        this.doctor = resp.data.data;
        // console.log(this.doctor)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    getDepartmentInfo: function() {
      this.$axios.get("department/get/"+this.registration.departmentId).then(resp => {
        this.department = resp.data.data;
        // console.log(this.department)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    getPaymentInfo: function() {
      this.$axios.post("alipay/find", {"registrationId":this.registration.registrationId}).then(resp => {
        this.payment = resp.data.data;
        // console.log(this.payment)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

  },

  created() {
    this.getDoctorInfo()
    this.getDepartmentInfo()
    this.getPaymentInfo()
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
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
