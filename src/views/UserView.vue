<template>
  <Header></Header>

  <div class="content">
    <div class="content-user">
      <h2>用户信息</h2>
      <form>
        <div class="form-group">
          <label for="userName">用户名：</label>
          <input type="text" id="userName" v-model="user.userName" @blur="validateName" placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label for="userPhoneNumber">电话号码：</label>
          <input type="text" id="userPhoneNumber" v-model="user.userPhoneNumber" @blur="validatePhoneNumber" placeholder="请输入电话号码" />
        </div>
        <div class="form-group">
          <label for="userPhoneNumber">邮箱：</label>
          <input type="text" id="userPhoneNumber" v-model="user.userEmail" @blur="validateEmail" placeholder="请输入邮箱" />
        </div>
        <button class="update" type="submit" @click.prevent="update" :class="{ 'disabled': !isFormValid }">更改信息</button>
        <button class="remove" type="submit" @click.prevent="innerVisible = true" :class="{ 'disabled': !isFormValid }">用户注销</button>
      </form>
    </div>
  </div>

  <el-dialog v-model="innerVisible" width="42%" center>
    <el-result icon="warning" title="确认要注销吗？（注销后账号下的就诊档案仍会保留，后续可以从其它账号导入）" />
    <template #footer>
      <div class="btn">
        <el-button @click="innerVisible = false">不了吧</el-button>
        <el-button type="primary" @click="remove">决定了</el-button>
      </div>
    </template>
  </el-dialog>

  <Footer></Footer>
</template>

<script>
import Footer from "@/components/communion/Footer.vue";
import Header from "@/components/communion/Header.vue";
import Global_color from "@/app/Global_color.vue";
import {ElMessage} from "element-plus";

export default {
  components: {
    Header,
    Footer
  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,
      red: Global_color.red1,

      innerVisible: false,

      user: {
        userId: this.$store.state.userId,
        userName: this.$store.state.userName,
        userPhoneNumber: this.$store.state.userPhoneNumber,
        userEmail: this.$store.state.userEmail,
        userType: this.$store.state.userType,
      },
    }
  },

  methods: {

    validateName() {  // 判断用户名是否为空且长度在1-20
      if (this.user.userName === '' || this.user.userName.length > 20) {
        console.log('用户名不合法');
        ElMessage.warning("用户名长度不超过20")
      }
    },
    validatePhoneNumber() { // 使用正则表达式判断手机号格式
      const phoneNumberPattern = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
      if (!phoneNumberPattern.test(this.user.userPhoneNumber)) {
        ElMessage.warning("电话号码不合法")
      }
    },
    validateEmail() { // 使用正则表达式判断邮箱格式
      const emailPattern = /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailPattern.test(this.user.userEmail)) {
        ElMessage.warning("邮箱不合法")
      }
    },

    update() {
      this.$axios.post("user/update", this.user).then(resp => {
        ElMessage.success("更新成功")

        //将用户名放入sessionStorage中
        sessionStorage.setItem("user", JSON.stringify(this.user));
        sessionStorage.setItem("userToken", this.user.userName)
        //将用户名放入vuex中
        this.$store.dispatch("setUser", JSON.stringify(this.user));
        this.$store.dispatch("setToken", this.user.userId);

      }).catch(error => {
        console.log(error); // 处理错误信息
      });

    },

    remove() {
      this.$axios.put("user/delete", {userId :this.user.userId}).then(resp => {

        this.$store.dispatch("setUser", null)
        this.$router.replace("/")

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
        console.log("已登录")

        this.user.userId = this.$store.state.userId
        this.user.userName = this.$store.state.userName
        this.user.userPhoneNumber = this.$store.state.userPhoneNumber
        this.user.userEmail = this.$store.state.userEmail
        this.user.userType = this.$store.state.userType

      } else {
        //如果没有登录就返回登录界面
        this.$router.replace("/")
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

      if (this.user.userId !== null) {
        return (
            this.user.userName !== '' &&
            this.user.userName.length <= 20 &&
            /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(this.user.userPhoneNumber) &&
            /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.user.userEmail)
        )
      }
      return true
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
.content-user {
  background-color: rgba(0, 128, 0, 0.13);
  width: 40%;
  margin: 40px;
  padding: 24px;
  color: v-bind(green);
  border-radius: 24px;
  text-align: center;
  transition: all 0.45s;
}
.content-user:hover {
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
.update {
  margin: 12px;
  padding: 10px 80px;
  border: 1px solid v-bind(green);
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  background-color: rgba(0, 128, 0, 0.26);
  color: v-bind(green);
}
.update:hover {
  background-color: v-bind(green);
  color: #F2F2F2;
}
.update.disabled {
  /* 在这里定义按钮不可点击时的样式 */
  background-color: #ccc;
  border: 1px solid #ccc;
  color: #F2F2F2;
  cursor: not-allowed;
}
.remove {
  margin: 12px;
  padding: 10px 80px;
  border: 1px solid v-bind(red);
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  background-color: rgba(255, 0, 0, 0.26);
  color: v-bind(red);
}
.remove:hover {
  background-color: v-bind(red);
  color: #F2F2F2;
}

.btn {
  display: flex;
  justify-content: space-around;
}
</style>
