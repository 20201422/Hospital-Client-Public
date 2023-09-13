<template>

  <Header></Header>

  <div class="content">
    <div class="MyRegistrationView">
      <h2>挂号单</h2>
      <ShowMyRegistration @openMyRegistration = "openMyRegistration" ></ShowMyRegistration>
      <el-alert title="温馨提示：1.需在10分钟内支付医事服务费，10分钟内未支付的预约号源将自动释放。支付成功后，请在手机短信或挂号记录中查看预约成功或失败结果。
      预约成功后，请于就诊当日持有效证件及手机确认短信来医院取号。2.预约成功后，如取消预约，一小时之内不能再次预约本专业号源。
      3.当天未支付的号源数量达到3次后进入将不可再进行预约挂号。4.由挂号单处于待支付状态时将不能进行预约挂号。
      5.请根据短信息提示分时就诊，务必注意取号时间，上午号请于11:30之前取号，下午号请于16:30之前取号，过时无法取号。
      6.社保患者，请确保先就诊档案与就诊人医保卡关联，再使用社保卡取号。
      7.如就诊当日不能前来就诊，请主动于就诊前一日14:00之前取消预约。接诊医师因疾病、紧急救治任务等原因停诊时，系统将自动取消预约，同时退还已支付费用。
      同时医院会对您的预约给予转诊处理，请注意保持电话畅通。超过14:00无法取消次日预约号，只能按退号处理，3个月内累计退号两次将进入黑名单，6个月内无法通过手机预约。
      退号将不会退还医事服务费，请注意可以取消预约的日期或者按时就诊。如遇特殊情况，请拨打 010-596XXXX (24小时）进行咨询。"
                type="warning" :closable="false" style="margin:12px 0 12px 0;" />
    </div>
  </div>

  <div v-if="dialogVisible">
    <ShowRegistrationDetail :dialogVisible="dialogVisible" :registration="registration"
                            @closeDialog="closeMyRegistration"></ShowRegistrationDetail>
  </div>

  <Footer></Footer>

</template>

<script>
import Footer from "@/components/communion/Footer.vue";
import Header from "@/components/communion/Header.vue";

import Global_color from "@/app/Global_color.vue";
import ShowMyRegistration from "@/components/patient/ShowMyRegistration.vue";
import ShowMedicalRecord from "@/components/patient/ShowMedicalRecord.vue";
import ShowRegistrationDetail from "@/components/patient/ShowRegistrationDetail.vue";

export default {
  components: {
    ShowRegistrationDetail,
    ShowMedicalRecord,
    ShowMyRegistration,
    Header,
    Footer,
  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      dialogVisible: false,
      registration: [],

    }
  },

  methods: {

    openMyRegistration: function(registration) {
      this.registration = registration
      this.dialogVisible = true
    },

    closeMyRegistration: function() {
      this.dialogVisible = false
    },

    // 判断是否已经登录状态
    isLogin() {
      // 判断sessionStorage中是否有登录信息
      if (sessionStorage.getItem("user") != null && sessionStorage.getItem("userToken")) {
        // 存在登录信息就从sessionStorage中提取状态再传值给vuex中
        this.$store.commit("user", sessionStorage.getItem("user"));
      } else {
        // 登录不成功就将vuex中的state清空
        this.$store.commit("user", null);
      }
      // 返回登录状态isLogin
      return this.$store.getters.isLogin;
    },

    // 通过登录状态来判断用户是否登录执行相关的操作
    ver() {
      if (this.$store.state.isLogin) {
        // console.log(this.$store.state)
        console.log("已登录")
      } else {
        //如果没有登录就返回登录界面
        this.$router.replace("/Login")
      }
    },

  },

  created() {
    this.isLogin();
    this.ver();
  }
}
</script>

<style scoped>
.content {
  min-height: 470px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 120px;
  margin-bottom: 50px;
}
.MyRegistrationView {
  padding: 24px;
  width: 80%;
  border-radius: 18px;
  color: v-bind(green);
  background-color: v-bind(grey);
  transition: all 0.45s;
}
.MyRegistrationView:hover {
  box-shadow: 0 0 24px v-bind(green);
  border-radius: 20px;
  transform: scale(1.01);
}
</style>
