<template>
  <Header></Header>

  <div class="content">
    <div class="content-register">
      <h2>用户注册</h2>
      <form>
        <div class="form-group">
          <label for="patientName">用户名：</label>
          <input type="text" id="patientName" v-model="patient.patientName" @blur="validateName" placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label for="patientPhoneNumber">电话号码：</label>
          <input type="text" id="patientPhoneNumber" v-model="patient.patientPhoneNumber" @blur="validatePhoneNumber" placeholder="请输入电话号码" />
        </div>
        <div class="form-group">
          <label for="patientEmail">邮箱：</label>
          <input type="text" id="patientEmail" v-model="patient.patientEmail" @blur="validateEmail" placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label for="patientPassword">密码：</label>
          <input type="password" id="patientPassword" v-model="patient.patientPassword" @blur="validatePassword" placeholder="请输入密码" />
        </div>
        <button type="submit" @click.prevent="register" :class="{ 'disabled': !isFormValid }">注册</button>
      </form>
    </div>
  </div>

  <Footer></Footer>
</template>

<script>
import Header from "@/components/communion/Header.vue";
import Footer from "@/components/communion/Footer.vue";
import Global_color from "@/app/Global_color.vue";
import {ElMessage} from "element-plus";

export default {
  components: {
    Footer,
    Header
  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      patient: {
        patientName: '',
        patientPhoneNumber: '',
        patientEmail: '',
        patientPassword: '',
      },
    }
  },

  methods: {

    validateName() {  // 判断用户名是否为空且长度在1-20
      if (this.patient.patientName === '' || this.patient.patientName.length > 20) {
        console.log('用户名不合法');
        ElMessage.warning("用户名长度不超过20")
      }
    },
    validatePhoneNumber() { // 使用正则表达式判断手机号格式
      const phoneNumberPattern = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
      if (!phoneNumberPattern.test(this.patient.patientPhoneNumber)) {
        ElMessage.warning("电话号码不合法")
      }
    },
    validateEmail() { // 使用正则表达式判断邮箱格式
      const emailPattern = /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailPattern.test(this.patient.patientEmail)) {
        console.log('邮箱不合法');
        ElMessage.warning("邮箱不合法")
      }
    },
    validatePassword() {  // 判断密码是否为空且长度大于6
      if (this.patient.patientPassword === '' || this.patient.patientPassword.length < 6) {
        ElMessage.warning("密码长度要大于等于6")
      }
    },

    register() {
      this.$axios.put("user/register", this.patient).then(resp => {
        this.$router.go(-1)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });

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
        this.$router.replace("/")
      } else {
        //如果没有登录就返回登录界面
        // this.$router.replace("/Login")
      }
    },

  },

  created() {
    this.isLogin();
    this.ver();
  },

  computed: {
    isFormValid() {
      // 检查表单是否满足条件，例如所有输入合法才返回true，否则返回false
      return (
          this.patient.patientName !== '' &&
          this.patient.patientName.length <= 20 &&
          /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(this.patient.patientPhoneNumber) &&
          /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.patient.patientEmail) &&
          this.patient.patientPassword !== '' &&
          this.patient.patientPassword.length >= 6
      );
    }
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
.content-register {
  background-color: rgba(0, 128, 0, 0.13);
  width: 40%;
  margin: 40px;
  padding: 24px;
  color: v-bind(green);
  border-radius: 24px;
  text-align: center;
  transition: all 0.45s;
}
.content-register:hover {
  box-shadow: 0 0 24px v-bind(green);
  border-radius: 20px;
  transform: scale(1.01);
}
.form-group {
  margin-top: 27px;
  margin-bottom: 20px;
  text-align: center;
}
label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
}
input {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid v-bind(green);
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  width: 250px;
}
button {
  margin: 12px;
  padding: 10px 80px;
  border: 1px solid v-bind(green);
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  background-color: rgba(0, 128, 0, 0.26);
  color: v-bind(green);
}
button:hover {
  background-color: v-bind(green);
  color: #F2F2F2;
}
button.disabled {
  /* 在这里定义按钮不可点击时的样式 */
  background-color: #ccc;
  border: 1px solid #ccc;
  color: #F2F2F2;
  cursor: not-allowed;
}
</style>

