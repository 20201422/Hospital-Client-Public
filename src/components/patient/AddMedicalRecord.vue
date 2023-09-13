<template>
  <el-dialog v-model="dialog" width="60%" :before-close="close" :direction="direction">
    <template #header>
      <h4>添加就诊档案</h4>
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
        <el-form-item label="证件类型" prop="recordsPatientType"
                      :rules="[{ required: true, message: '请选择证件类型', trigger: 'change' },]">
          <el-select v-model="medicalRecords.recordsPatientType" placeholder="请选择证件类型">
            <el-option label="大陆居民身份证" value="大陆居民身份证" />
            <el-option label="港澳居民往来大陆通行证" value="港澳居民往来大陆通行证" />
            <el-option label="台湾居民往来大陆通行证" value="台湾居民往来大陆通行证" />
            <el-option label="护照" value="护照" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="recordsId"
                      :rules="[{ required: true, message: '请输入证件号', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度不超过30', trigger: 'blur' },
                        { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '检查证件号', trigger: 'blur' },]">
          <el-input v-model="medicalRecords.recordsId" placeholder="请输入证件号" />
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
          <el-input v-model="medicalRecords.recordsPatientAddress" placeholder="请输入家庭住址" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="add">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import Global_color from "@/app/Global_color.vue";
import {ElMessage} from "element-plus";
import IdentityCodeValid from '@/utils/validateIdent'

export default {

  props: {
    addDialogVisible: Boolean,
  },

  setup(props, context) {
    const close = () => {
      context.emit("closeDialog");  // 关闭对话框并通知父组件
    }

    const direction = ref('rtl')

    const medicalRecords = reactive({
      recordsId: '',
      patientId: '',
      recordsName: '',
      recordsPatientPhoneNumber: '',
      recordsPatientAddress: '',
      recordsPatientSex: '男',
      recordsPatientType: '',
      recordsCredit: 10,
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

      dialog: this.addDialogVisible,

    }
  },

  methods: {

    add: function() {
      if (this.medicalRecords.recordsName.length > 0 && this.medicalRecords.recordsName.length <= 100 &&
          this.medicalRecords.recordsPatientType.length > 0 &&
          this.medicalRecords.recordsId.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/) &&
          this.medicalRecords.recordsId.length <= 30 &&
          this.medicalRecords.recordsPatientPhoneNumber.match(/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/) &&
          this.medicalRecords.recordsPatientPhoneNumber.length <= 20 && this.medicalRecords.recordsPatientAddress.length > 0 &&
          this.medicalRecords.recordsPatientAddress.length <= 200) {

        if (IdentityCodeValid(this.medicalRecords.recordsId.toUpperCase())) { // 证件号合法
          this.medicalRecords.patientId = this.$store.state.userId
          // console.log(this.medicalRecords);

          this.$axios.post("patientMedicalRecords/add", this.medicalRecords).then(resp => {
            if (resp.data.data === 0) {
              ElMessage({
                message: '该就诊档案已存在！',
                type: 'warning',
              })
            } else if (resp.data.data === -1) {
              ElMessage({
                message: '一个账号下最多三个就诊档案！',
                type: 'warning',
              })
            } else {
              location.reload()
              ElMessage({
                message: '添加成功',
                type: 'success',
              })
            }
          }).catch(error => {
            console.log(error); // 处理错误信息
          });
        } else {
          ElMessage({
            message: '错误的证件号！',
            type: 'warning',
          })
        }

      } else {
        ElMessage({
          message: '检查必填项！',
          type: 'warning',
        })
      }
    }


  },
}
</script>

<style scoped>

</style>
