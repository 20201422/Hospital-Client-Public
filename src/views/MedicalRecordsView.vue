<template>

  <Header></Header>

  <div class="content">
    <div class="medicalRecordView">
      <div class="medicalRecordView-head">
        <h2>就诊档案</h2>
        <div>
          <el-button class="btn" @click="openAddHandler">新增就诊档案</el-button>
          <el-button class="btn" @click="openImportHandler">导入就诊档案</el-button>
        </div>
      </div>
      <div class="medicalRecordView-content">
        <ShowMedicalRecord @openUpdate="openUpdateHandler"></ShowMedicalRecord>
      </div>
      <el-alert title="移除的就诊档案可以通过“导入就诊档案”找回。" type="warning" :closable="false" style="margin:12px 0 12px 0;" />
      <el-alert title="如果不是初次在本院就诊，请通过“导入就诊档案”添加。" type="warning" :closable="false" />
    </div>
  </div>

  <div v-if="addDialogVisible">
    <AddMedicalRecord :addDialogVisible = "addDialogVisible" @closeDialog = "closeAddHandler"></AddMedicalRecord>
  </div>
  <div v-if="importDialogVisible">
    <ImportMedicalRecord :importDialogVisible = "importDialogVisible" @closeDialog = "closeImportHandler"></ImportMedicalRecord>
  </div>
  <div v-if="updateDialogVisible">
    <UpdateMedicalRecord :record = "record" :updateDialogVisible = "updateDialogVisible"
                         @closeDialog = "closeUpdateHandler"></UpdateMedicalRecord>
  </div>

  <Footer></Footer>

</template>

<script>
import Global_color from "@/app/Global_color.vue";
import Header from "@/components/communion/Header.vue";
import Footer from "@/components/communion/Footer.vue";
import ShowMedicalRecord from "@/components/patient/ShowMedicalRecord.vue"
import AddMedicalRecord from "@/components/patient/AddMedicalRecord.vue";
import ShowDoctor from "@/components/patient/ShowDoctor.vue";
import ImportMedicalRecord from "@/components/patient/ImportMedicalRecord.vue";
import UpdateMedicalRecord from "@/components/patient/UpdateMedicalRecord.vue";


export default {
  components: {
    ImportMedicalRecord,
    ShowDoctor,
    AddMedicalRecord,
    Header,
    Footer,
    ShowMedicalRecord,
    UpdateMedicalRecord,
  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      addDialogVisible: false,
      importDialogVisible: false,
      updateDialogVisible: false,

      record: [],
    }
  },

  methods: {

    openAddHandler: function() {
      this.addDialogVisible = true
    },
    closeAddHandler: function() {
      this.addDialogVisible = false
    },

    openImportHandler: function() {
      this.importDialogVisible = true
    },
    closeImportHandler: function() {
      this.importDialogVisible = false
    },

    openUpdateHandler: function(record) {
      this.record = record
      this.updateDialogVisible = true
    },
    closeUpdateHandler: function() {
      this.updateDialogVisible = false
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
  },
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
.medicalRecordView {
  padding: 24px;
  width: 70%;
  border-radius: 18px;
  background-color: v-bind(grey);
  transition: all 0.45s;
}
.medicalRecordView:hover {
  box-shadow: 0 0 24px v-bind(green);
  border-radius: 20px;
  transform: scale(1.01);
}
.medicalRecordView-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: v-bind(green);
}
.btn {
  border: 1px solid v-bind(green);
  color: v-bind(green);
}
.btn:hover {
  background-color: v-bind(green);
  color: #F2F2F2;
}
.btn:focus {
  border: 1px solid v-bind(green);
  color: v-bind(green);
}
.medicalRecordView-content {
  min-height : 180px;
}
</style>
