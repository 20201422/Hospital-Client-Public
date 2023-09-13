<template>
  <el-empty description="暂无就诊档案" v-if="this.medicalRecords === 0"/>
  <el-scrollbar>
    <div v-for="(records, index) in this.medicalRecords" :key="index" class="records">
      <div v-for="record in records" :key="record.recordsId" class="record" @click="openUpdate(record)">
        <el-row class="record-1">
          <h4>{{record.recordsName.length > 4 ? record.recordsName.slice(0, 4) + '...' : record.recordsName}}</h4>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{record.recordsPatientSex}}</span>
        </el-row>
        <div>
          证件号：{{record.recordsId.length > 18 ? record.recordsId.slice(0, 18) + '...' : record.recordsId}}
        </div>
        <div>
          联系方式：{{record.recordsPatientPhoneNumber.length > 11 ?
            record.recordsPatientPhoneNumber.slice(0, 11) + '...' : record.recordsPatientPhoneNumber}}
        </div>
        <div>
          家庭住址：{{ record.recordsPatientAddress.length > 10 ?
            record.recordsPatientAddress.slice(0, 10) + '...' : record.recordsPatientAddress }}
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import Global_color from "@/app/Global_color.vue";

export default {

  emits: ['openUpdate'], // 声明支持的自定义事件
  setup(props, { emit }) {
    const openUpdate = (record) => {
      emit("openUpdate", record); // 将事件名和参数作为参数传递给 emit 函数
    }

    return {
      openUpdate,
    }
  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      medicalRecords: [],

    }
  },

  methods: {

    getMedicalRecords: function() {
      this.$axios.get("patientMedicalRecords/findAll", {params: {patientId: this.$store.state.userId}}).then(resp => {
        this.medicalRecords = resp.data.data
        // console.log(this.medicalRecords[0].length)
        if (this.medicalRecords[0].patientId === undefined && this.medicalRecords[0].length === 0) {
          this.medicalRecords = 0
        }
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

  },

  created() {
    if (this.$store.state.isLogin) {  // 登录才执行
      this.getMedicalRecords()
    }
  },

}

</script>

<style scoped>
.records {
  display: flex;
}
.record {
  margin: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid v-bind(green);
  min-width: 280px;
  max-width: 280px;
  background-color: rgba(0, 128, 0, 0.03);
  transition: all 0.45s;
}
.record:hover {
  box-shadow: 0 0 8px v-bind(green);
  border-radius: 20px;
  transform: scale(1.01);
  cursor: pointer;
}
.record-1 {
  display: flex;
  align-items: baseline;
}
</style>
