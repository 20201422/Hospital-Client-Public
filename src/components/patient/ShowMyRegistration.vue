<template>

  <div class="registration">
    <el-empty description="暂无挂号单" v-if="this.registrations === 0"/>
    <el-table :data="this.registrations" @row-click="openMyRegistration" max-height="520">
      <el-table-column fixed prop="recordsName" label="就诊人姓名" width="120" align="center"
                       :filters="this.patients" :filter-method="filterTagForPatient" filter-placement="bottom-end" />
      <el-table-column prop="recordsPatientSex" label="就诊人性别" width="100" align="center" />
      <el-table-column prop="doctorName" label="医生姓名" width="110" align="center" sortable />
      <el-table-column prop="departmentName" label="科室名称" width="110" align="center" sortable />
      <el-table-column prop="consultingRoomType" label="门诊类型" width="110" align="center" sortable />
      <el-table-column prop="numberSourceDate" label="就诊时间" width="120" align="center" sortable />
      <el-table-column prop="aMOrPm" label="就诊午别" width="100" align="center" />
      <el-table-column prop="consultationPeriod" label="就诊时段" width="120" align="center" />
      <el-table-column prop="numberSourceFee" label="医事服务费" width="100" align="center">
        <template #default="{ row }">
          ¥{{ row.numberSourceFee }}
        </template>
      </el-table-column>
      <el-table-column prop="registrationState" label="挂号状态" width="110" align="center" fixed="right"
                       :filters="registrationType" :filter-method="filterTagForState" filter-placement="bottom-end">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.registrationState)">{{row.registrationState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="registrationTime" :data="this.registrations.sort(this.sortRegistrationTimeDesc)"
                       label="挂号时间" fixed="right" width="180" align="center" sortable />
    </el-table>
  </div>

</template>

<script>
import Global_color from "@/app/Global_color.vue";

export default {

  emits: ['openMyRegistration'], // 声明支持的自定义事件
  setup(props, { emit }) {
    const openMyRegistration = (registration) => {
      emit("openMyRegistration", registration); // 将事件名和参数作为参数传递给 emit 函数
    }

    const registrationType = [
      { text: '待支付', value: '待支付' },
      { text: '未支付', value: '未支付' },
      { text: '成功', value: '成功' },
      { text: '取消', value: '取消' },
      { text: '退号', value: '退号' },
    ]

    const filterTagForPatient = (value, row) => {
      return row.recordsName === value
    }
    const filterTagForState = (value, row) => {
      return row.registrationState === value
    }


    return {
      openMyRegistration,
      registrationType,
      filterTagForPatient,
      filterTagForState,
    }
  },


  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      registrations: [],
      patients: [],

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

    getMyRegistration() {
      this.$axios.get("registration/getAll", {params: {patientId: this.$store.state.userId}}).then(resp => {
        this.registrations = resp.data.data;
        // console.log(this.registrations)

        const patientMap = new Map()
        this.registrations.forEach((obj, index) => {
          patientMap.set(obj.recordsName, obj.recordsName)
        })
        for (const [key, value] of patientMap) {
          this.patients.push({ text: key, value: value });
        }
        // console.log(this.patients)

        if (this.registrations[0].aMOrPm === undefined && this.registrations[0].length === 0) {
          this.registrations = 0
        }
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    sortRegistrationTimeDesc(a, b) {
      return new Date(b.registrationTime) - new Date(a.registrationTime);
    },

  },

  created() {
    if (this.$store.state.isLogin) {  // 登录才执行
      this.getMyRegistration()
    }
  },

}

</script>

<style scoped>
.registration {
  margin: 24px 0 24px 0;
  color: v-bind(green);
}
</style>
