<template>
  <el-dialog v-model="dialog" width="60%" :before-close="close" :direction="direction">
    <template #header>
      <h4>更新就诊档案</h4>
    </template>
    <template #default>
      <el-form :model="medicalRecords" label-width="120px">
        <el-form-item label="就诊人姓名" prop="recordsName"
                      :rules="[{ required: true, message: '请输入就诊人姓名', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在1-100', trigger: 'blur' }, ]">
          <el-input v-model="medicalRecords.recordsName" placeholder="请输入就诊人姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="recordsPatientSex"
                      :rules="[{ required: true, message: '请选择性别', trigger: 'change' },]">
          <el-radio-group v-model="medicalRecords.recordsPatientSex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件类型" prop="recordsPatientType">
          <el-input v-model="medicalRecords.recordsPatientType" :readonly="true" />
        </el-form-item>
        <el-form-item label="证件号" prop="recordsId">
          <el-input v-model="medicalRecords.recordsId" placeholder="请输入证件号" :readonly="true" />
        </el-form-item>
        <el-form-item label="联系方式" prop="recordsPatientPhoneNumber"
                      :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度不超过20', trigger: 'blur' },
                        { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
                        message: '检查联系方式', trigger: 'blur' }, ]">
          <el-input v-model="medicalRecords.recordsPatientPhoneNumber" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="recordsPatientAddress"
                      :rules="[{ required: true, message: '请输入家庭住址', trigger: 'blur' },
                        { min: 1, max: 200, message: '长度在1-200', trigger: 'blur' },]">
          <el-input type="textarea" v-model="medicalRecords.recordsPatientAddress" placeholder="请输入家庭住址" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="deleteRecode">移除</el-button>
        <el-button type="primary" @click="update">更新</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import Global_color from "@/app/Global_color.vue";
import {ElMessage} from "element-plus";

export default {

  props: {
    updateDialogVisible: Boolean,
    record: Object,
  },

  setup(props, context) {
    const close = () => {
      context.emit("closeDialog");  // 关闭对话框并通知父组件
    }

    const direction = ref('rtl')

    const medicalRecords = reactive({
      recordsId: props.record.recordsId || '',
      patientId: props.record.patientId || '',
      recordsName: props.record.recordsName || '',
      recordsPatientPhoneNumber: props.record.recordsPatientPhoneNumber || '',
      recordsPatientAddress: props.record.recordsPatientAddress || '',
      recordsPatientSex: props.record.recordsPatientSex || '',
      recordsPatientType: props.record.recordsPatientType || '',
      recordsCredit: props.record.recordsCredit || '',
    })

    return {
      close,
      direction,
      medicalRecords,
    }

  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      dialog: this.updateDialogVisible,

    }
  },

  methods: {

    update: function() {
      if (this.medicalRecords.recordsName.length > 0 && this.medicalRecords.recordsName.length <= 100 &&
          this.medicalRecords.recordsPatientType.length > 0 &&
          this.medicalRecords.recordsPatientPhoneNumber.match(/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/) &&
          this.medicalRecords.recordsPatientPhoneNumber.length <= 20 && this.medicalRecords.recordsPatientAddress.length > 0 &&
          this.medicalRecords.recordsPatientAddress.length <= 200) {
        this.medicalRecords.patientId = this.$store.state.userId
        // console.log(this.medicalRecords);

        this.$axios.put("patientMedicalRecords/update", this.medicalRecords).then(resp => {
          location.reload()
          ElMessage({
            message: '更新成功',
            type: 'success',
          })
        }).catch(error => {
          console.log(error); // 处理错误信息
        });

      } else {
        ElMessage({
          message: '检查必填项！',
          type: 'warning',
        })
      }
    },

    deleteRecode: function () {
      this.medicalRecords.patientId = ''
      this.$axios.put("patientMedicalRecords/update", this.medicalRecords).then(resp => {
        location.reload()
        ElMessage({
          message: '移除成功',
          type: 'success',
        })
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },


  },

  created() {
    // console.log(this.record)
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
