<template>
  <Header></Header>
  <div class="row">
    <div class="col-2">
      <el-menu class="el-menu-vertical-demo" :collapse="isCollapse">
        <el-sub-menu index="1">
          <template #title>业务管理</template>
          <router-link to='/mangerMain/showBusiness' class="navs">
            <el-menu-item index="1-1">业务查看</el-menu-item>
          </router-link>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>黑名单管理</template>
          <router-link to='/mangerMain/showBlockList' class="navs">
            <el-menu-item index="2-1">查看黑名单</el-menu-item>
          </router-link>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>号源管理</template>
          <router-link to='/mangerMain/showNumberSource' class="navs">
            <el-menu-item index="3-1">号源查看</el-menu-item>
          </router-link>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>数据分析和统计</template>
          <RouterLink to='/mangerMain/departmentReservationData' class="navs">
            <el-menu-item index="4-1">科室预约数据统计</el-menu-item>
          </RouterLink>
          <RouterLink to='/mangerMain/doctorReservationData' class="navs">
            <el-menu-item index="4-2">医生预约数据统计</el-menu-item>
          </RouterLink>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="col-10">
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script>
import Header from "@/components/communion/Header.vue";
import Footer from "@/components/communion/Footer";

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      isCollapse: false
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

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 94%;
  min-height: 620px;
  margin-top: 50px;
}

.navs:hover {
  text-decoration: none;
}
</style>
