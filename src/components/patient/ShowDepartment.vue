<template>
  <div class="department-list">
    <div v-for="(departments, type) in departmentMap" :key="type">
      <h3 style="margin-top: 4px">{{ type }}</h3>
      <div class="departments">
        <div v-for="item in departments" :key="item.departmentId" class="department">
          <el-button type="success" plain class="button" @click="goRegister(item.departmentId)">{{ item.departmentName }}</el-button>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="centerDialogVisible" title="门诊预约提醒" width="60%" align-center
             :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <span>
      一、就诊档案创建与绑定<br>
      1.首次到我院就诊的患者，需要创建就诊档案。创建成功后，按照短信/邮件提示于来院当日，凭注册人身份证原件或其它证件类型在自助机上实名认证。
      2.首次就诊患者，如已经预约挂号，就诊当日请先到门诊楼一楼自助机实名认证后再按照挂号单提示前往诊区就诊。如需使用社保卡，请在实名认证时绑定社保卡。
      3.每个账号可绑定3位就诊人，一年（365天）内最多解除绑定就诊人5次。
    </span><br>
    <span>
      二、预约挂号<br>
      1.当日预约（挂号）
      （1） 可以进行当日预约（挂号）。支付成功后，请在手机短信或挂号记录中查看当日预约成功或失败结果。
      （2） 8:00后不可在线预约上午的号，14:00后不可在线预约下午的号。可以前往医院线下挂号。
      （3） 按照短信或挂号详情提示，在指定的就诊时问及就诊地点进行分诊、等待叫号，按序就诊。
      2.预约挂号
      （1） 可以预约未来7天的号源，当天14:00停止预约次日的号源。
      （2） 需在10分钟内支付医事服务费，10分钟内未支付的预约号源将自动释放。支付成功后，请在手机短信或挂号记录中查看预约成功或失败结果。预约成功后，请于就诊当日持有效证件及手机确认短信来医院取号。
      （3） 预约成功后，如取消预约，一小时之内不能再次预约本专业号源。
      3.每日0:00开放当日号源，5:00开放预约号源。
      4.当天未支付的号源数量达到3次后进入将不可再进行预约挂号。
      5.由挂号单处于待支付状态时将不能进行预约挂号。
    </span><br>
    <span>
      三、就诊<br>
      1.请根据短信息提示分时就诊，务必注意取号时间，上午号请于11:30之前取号，下午号请于16:30之前取号，过时无法取号。
      2.社保患者，请确保先就诊档案与就诊人医保卡关联，再使用社保卡取号。
    </span><br>
    <span>
      四、取消预约及退号<br>
      （一）取消预约
      1.取消预约：如就诊当日不能前来就诊，请主动于就诊前一日14:00之前取消预约。
      2.接诊医师因疾病、紧急救治任务等原因停诊时，系统将自动取消预约，同时退还已支付费用。同时医院会对您的预约给予转诊处理，请注意保持电话畅通。
      3.超过14:00无法取消次日预约号，只能按退号处理，3个月内累计退号两次将进入黑名单，6个月内无法通过互联网预约。
      （二）退号
      退号将不会退还医事服务费，请注意可以取消预约的日期或者按时就诊。
    </span><br>
    <span>
      五、注意事项<br>
      1.特需医疗不纳入基本医疗保险报销范围，均为自费，为自主定价且高于基本医疗费用，请您知情并自愿选择。
      2.在医事服务费报销或退费未完成之前请勿解绑银行卡、修改实名认证、注销账户，以免给您造成经济损失。
    </span><br>
    <span>
      六、联系我们<br>
      如遇特殊情况，请拨打 010-596XXXX (24小时）进行咨询。
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="goBack">我不同意</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">已阅读并同意</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Global_color from "@/app/Global_color.vue";

export default {

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      departmentMap: {},
      centerDialogVisible: true,
    }
  },

  methods: {

    goBack: function () {
      this.$router.replace("/")
    },

    showStoryMap: function () {
      this.$axios.post('department/getAll').then((resp) => {
        this.departmentMap = resp.data.data
        // console.log(this.departmentMap)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    goRegister: function (departmentId) {
      this.$router.push({ path: `/Patient/Registration/${departmentId}` })
    },
  },

  created() {
    this.showStoryMap()
  },
}
</script>

<style scoped>
.department-list {
  width: 80%;
  border-radius: 18px;
  background-color: v-bind(grey);
  padding: 12px 32px 12px 32px;
  transition: all 0.45s;
}
.department-list:hover {
  box-shadow: 1px 1px 20px v-bind(green);
  border-radius: 20px;
  transform: scale(1.01);
}
.departments {
  display: flex;
  flex-wrap: wrap;
}
.department {
  margin: 8px 4px 8px 4px;
}

.button {
  border-color: v-bind(green);
  color: v-bind(green);
  background-color: white;
  transition: all 0.45s;
}
.button:hover {
  color: #F2F2F2;
  border-color: v-bind(green);
  background-color: v-bind(green);
}
.button:focus {
  border-color: v-bind(green);
  color: v-bind(green);
  background-color: white;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
