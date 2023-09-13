<template>

  <Header></Header>

  <div class="content">
    <ShowDepartment></ShowDepartment>
  </div>

  <Footer></Footer>

</template>

<script setup>

import Footer from "@/components/communion/Footer.vue";
import Header from "@/components/communion/Header.vue";
import ShowDepartment from "@/components/patient/ShowDepartment.vue";
</script>

<style scoped>
.content {
  padding-top: 40px;
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
