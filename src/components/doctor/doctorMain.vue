<template>
  <Header></Header>
  <div class="row">
    <div class="col-2">
      <el-menu style="height: 700px; margin-top: 48px;" active-text-color="#ffd04b" background-color="#175850"
        text-color="#fff">
        <label
          style="color: white; font-size: larger;margin: 30px 0px 30px 40px;">医生{{ this.$store.state.userName }}你好</label>
        <el-menu-item index="1">
          <router-link to="/doctorMain/personalInformation" class="navs"
            :class="{ 'router-link-active': $route.path === '/doctorMain/personalInformation' }">个人信息</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/doctorMain/patientQueue" class="navs"
            :class="{ 'router-link-active': $route.path === '/doctorMain/patientQueue' }">预约患者</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/doctorMain/myArrangement" class="navs"
            :class="{ 'router-link-active': $route.path === '/doctorMain/myArrangement' }">我的排班</router-link>
        </el-menu-item>
        <!-- <el-menu-item index="4">
                    <router-link to='/doctorMain/changeshiftApply' class="navs">调班申请</router-link>
                </el-menu-item> -->

      </el-menu>
    </div>
    <div class="col-10">
      <router-view></router-view>
    </div>
  </div>
  <Footer></Footer>
</template>

<script>
import Header from "@/components/communion/Header.vue";
import Footer from "@/components/communion/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      doctorId: this.$store.state.userId
    }
  },
  methods: {
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
  },
}
</script>

<style scoped>
.navs {
  font-size: larger;
  color: white;
  text-align: center;
  display: inline-block;
  padding: 0.5rem 1rem;
  padding-left: 30%;
  transition: all 0.15s;
}

.navs:hover {
  text-decoration: none;
}

.router-link-active {
  font-size: 20px;
}</style>
