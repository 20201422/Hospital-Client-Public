<template>
  <header>
    <nav class="navbar navbar-light bg-light shadow fixed-top head" id="head">
      <a class="navbar-brand" href="/">
        <img src="../../assets/who-logo-white.svg" height="38" class="d-inline-block align-top" alt="Vue logo">
      </a>
      <div class="text-body">
        <span class="text-body-title">三联协和医院&nbsp;</span>
        <span class="text-body-title-mini">预约挂号系统</span>
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <font-awesome-icon :icon="['fas', 'bars']" style="color: #F2F2F2;" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">我要挂号</el-dropdown-item>
            <el-dropdown-item command="b">查看挂号单</el-dropdown-item>
            <el-dropdown-item command="c">管理就诊档案</el-dropdown-item>
            <el-dropdown-item command="e" :disabled="this.$store.state.userType !== '就诊人'"
                              divided v-if="!this.isLogin()">{{this.name}}</el-dropdown-item>
            <el-dropdown-item command="d" divided>
              <template v-if="isLoggedIn">
                退出登录
              </template>
              <template v-else>
                登录
              </template>
            </el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </nav>
    <br>
  </header>
</template>

<script>
import Global_color from "@/app/Global_color.vue"
import { ElMessage } from 'element-plus'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";

export default {
  name: "Header",

  components: {
    FontAwesomeIcon
  },

  props: {
    msg: String,
  },

  computed: {
    isLoggedIn() {
      try {
        return sessionStorage.getItem("user") !== "null";
      } catch (e) {
        // 处理错误情况
        console.log(e);
        return false;
      }
    }
  },

  data(){
    return {
      button_color: Global_color.button_color,
      button_color1: Global_color.button_color1,
      background_color:Global_color.main_color,

      name: this.$store.state.userName
    }
  },

  methods:{

    handleCommand: function(command) {
      if (command === 'a') {
        this.$router.push("/Patient/Department")
      } else if (command === 'b') {
        if (this.isLogin()) {
          this.$router.push("/Login")
        } else {
          this.$router.push("/Patient/MyRegistration")
        }
      } else if (command === 'c') {
        if (this.isLogin()) {
          this.$router.push("/Login")
        } else {
          this.$router.push("/Patient/MedicalRecords")
        }
      } else if (command === 'd') {
        if (this.isLogin()) {
          this.$router.push("/Login")
        } else {  // 退出登录
          // console.log(this.$route.name)
          this.$store.dispatch("setUser", null)
          // console.log(this.$route.name)
          if (this.$route.name === 'Main') {
            location.reload()
          } else {
            this.$router.replace("/")
          }
        }
      } else if (command === 'e') {
        this.$router.push("/User")
      }
    },

    isLogin: function () {
      return sessionStorage.getItem("user") === "null"
    }

  },
  created() {

  }

}

// 添加到 Font Awesome 图标库中
library.add(faBars)
</script>

<style scoped>
header {
  box-shadow: 1px 1px 20px v-bind(background_color);

}
.head{
  background-color: v-bind(background_color);
  background-image: url("@/assets/background.jpg");
}
.text-body {
  letter-spacing: 2px;
}
.text-body-title {
  font-family: SimSun, STSong, serif;
  font-weight: bold;
  color: #F2F2F2;
  font-size:38px;
}
.text-body-title-mini {
  font-family: SimSun, STSong, serif;
  font-weight: bold;
  color: #F2F2F2;
  font-size:20px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.navbar-brand {
  cursor:pointer;
}

.el-dropdown-link {
  font-size: 32px;
}
</style>
