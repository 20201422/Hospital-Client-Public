<template>

  <Header></Header>

  <div class="date">
    <el-space wrap>
      <el-card v-for="i in 7" :key="i" :class="{'box-card': true, 'selected-card': selectedCard === i}"
               @click="handleCardClick(i)">
        {{ moment().add(i-1, 'days').format('YYYY-MM-DD') }}<br>
        {{ moment().add(i-1, 'days').format('dddd') }}
      </el-card>
    </el-space>
  </div>

  <div class="content">
    <el-empty description="暂无号源" v-if="Object.getOwnPropertyNames(this.numberSourceMap).length === 0"/>
    <ShowNumberSource :numberSourceMap="this.numberSourceMap" v-else
                      @openDoctorInfo="openDoctorHandler" @openRegistration="openRegistration"></ShowNumberSource>
  </div>

  <div v-if="dialogVisible">
    <ShowDoctor :doctorId = "doctorId" :dialogVisible = "dialogVisible" @closeDialog="closeDoctorHandler"></ShowDoctor>
  </div>
  <div v-if="dialogVisibleForRegion">
    <Registration :numberSource = "numberSource" :departmentId = "departmentId" :amOrPm = "amOrPm"
                  :dialogVisibleForRegion = "dialogVisibleForRegion"
              @closeDialog="closeRegistrationHandler"></Registration>
  </div>

  <Footer></Footer>

</template>

<script>
import Header from "@/components/communion/Header.vue";
import ShowDepartment from "@/components/patient/ShowDepartment.vue";
import Footer from "@/components/communion/Footer.vue";
import { useRoute } from 'vue-router'
import ShowNumberSource from "@/components/patient/ShowNumberSource.vue";
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import ShowDoctor from "@/components/patient/ShowDoctor.vue";
import Registration from "@/components/patient/Registration.vue";

export default {
  components: {
    Registration,
    ShowDoctor,
    ShowNumberSource,
    Footer,
    ShowDepartment,
    Header
  },

  setup() {
    const departmentId = useRoute().params.departmentId


    return {
      departmentId,
    }
  },

  data() {
    return {
      numberSourceMap: {},

      dialogVisible: false,
      doctorId: '',

      dialogVisibleForRegion: false,
      numberSource: {},
      amOrPm: '',

      moment: moment,

      selectedCard: null,
    }
  },

  methods: {

    handleCardClick: function(i) {
      this.selectedCard = i;

      const date = moment().add(i-1, 'days').format('YYYY-MM-DD');

      this.$axios.post('numberSource/patientGetNumberSource' ,  {
        date: date,
        departmentId: this.departmentId
      }).then((resp) => {
        this.numberSourceMap = resp.data.data;
        // console.log(resp.data.data)
        // 定义门诊类型的顺序数组
        const order = ['专家门诊', '普通门诊', '特需门诊'];
        // 按照顺序排序门诊类型
        this.numberSourceMap = Object.fromEntries(
            Object.entries(this.numberSourceMap).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
        );

        // console.log(this.numberSourceMap)
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    openDoctorHandler: function(doctorId) {
      this.doctorId = doctorId
      this.dialogVisible = true
    },

    closeDoctorHandler: function() {
      this.dialogVisible = false
    },

    openRegistration: function(numberSource, amOrPm) {
      if (sessionStorage.getItem("user") === "null") {
        this.$router.push("/Login")
      } else {
        this.numberSource = numberSource
        this.amOrPm = amOrPm
        this.dialogVisibleForRegion = true
      }
    },

    closeRegistrationHandler: function() {
      this.dialogVisibleForRegion = false
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
        console.log("已登录")
      } else {
        //如果没有登录就返回登录界面
        // this.$router.push("/")
      }
    },
  },

  created() {
    this.isLogin();
    this.ver();
    this.isLogin()
    this.handleCardClick(1)
  }
}

</script>

<style scoped>
.date {
  padding-top: 72px;
  text-align: center;
  margin-bottom: 2px;
}
.date:hover {
  cursor: pointer;
}
.content {
  min-height: 600px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}

.el-card.is-always-shadow {
  box-shadow: #175850;
  background-color: rgba(23, 88, 80, 0.07);
  border-color: #175850;
}
.el-card.is-always-shadow:hover {
  box-shadow: #175850;
  background-image: url("@/assets/background.jpg");
  border-color: #175850;
  color: #F2F2F2;
}
.selected-card {
  color: #F2F2F2;
}
.selected-card.is-always-shadow {
  background-image: url("@/assets/background.jpg");
}
</style>
