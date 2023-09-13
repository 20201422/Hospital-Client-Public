<template>
    <div style="margin-top: 7%;width: 80%;">
        <el-table :data="patientQueue" border :default-sort="{ prop: 'numberSourceDate', order: 'descending' }">
            <el-table-column prop="patientName" label="挂号人姓名" width="120" align="center" />
            <el-table-column prop="recordsName" label="就诊人姓名" width="120 " align="center" />
            <el-table-column prop="numberSourceDate" sortable label="预约日期" width="150" align="center" />
            <el-table-column prop="consultationPeriod" label="预约时段" width="150" align="center" />
            <el-table-column prop="recordsPatientSex" label="性别" width="80" align="center" />
            <el-table-column prop="recordsPatientAddress" label="地址" width="380" align="center" />
            <!-- <el-table-column fixed="right" label="操作" width="120" align="center">
                <template #default="index">
                    <el-button link type="primary" size="large">
                        <span>查看</span>
                    </el-button>
                </template>
            </el-table-column> -->d
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.current" :page-sizes="[10, 5]" :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" class="page">
        </el-pagination>
    </div>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
export default {
    data() {
        return {
            doctorId: this.$store.state.userId,
            patientQueue: [],
            pagination: {
                current: 1, //当前页
                total: 0, //记录条数
                size: 10, //每页条数
            },

            grey: Global_color.model_color,
            green: Global_color.main_color,
        }
    },
    created() {
        this.getPatientQueue()
    },
    methods: {
        getPatientQueue() {
            this.$axios.get("/patientQueue/getByDoctorId/" + this.doctorId).then(response => {
                this.patientQueue = response.data.data
                this.pagination.total = response.data.data.length
            }).catch(error => { })
        },
        //改变当前记录条数
        handleSizeChange(val) {
            this.pagination.size = val;
            this.getPatientQueue()
        },
        //改变当前页码，重新发送请求
        handleCurrentChange(val) {
            this.pagination.current = val;
            this.getPatientQueue()
        },
    }
}
</script>

<style scoped>
.patient-list {
    border-radius: 18px;
    background-color: v-bind(grey);
    padding: 12px 12px 12px 12px;
    transition: all 0.45s;
    margin-top: 5%;
    width:85%;
}

.patient-list:hover {
    box-shadow: 1px 1px 20px v-bind(green);
    border-radius: 20px;
    transform: scale(1.01);
}
</style>