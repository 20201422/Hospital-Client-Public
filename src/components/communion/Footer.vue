<template>
  <footer>
    <hr style="background-color: #175850">
    <div class="footer-help">
      需要更多帮助？致电 400-820-882X。
    </div>
    <div class="footer">
      <p>三联协和医院预约挂号系统采用符合业界标准的加密技术对您提交的信息进行保密。</p>
      <hr style="background-color: #F2F2F2">
      地址： 江西省南昌市红谷滩新区丰和南大道696号 南昌航空大学
      <div style="margin-top: 8px">
        Copyright ©️ 2023 202014-2 lnc.保留所有权利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://beian.miit.gov.cn/" target="_blank">蒙ICP备2023001109号</a>
      </div>
    </div>
  </footer>
</template>

<script>
import Global_color from "@/app/Global_color.vue"

export default {
  name: "Footer",
  props: {
    msg: String
  },
  data(){
    return{
      background_color:Global_color.main_color,
      font_color:Global_color.black1,
    }
  }
}
</script>

<style scoped>
.footer-help{
  background-color: white;
  padding: 10px 0 10px 80px;
  font-size: 20px;
  color: v-bind(font_color);
}
.footer{
  overflow: hidden;
  bottom: 0;
  margin: 0 0 0 0;
  padding: 10px 80px 20px 80px;
  /* background-color: v-bind(background_color); */
  background-image: url("@/assets/background.jpg");
/* background-image: url("@/assets/人民大会堂.png"); */
  color: #F2F2F2;
  text-align: left;
  font-size: 12px;
}
.footer p{
  color: #F2F2F2;
}
a {
  color: #F2F2F2;
}
a:hover {
  color : #F2F2F2;
}
</style>
