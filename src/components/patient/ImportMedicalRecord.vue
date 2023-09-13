<template>
  <el-dialog v-model="dialog" width="40%" :before-close="close">
    <template #header>
      <h4>导入就诊档案</h4>
    </template>
    <template #default>
      <div class="find">
        <el-form-item label="证件号">
          <el-input v-model="recordsId" placeholder="请输入证件号" />
        </el-form-item>
        <el-button @click="find" :disabled="this.recordsId === null || this.recordsId.length === 0">查询</el-button>
      </div>
      <div class="ok">
        <div class="record" v-if="record !== null && record !== '' && record !== 'null' &&  record.length !== 0 && record !== 1">
          <el-row class="record-1">
            <h4>{{record.recordsName}}</h4>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{record.recordsPatientSex}}</span>
          </el-row>
          <div>
            证件号：{{record.recordsId}}
          </div>
          <div>
            联系方式：{{record.recordsPatientPhoneNumber}}
          </div>
          <div>
            家庭住址：{{record.recordsPatientAddress}}
          </div>
        </div>
        <div v-if="record === null || record === '' || record === 'null' ||  record.length === 0">
          未找到
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="importRecord" :disabled="this.record === null || this.record.length === 0">导入</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
import {ElMessage} from "element-plus";

export default {

  props: {
    importDialogVisible: Boolean,
  },

  setup(props, context) {
    const close = () => {
      context.emit("closeDialog");  // 关闭对话框并通知父组件
    }

    return {
      close,
    }

  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

      dialog: this.importDialogVisible,

      recordsId: '',

      record: 1,
    }
  },

  methods: {

    find: function () {
      this.$axios.get("patientMedicalRecords/find/" + this.recordsId).then(resp => {
        this.record = resp.data.data;
        // console.log(this.record);
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    },

    importRecord: function () {
      this.record.patientId = this.$store.state.userId
      // console.log(this.record);
      this.$axios.post("patientMedicalRecords/import", this.record).then(resp => {
        // console.log(resp.data.data);
        if (resp.data.data === -1) {
          ElMessage({
            message: '一个账号下最多三个就诊档案！',
            type: 'warning',
          })
        } else if (resp.data.data === 0) {
          ElMessage({
            message: '该就诊档案已经在该账号下！',
            type: 'warning',
          })
        } else if (resp.data.data === 1) {
          location.reload()
          ElMessage({
            message: '导入成功',
            type: 'success',
          })
        }
      }).catch(error => {
        console.log(error); // 处理错误信息
      });
    }

  },

  created() {
    // console.log(this.record)
  },

}
</script>

<style scoped>
.find {
  display: flex;
  justify-content: space-around;
}
.el-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 0;
  align-items: flex-start;
}
.ok {
  display: flex;
  justify-content: center;
  margin-top: 27px;
  min-height:180px;
}
.record {
  margin: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid v-bind(green);
  min-width: 300px;
  max-width: 300px;
  background-color: rgba(0, 128, 0, 0.03);
  transition: all 0.45s;
}
.record-1 {
  display: flex;
  align-items: baseline;
}
</style>
