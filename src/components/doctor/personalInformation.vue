<template>
    <div style="margin-top: 100px;font-size: 20px;">
        <span>
            姓名：{{ doctorInfo.doctorName }}
        </span>
        <br><br>
        <span>
            性别：{{ doctorInfo.doctorSex }}
        </span>
        <br><br>
        <span>
            邮箱：{{ doctorInfo.doctorEmail }}
        </span>
        <br><br>
        <span>
            电话：{{ doctorInfo.doctorPhoneNumber }}
        </span>
        <br><br>
        <span>
            专业：{{ doctorInfo.doctorMajor }}
        </span>
        <br><br>
        <span>
            简介：{{ doctorInfo.doctorIntroduction }}
        </span>
        <br><br>
        <span>
            职称：{{ doctorInfo.doctorLevel }}
        </span>
        <br><br>
    </div>
</template>
<script>
export default {
    data() {
        return {
            doctorId: this.$store.state.userId,
            doctorInfo: {},
        }
    },
    created() {
        this.$axios.get("/doctor/findById/" + this.doctorId).then(response => {
            this.doctorInfo = response.data.data
        }).catch(error => { });


    },
    methods: {

    }
}
</script>

<style scoped></style>