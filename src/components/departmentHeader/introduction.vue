<template>
    <div style="margin-top: 100px;font-size: 20px;">
        <span>名称：{{ this.departmentInfo.departmentName }}</span><br><br>
        <span>类型：{{ this.departmentInfo.departmentType }}</span><br><br>

    </div>
    <hr>
    <el-row>
        <el-col :span="8">
            <el-statistic title="总人数" :value="doctors.length" />
            <el-table :data="doctors" border style="width: 100%">
                <el-table-column prop="doctorId" label="ID" align="center" width="80" />
                <el-table-column prop="doctorName" label="姓名" align="center" width="80" />
                <el-table-column prop="doctorSex" label="性别" align="center" width="60" />
                <el-table-column prop="doctorLevel" label="职称" align="center" width="90" />
                <el-table-column prop="doctorType" label="级别" align="center" width="90" />
                <!-- <el-table-column prop="doctorIntroduction" label="擅长" width="180" /> -->
            </el-table>
        </el-col>
        <el-col :span="8">
            <el-statistic title="诊室数量" :value="consultingRooms.length" />
            <el-table :data="consultingRooms" border style="width: 100%">
                <el-table-column prop="consultingRoomId" label="ID" align="center" width="100" />
                <el-table-column prop="consultingRoomName" label="名称" align="center" width="300" />
            </el-table>
        </el-col>
        <el-col :span="8">
            <el-statistic title="总预约挂号人次" :value="registrations" />
            <div class="item3">
                <el-text style="font-size: 20px;">特需号：{{ registrations_special_need }}</el-text><br><br>
                <el-text style="font-size: 20px;">专家号：{{ registrations_expert }}</el-text><br><br>
                <el-text style="font-size: 20px;">普通号：{{ registrations_general }}</el-text><br><br>
            </div>

        </el-col>
    </el-row>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
export default {
    components: {

    },
    data() {
        return {
            departmentId: '',
            departmentInfo: {},
            doctors: [],
            consultingRooms: [],
            registrations: 0,
            registrations_general: 0,
            registrations_expert: 0,
            registrations_special_need: 0,

            grey: Global_color.model_color,
        }
    },
    created() {
        this.$axios.get("/arrangement/findDepartmentIdByDoctorId/" + this.$store.state.userId).then(response => {
            this.departmentId = response.data.data
            this.$axios.get("/department/get/" + this.departmentId).then(response => {
                this.departmentInfo = response.data.data
            }).catch(error => { });
            this.findDoctorsByDepartmentId()
            this.findConsultingRoomsByDepartmentId()
            this.getRegistrationNum()
            this.getRegistrationNumAllKinds()
        }).catch(error => {

        });
    },
    methods: {
        findDoctorsByDepartmentId() {
            this.$axios.get("/doctor/doctors/" + this.departmentId).then(response => {
                this.doctors = response.data.data
            }).catch(error => {

            });
        },
        findConsultingRoomsByDepartmentId() {
            this.$axios.get("consultingRoom/rooms/" + this.departmentId).then(response => {
                this.consultingRooms = response.data.data
            }).catch(error => { });
        },
        getRegistrationNum() {
            this.$axios.get("/department/getRegistrationNum/" + this.departmentId).then(response => {
                this.registrations = response.data.data
            }).catch(error => { });
        },
        getRegistrationNumAllKinds() {
            this.$axios.get("/department/getRegistrationNumSpecial/" + this.departmentId).then(response => {
                this.registrations_special_need = response.data.data
            }).catch(error => { });
            this.$axios.get("/department/getRegistrationNumExpert/" + this.departmentId).then(response => {
                this.registrations_expert = response.data.data
            }).catch(error => { });
            this.$axios.get("/department/getRegistrationNumGeneral/" + this.departmentId).then(response => {
                this.registrations_general = response.data.data
            }).catch(error => { });

        }
    }
}
</script>

<style scoped>
.el-col {
    text-align: center;
    padding: 1%;
}

.el-statistic {
    font-size: 20px;
    --el-statistic-title-font-weight: 400;
    --el-statistic-title-font-size: ;
    --el-statistic-title-color: var(--el-text-color-regular);
    --el-statistic-content-font-weight: 400;
    --el-statistic-content-font-size: ;
    --el-statistic-content-color: var(--el-text-color-primary);
}

.el-table {
    text-align: center;
}

.item3 {
    background-color: v-bind(grey);
    border-radius: 12px;
    height: 82%;
    padding-top: 10%;
}
</style>