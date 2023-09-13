<template>
    <div class="frame">
        <div style="margin-left: 21%;">
            <el-button @click="lastWeek">上一周</el-button>
            <el-button @click="nowWeek">本周</el-button>
            <el-button @click="nextWeek">下一周</el-button>
        </div>
        <div style="margin-bottom: 10px ;clear: both;">

        </div>
        <div v-for="dateInfo in date" class="arrangementtable" :key="dateKey">
            <div id="oneDay" class="oneday">
                <div id='date'>
                    <label>{{ dateInfo.time }}</label>
                    <label>{{ dateInfo.week }}</label>
                </div>

                <div id='am' class="halfday">
                    <label>上午</label>
                    <div v-for="info in arrangementInfo">
                        <div v-if="info.numberSourceDate == dateInfo.time && info.amOrPm == '上午'">
                            <el-tag :key="info.doctorName" type='info' size="large" class="arrangementTag"
                            @click="openArrangmentInfo(info)">
                                {{ info.consultingRoomName }}<br><br>
                                {{ info.number }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <div id='pm' class="halfday">
                    <label>下午</label>
                    <div v-for="info in arrangementInfo">
                        <div v-if="info.numberSourceDate == dateInfo.time && info.amOrPm == '下午'">
                            <el-tag :key="info.doctorName" type='info' size="large" class="arrangementTag"
                            @click="openArrangmentInfo(info)">
                                {{ info.consultingRoomName }}<br><br>
                                {{ info.number }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="detailVisible" style="min-height: 300px;" width="50%" title="排班详情" append-to-body :draggable=true>
        <el-text size="large">{{ this.selectedArrangementInfo.numberSourceDate }}</el-text>&nbsp;&nbsp;
        <el-text size="large">{{ this.selectedArrangementInfo.amOrPm }}</el-text><br><br>
        <el-text size="large">医生：{{ this.selectedArrangementInfo.doctorName }}</el-text>&nbsp;&nbsp;
        <el-text size="large">诊室：{{ this.selectedArrangementInfo.consultingRoomName }}</el-text><br><br>
        <el-text size="large">号源数量</el-text><br>
        <div v-if="selectedArrangementInfo.amOrPm == '上午'">
            <el-text size="large">&nbsp; 8:00 ~ &nbsp; 8:30 &nbsp; {{ selectedDoctorInfoNum[0] }}</el-text><br>
            <el-text size="large">&nbsp; 8:30 ~ &nbsp; 9:00 &nbsp; {{ selectedDoctorInfoNum[1] }}</el-text><br>
            <el-text size="large">&nbsp; 9:00 ~ &nbsp; 9:30 &nbsp; {{ selectedDoctorInfoNum[2] }}</el-text><br>
            <el-text size="large">&nbsp; 9:30 ~ 10:00 &nbsp; {{ selectedDoctorInfoNum[3] }}</el-text><br>
            <el-text size="large">10:00 ~ 10:30 &nbsp; {{ selectedDoctorInfoNum[4] }}</el-text><br>
            <el-text size="large">10:30 ~ 11:00 &nbsp; {{ selectedDoctorInfoNum[5] }}</el-text><br>
        </div>
        <div v-if="selectedArrangementInfo.amOrPm == '下午'">
            <el-text size="large"> 14:00 ~ 14:30 &nbsp; {{ selectedDoctorInfoNum[0] }}</el-text><br>
            <el-text size="large"> 14:30 ~ 15:00 &nbsp; {{ selectedDoctorInfoNum[1] }}</el-text><br>
            <el-text size="large"> 15:00 ~ 15:30 &nbsp; {{ selectedDoctorInfoNum[2] }}</el-text><br>
            <el-text size="large"> 15:30 ~ 16:00 &nbsp; {{ selectedDoctorInfoNum[3] }}</el-text><br>
            <el-text size="large"> 16:00 ~ 16:30 &nbsp; {{ selectedDoctorInfoNum[4] }}</el-text><br>
            <el-text size="large"> 16:30 ~ 17:00 &nbsp; {{ selectedDoctorInfoNum[5] }}</el-text><br>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            doctorId: this.$store.state.userId,
            date: [],
            today: '',
            dateKey: 0,  //用于界面刷新
            arrangementInfo: [],
            detailVisible:false, 
            selectedArrangementInfo:[],
            selectedDoctorInfoNum:[],
        }
    },
    beforeMount() {
        let dateList = this.getNowWeek()
        this.date = [
            { time: dateList[0], week: '星期一' },
            { time: dateList[1], week: '星期二' },
            { time: dateList[2], week: '星期三' },
            { time: dateList[3], week: '星期四' },
            { time: dateList[4], week: '星期五' },
            { time: dateList[5], week: '星期六' },
            { time: dateList[6], week: '星期日' }
        ],
            this.$axios.get("/arrangement/findByDoctorId/" + this.doctorId).then(response => {
                this.arrangementInfo = response.data.data
            }).catch(error => { })
    },
    methods: {
        nameFormat(value) {
            if (value.length < 3) { //如果是两个汉字
                value = value.slice(0, 1) + '　' + value.slice(1) //拆分字符串并加入全角的空格
            }
            return value
        },
        getNowWeek() {

            let oneDayTime = 1000 * 60 * 60 * 24
            this.today = new Date()
            let todayDay = this.today.getDay() || 7
            let startDate = new Date(
                this.today.getTime() - oneDayTime * (todayDay - 1)
            )
            let dateList = []
            for (let i = 0; i < 7; i++) {
                let temp = new Date(startDate.getTime() + i * oneDayTime)
                let year = temp.getFullYear()
                let month = temp.getMonth() + 1 < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1
                let day = temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate()
                dateList[i] = `${year}-${month}-${day}`
            }

            return dateList

        },

        getNextWeek() {
            let oneDayTime = 1000 * 60 * 60 * 24
            this.today.setDate(this.today.getDate() + 7)
            let todayDay = this.today.getDay() || 7
            let startDate = new Date(
                this.today.getTime() - oneDayTime * (todayDay - 1)
            )
            let dateList = []
            for (let i = 0; i < 7; i++) {
                let temp = new Date(startDate.getTime() + i * oneDayTime)
                let year = temp.getFullYear()
                let month = temp.getMonth() + 1 < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1
                let day = temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate()
                dateList[i] = `${year}-${month}-${day}`
            }
            return dateList
        },
        getLastWeek() {
            let oneDayTime = 1000 * 60 * 60 * 24
            this.today.setDate(this.today.getDate() - 7)
            let todayDay = this.today.getDay() || 7
            let startDate = new Date(
                this.today.getTime() - oneDayTime * (todayDay - 1)
            )
            let dateList = []
            for (let i = 0; i < 7; i++) {
                let temp = new Date(startDate.getTime() + i * oneDayTime)
                let year = temp.getFullYear()
                let month = temp.getMonth() + 1 < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1
                let day = temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate()
                dateList[i] = `${year}-${month}-${day}`
            }
            return dateList
        },
        nextWeek() {
            let dateList = this.getNextWeek()
            this.date = [
                { time: dateList[0], week: '星期一' },
                { time: dateList[1], week: '星期二' },
                { time: dateList[2], week: '星期三' },
                { time: dateList[3], week: '星期四' },
                { time: dateList[4], week: '星期五' },
                { time: dateList[5], week: '星期六' },
                { time: dateList[6], week: '星期日' }
            ]
            this.dateKey++
        },
        lastWeek() {
            let dateList = this.getLastWeek()
            this.date = [
                { time: dateList[0], week: '星期一' },
                { time: dateList[1], week: '星期二' },
                { time: dateList[2], week: '星期三' },
                { time: dateList[3], week: '星期四' },
                { time: dateList[4], week: '星期五' },
                { time: dateList[5], week: '星期六' },
                { time: dateList[6], week: '星期日' }
            ]
            this.dateKey++
        },
        nowWeek() {
            let dateList = this.getNowWeek()
            this.date = [
                { time: dateList[0], week: '星期一' },
                { time: dateList[1], week: '星期二' },
                { time: dateList[2], week: '星期三' },
                { time: dateList[3], week: '星期四' },
                { time: dateList[4], week: '星期五' },
                { time: dateList[5], week: '星期六' },
                { time: dateList[6], week: '星期日' }
            ]
            this.dateKey++
        },
        openArrangmentInfo(info) {
            this.selectedArrangementInfo = info;
            this.detailVisible = true;
            var count = info.number  //总号源数
            var cores = 6    //时间段数量
            for (var idx = 0; idx < cores; idx++) {
                var min = parseInt(count * idx / cores);
                var max = parseInt(count * (idx + 1) / cores);
                var averageNum = 0
                for (var i = min; i < max; i++) {
                    averageNum++
                }
                this.selectedDoctorInfoNum[idx] = averageNum
            }
        },

    }
}
</script>

<style scoped>
.frame {
    margin-left: 15%;
    margin-top: 6%;
}

.arrangementtable {
    float: left;
}

.oneday {
    height: 500px;
    width: 100px;
    text-align: center;
}

.halfday {
    border: 1px solid var(--el-border-color);
    height: 45%;

}

label {
    display: inline-block;
}

.button_text {
    color: v-bind(button_color2);
}

.button_text:hover {
    cursor: pointer;
}

.itemInfo {
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color);
}

.arrangementTag {
    width: 94%;
    min-height: 185px;
    margin-bottom: 3px;
    cursor: pointer;
    font-size: small;
    color: #000;
}
</style>