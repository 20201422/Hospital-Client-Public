<template>
  <div v-for="(value, key) in this.numberSourceMap" :key="key" class="numberSourceMap">
    <h3 style="margin-top: 4px">&nbsp;&nbsp;{{ key }}</h3>
    <el-scrollbar>
      <div class="numberSources">
        <div v-for="item in value" :key="item" class="numberSource">
          <el-row class="el-row" @click="openDoctorInfo(item.doctorId)">
            <el-avatar :size="70" :src="require('@/assets/24.png')" class="avatar-border"/>
            <h3>{{item.doctorName}}</h3><h4>({{item.doctorSex}})</h4>
          </el-row>
          <table class="numberSource-table">
            <tr :class="{'numberSource-table-amCount-no': item.amCounts === 0}">
              <td>{{item.numberSourceDate}}</td>
              <td>上午</td>
              <td class="numberSource-table-count">
                {{item.amCounts > 6 ? '有号' : item.amCounts > 0 ? '紧缺' : '无号' }}
              </td>
              <td :style="item.amCounts === 0 ? '' : { color: '#f7a04c' }">¥{{item.numberSourceFee.toFixed(2)}}</td>
              <td><el-button @click="openRegistration(item, '上午')" class="btn" :disabled="item.amCounts === 0">挂号</el-button></td>
            </tr>
            <tr :class="{'numberSource-table-pmCount-no': item.pmCounts === 0}">
              <td>{{item.numberSourceDate}}</td>
              <td>下午</td>
              <td class="numberSource-table-count">
                {{item.pmCounts > 6 ? '有号' : item.pmCounts > 0 ? '紧缺' : '无号'}}
              </td>
              <td :style="item.pmCounts === 0 ? '' : { color: '#f7a04c' }">¥{{item.numberSourceFee.toFixed(2)}}</td>
              <td><el-button @click="openRegistration(item, '下午')" class="btn" :disabled="item.pmCounts === 0">挂号</el-button></td>
            </tr>
          </table>
        </div>
      </div>
    </el-scrollbar>
  </div>

</template>

<script>
import Global_color from "@/app/Global_color.vue";

export default {

  props: {
    numberSourceMap: {
      type: Object,
      required: true,
    }
  },

  emits: ['openDoctorInfo', 'openRegistration'], // 声明支持的自定义事件
  setup(props, { emit }) {
    const openDoctorInfo = (doctorId) => {
      emit("openDoctorInfo", doctorId); // 将事件名和参数作为参数传递给 emit 函数
    }

    const openRegistration = (numberSource, amOrPm) => {
      emit("openRegistration", numberSource, amOrPm); // 将事件名和参数作为参数传递给 emit 函数
    }

    return {
      openDoctorInfo,
      openRegistration,
    }
  },

  data() {
    return {
      grey: Global_color.model_color,
      green: Global_color.main_color,
      font_grey: Global_color.font_grey,

    }
  },

  methods: {

  },

  created() {

  },
}

</script>

<style scoped>
.numberSourceMap {
  width: 80%;
  padding: 8px 16px 8px 16px;
  background-color: v-bind(grey);
  border-radius: 18px;
  transition: all 0.45s;
  margin: 18px;
}
.numberSourceMap:hover {
  box-shadow: 0 0 8px v-bind(green);
  border-radius: 20px;
  transform: scale(1.01);
}
.numberSources {
  display: flex;
}
.numberSource {
  border: 1px solid v-bind(green);
  background-color: white;
  border-radius: 12px;
  margin: 4px 12px 4px 12px;
  padding: 8px;
  min-width: 320px;
  transition: all 0.45s;
}
.numberSource:hover {
  box-shadow: 0 0 8px v-bind(green);
  border-radius: 18px;
  transform: scale(1.01);
}
.el-row {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.avatar-border {
  border: 1px solid v-bind(green);
  margin-right: 12px;
}
.numberSource-table {
  text-align: center;
}
.numberSource-table td {
  padding: 2px 8px 2px 8px;
}
.btn {
  border: 1px solid v-bind(green);
  color: v-bind(green);
}
.btn:hover {
  background-color: v-bind(green);
  color : v-bind(grey);
}
.numberSource-table-amCount-no, .numberSource-table-pmCount-no {
  color: v-bind(font_grey);
}

.arrange-table th, .arrange-table td {
  border: 1px solid v-bind(green);
  padding: 10px;
  text-align: center;
}
</style>
