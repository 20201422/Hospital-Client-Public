<template>
    <div class="row" style="margin-top: 30px;">
        <div class="col-9">
            <div class="frame">
                <el-button @click="recordsVisible = true">排班记录</el-button>
                <el-button @click="comfirmQuickArrangeVisible = true">一键排班</el-button>
                <el-button type="danger" plain style="margin-left: 70%;"
                    @click="comfirmDeleteAllVisible = true">全部删除</el-button>
                <hr>
                <div style="margin-bottom: 10px ;clear: both;">

                </div>
                <el-scrollbar height="520px" v-loading="loading" element-loading-text="读取数据中...">
                    <div class="scrollbar-flex-content">
                        <div v-for="dateInfo in date" class="arrangementtable">
                            <div id="oneDay" class="oneday">
                                <div id='date'>
                                    <label>{{ dateInfo.time }}</label>
                                    <label>{{ dateInfo.week }}</label>
                                </div>

                                <div id='am' class="halfday">
                                    <label>上午</label>
                                    <el-scrollbar style="height: 70%;">
                                        <div v-for="info in arrangementInfo" :key="arrangementKey">
                                            <div v-if="info.numberSourceDate == dateInfo.time && info.amOrPm == '上午'">
                                                <el-popconfirm confirm-button-text="编辑" cancel-button-text="删除" title="请选择"
                                                    @cancel="confirmDelete(info)" @confirm="openArrangmentInfo(info)">
                                                    <template #reference>
                                                        <el-tag :key="info.doctorName" type='info' size="large"
                                                            class="arrangementTag">
                                                            <div class="tag-top">
                                                                {{ nameFormat(info.doctorName) }}&nbsp;&nbsp;{{ info.number
                                                                }}
                                                            </div>
                                                            <el-text class="roomName" size="small">{{
                                                                info.consultingRoomName.slice(3) }}</el-text>
                                                        </el-tag>
                                                    </template>
                                                </el-popconfirm>
                                            </div>
                                        </div>
                                    </el-scrollbar>
                                    <el-text class="button_text" type="primary"
                                        @click="addArrangement(dateInfo.time, '上午')">添加+</el-text>
                                </div>

                                <div id='pm' class="halfday">
                                    <label>下午</label>
                                    <el-scrollbar style="height: 70%;">
                                        <div v-for="info in arrangementInfo">
                                            <div v-if="info.numberSourceDate == dateInfo.time && info.amOrPm == '下午'">
                                                <el-popconfirm confirm-button-text="编辑" cancel-button-text="删除" title="请选择"
                                                    @cancel="confirmDelete(info)" @confirm="openArrangmentInfo(info)">
                                                    <template #reference>
                                                        <el-tag :key="info.doctorName" type='info' size="large"
                                                            class="arrangementTag">
                                                            <div class="tag-top">
                                                                {{ nameFormat(info.doctorName) }}&nbsp;&nbsp;{{ info.number
                                                                }}
                                                            </div>
                                                            <el-text class="roomName" size="small">{{
                                                                info.consultingRoomName.slice(3) }}</el-text>
                                                        </el-tag>
                                                    </template>
                                                </el-popconfirm>
                                            </div>
                                        </div>
                                    </el-scrollbar>
                                    <el-text class="button_text" type="primary"
                                        @click="addArrangement(dateInfo.time, '下午')">添加+</el-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div style="margin-bottom: 50px ;clear: both;"></div>
        </div>
        <div class="col-3">
            <doctorList></doctorList>
        </div>
    </div>
    <el-dialog v-model="addVisible" style="min-height: 300px;" width="50%" title="添加排班" append-to-body :draggable=true>
        <el-text size="large">{{ this.selectedDate }}</el-text>&nbsp;&nbsp;
        <el-text size="large">{{ this.selectedAmOrPm }}</el-text><br><br>
        <el-text size="large">号源总数</el-text>&nbsp;&nbsp;
        <el-text size="large">专家门诊：{{ this.allNumberSource1 }}</el-text>&nbsp;&nbsp;
        <el-text size="large">特需门诊：{{ this.allNumberSource2 }}</el-text>&nbsp;&nbsp;
        <el-text size="large">普通门诊：{{ this.allNumberSource3 }}</el-text>&nbsp;&nbsp;
        <br><br>

        <el-select v-model="selectedDoctor" placeholder="选择医生" @change="selectTrigger">
            <el-option v-for="doctor in doctors" :key="doctor.doctorId" :label="doctor.doctorName"
                :value="doctor.doctorId" />
        </el-select>
        &nbsp;&nbsp;
        <el-select v-model="selectedConsultingRoom" clearable placeholder="选择诊室">
            <el-option v-for="room in consultingRooms" :key="room.consultingRoomId" :label="room.consultingRoomName"
                :value="room.consultingRoomId" />
        </el-select>
        <br><br>
        <el-text size="large">设置号源数量</el-text><br><br>
        <el-input-number v-model="numberSourceNum" :min="0" :max="remainNumberSource" />
        <br><br>
        <el-text size="large">剩余号源数量 {{ remainNumberSource }}</el-text>

        <div style="display: flex;justify-content: flex-end;margin-top: 10px;margin-right: 2%;" class="row">
            <el-button type="primary" @click="confirmAdd">确认</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
    </el-dialog>

    <el-dialog v-model="detailVisible" style="min-height: 300px;" width="50%" title="排班详情" append-to-body :draggable=true>
        <!-- <el-text size="large">{{ this.selectedArrangementInfo.numberSourceDate }}</el-text>&nbsp;&nbsp; -->
        <!-- <el-text size="large">{{ this.selectedArrangementInfo.amOrPm }}</el-text><br><br> -->
        <el-date-picker style="width: 205px;" v-model="updateDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
            type="datetime" />&nbsp;&nbsp;
        <el-select v-model="updateAmOrPm">
            <el-option label="上午" value="上午" />
            <el-option label="下午" value="下午" />
        </el-select><br><br>
        <el-text size="large">医生：{{ nameFormat(this.selectedArrangementInfo.doctorName) }}</el-text>
        <!-- <el-text size="large" style="margin-left: 10%;">诊室：{{ this.selectedArrangementInfo.consultingRoomName }}</el-text><br><br> -->
        <span style="margin-left: 11%;">诊室：</span><el-select v-model="updateConsultingRoom" clearable placeholder="选择诊室">
            <el-option v-for="room in consultingRooms" :key="room.consultingRoomId" :label="room.consultingRoomName"
                :value="room.consultingRoomId" />
        </el-select><br><br>
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
        <div style="display: flex;justify-content: flex-end;margin-top: 10px;margin-right: 2%;" class="row">
            <el-button type="primary" @click="confirmLook">确认</el-button>
            <el-button @click="cancelLook">取消</el-button>
        </div>
    </el-dialog>
    <el-dialog v-model="comfirmUpdateVisible" title="调班" width="30%">
        <span>确认调班？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="comfirmUpdateVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmUpdate">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="comfirmDeleteVisible" title="删除排班" width="30%">
        <span>删除数据将无法恢复，确认删除？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="comfirmDeleteVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteArrangment(wantDelInfo)">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="comfirmDeleteAllVisible" title="删除所有排班" width="30%">
        <span>删除数据将无法恢复，确认删除？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="comfirmDeleteAllVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDeleteAll">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="comfirmQuickArrangeVisible" title="快速排班" width="30%">
        <el-text size="large">一键排班不会覆盖你已有的排班，所以建议你清空当前的排班再确认</el-text>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="comfirmQuickArrangeVisible = false">取消</el-button>
                <el-button type="primary" @click="quickArrange">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="recordsVisible" style="min-height: 300px;" width="70%" title="排班记录" append-to-body :draggable=true>
        <el-scrollbar height="520px">
            <div class="scrollbar-flex-content">
                <div v-for="dateInfo in beforeDate" class="arrangementtable">
                    <div id="oneDay" class="oneday">
                        <div id='date'>
                            <label>{{ dateInfo.time }}</label>
                            <label>{{ dateInfo.week }}</label>
                        </div>

                        <div id='am' class="halfday">
                            <label>上午</label>
                            <el-scrollbar style="height: 70%;">
                                <div v-for="info in arrangementInfo" :key="arrangementKey">
                                    <div v-if="info.numberSourceDate == dateInfo.time && info.amOrPm == '上午'">
                                        <el-popconfirm confirm-button-text="查看" cancel-button-text="取消" title="请选择"
                                            @confirm="openArrangmentInfo(info)">
                                            <template #reference>
                                                <el-tag :key="info.doctorName" type='info' size="large"
                                                    class="arrangementTag">
                                                    <div class="tag-top">
                                                        {{ nameFormat(info.doctorName) }}&nbsp;&nbsp;{{ info.number }}
                                                    </div>
                                                    <el-text class="roomName" size="small">{{
                                                        info.consultingRoomName.slice(3)
                                                    }}</el-text>
                                                </el-tag>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>

                        <div id='pm' class="halfday">
                            <label>下午</label>
                            <el-scrollbar style="height: 70%;">
                                <div v-for="info in arrangementInfo">
                                    <div v-if="info.numberSourceDate == dateInfo.time && info.amOrPm == '下午'">
                                        <el-popconfirm confirm-button-text="查看" cancel-button-text="取消" title="请选择"
                                            @confirm="openArrangmentInfo(info)">
                                            <template #reference>
                                                <el-tag :key="info.doctorName" type='info' size="large"
                                                    class="arrangementTag">
                                                    <div class="tag-top">
                                                        {{ nameFormat(info.doctorName) }}&nbsp;&nbsp;{{ info.number }}
                                                    </div>
                                                    <el-text class="roomName" size="small">{{
                                                        info.consultingRoomName.slice(3)
                                                    }}</el-text>
                                                </el-tag>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<script>
import Global_color from "@/app/Global_color.vue";
import { ElMessage } from 'element-plus';
import doctorList from '@/components/departmentHeader/doctorList.vue';
export default {
    components: {
        doctorList
    },
    data() {
        return {
            departmentId: '',
            time: [],
            week: [],
            date: [],
            beforeTime: [],
            beforeWeek: [],
            beforeDate: [],
            arrangementInfo: [],
            addVisible: false,
            detailVisible: false,
            recordsVisible: false,
            selectedDate: '',
            updateDate: '',
            selectedAmOrPm: '',
            updateAmOrPm: '',
            selectedDoctor: '',
            selectedDoctorInfo: '',
            selectedDoctorInfoNum: [],//查看排班的每个时段的号源数量
            selectedConsultingRoom: '',
            updateConsultingRoom: '',
            selectedConsultingRoomType: '',
            selectedArrangementInfo: {},  //用于查看排班详情数据渲染
            doctors: [],
            consultingRooms: [],
            numberSourceNum: 0,
            remainNumberSource: 0, //剩余号源数量
            allNumberSource1: 0, //专家门诊号源数量
            allNumberSource2: 0, //特需门诊号源数量
            allNumberSource3: 0, //普通门诊号源数量
            arrangementKey: 0,   //用于界面刷新
            comfirmUpdateVisible: false,
            comfirmDeleteVisible: false,
            comfirmQuickArrangeVisible: false,
            comfirmDeleteAllVisible: false,
            wantDelInfo: '',   //用于删除排班
            loading: false,

            button_color2: Global_color.button_color,
            grey: Global_color.model_color,
            green: Global_color.main_color,
            font_grey: Global_color.font_grey,
        }
    },
    created() {
        this.$axios.get("/arrangement/findDepartmentIdByDoctorId/" + this.$store.state.userId).then(response => {
            this.departmentId = response.data.data
            this.$axios.get("/arrangement/findByDepartmentId/" + this.departmentId).then(response => {
                this.arrangementInfo = response.data.data
            }).catch(error => { console.log(error) })
        }).catch(error => {

        });

        this.getNowDate()
    },

    methods: {
        nameFormat(value) {
            if (value.length < 3) { //如果是两个汉字
                value = value.slice(0, 1) + '　' + value.slice(1) //拆分字符串并加入全角的空格
            }
            return value
        },
        getNowDate() {
            var date = new Date();
            var year = date.getFullYear() // 年
            var month = date.getMonth() + 1; // 月
            var day = date.getDate(); // 日
            var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
            var week = weekArr[date.getDay()];
            // 给一位数的数据前面加 “0”
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (day >= 0 && day <= 9) {
                day = "0" + day;
            }
            var nowTime = year + "-" + month + "-" + day
            // for (let i = 7; i < 14; i++) {  //后14天
            //     this.time.push(this.getAfterDate(i, nowTime))
            // }
            for (let i = 7; i < 21; i++) {  //后14天
                this.time.push(this.getAfterDate(i, nowTime))
            }
            for (let i = 7; i > 0; i--) {  //前7天
                this.beforeTime.push(this.getBeforeDate(i, nowTime))
            }
            for (let i = 0; i < 7; i++) {  //后七天
                this.beforeTime.push(this.getAfterDate(i, nowTime))
            }
            this.date = [
                { time: this.time[0], week: this.week[0] },
                { time: this.time[1], week: this.week[1] },
                { time: this.time[2], week: this.week[2] },
                { time: this.time[3], week: this.week[3] },
                { time: this.time[4], week: this.week[4] },
                { time: this.time[5], week: this.week[5] },
                { time: this.time[6], week: this.week[6] },
                { time: this.time[7], week: this.week[7] },
                { time: this.time[8], week: this.week[8] },
                { time: this.time[9], week: this.week[9] },
                { time: this.time[10], week: this.week[10] },
                { time: this.time[11], week: this.week[11] },
                { time: this.time[12], week: this.week[12] },
                { time: this.time[13], week: this.week[13] },
            ]
            this.beforeDate = [
                { time: this.beforeTime[0], week: this.week[14] },
                { time: this.beforeTime[1], week: this.week[15] },
                { time: this.beforeTime[2], week: this.week[16] },
                { time: this.beforeTime[3], week: this.week[17] },
                { time: this.beforeTime[4], week: this.week[18] },
                { time: this.beforeTime[5], week: this.week[19] },
                { time: this.beforeTime[6], week: this.week[20] },
                { time: this.beforeTime[7], week: this.week[21] },
                { time: this.beforeTime[8], week: this.week[22] },
                { time: this.beforeTime[9], week: this.week[23] },
                { time: this.beforeTime[10], week: this.week[24] },
                { time: this.beforeTime[11], week: this.week[25] },
                { time: this.beforeTime[12], week: this.week[26] },
                { time: this.beforeTime[13], week: this.week[27] },
            ]
        },
        getAfterDate(num, time) {
            let n = num;
            let d = '';
            if (time) {
                d = new Date(time);
            } else {
                d = new Date();
            }
            let year = d.getFullYear();
            let mon = d.getMonth() + 1;
            let day = d.getDate();
            let monthDay = new Date(year, mon, 0).getDate(); //当前一个月的天数
            if (day + n >= monthDay) {
                if (mon < 12) {
                    mon = mon + 1;
                } else {
                    year = year + 1;
                    mon = 1;
                }
            }
            d.setDate(d.getDate() + n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();

            let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            this.week.push(weekday[d.getDay()])   //星期
            let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
            return s;
        },
        getBeforeDate(num, time) {
            let n = num;
            let d = '';
            if (time) {
                d = new Date(time);
            } else {
                d = new Date();
            }
            let year = d.getFullYear();
            let mon = d.getMonth() + 1;
            let day = d.getDate();
            let monthDay = new Date(year, mon, 0).getDate(); //当前一个月的天数
            if (n >= day) {
                if (mon > 1) {
                    mon = mon - 1;
                } else {
                    year = year - 1;
                    mon = 12;
                }
            }
            d.setDate(d.getDate() - n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();

            let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            this.week.push(weekday[d.getDay()])   //星期
            let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
            return s;
        },
        addArrangement(date, amOrPm) {
            this.selectedDoctor = '';
            this.selectedConsultingRoom = '';
            this.numberSourceNum = 0;
            this.remainNumberSource = 0;
            this.addVisible = true;
            this.selectedDate = date;
            this.selectedAmOrPm = amOrPm;
            this.$axios.get("/doctor/doctors/" + this.departmentId).then(response => {
                this.doctors = response.data.data;
            }).catch(error => {
                console.log(error);
            });

            this.$axios.get("/consultingRoom/rooms/" + this.departmentId).then(response => {
                this.consultingRooms = response.data.data;
            }).catch(error => {
                console.log(error);
            });

            this.$axios.get("/arrangement/getAllNumberSource", {
                params: {
                    consultingRoomType: '专家门诊',
                    date: this.selectedDate,
                    amOrPm: this.selectedAmOrPm,
                    departmentId: this.departmentId
                }
            }).then(response => {
                this.allNumberSource1 = response.data.data
            }).catch(error => { });

            this.$axios.get("/arrangement/getAllNumberSource", {
                params: {
                    consultingRoomType: '特需门诊',
                    date: this.selectedDate,
                    amOrPm: this.selectedAmOrPm,
                    departmentId: this.departmentId
                }
            }).then(response => {
                this.allNumberSource2 = response.data.data
            }).catch(error => { });

            this.$axios.get("/arrangement/getAllNumberSource", {
                params: {
                    consultingRoomType: '普通门诊',
                    date: this.selectedDate,
                    amOrPm: this.selectedAmOrPm,
                    departmentId: this.departmentId
                }
            }).then(response => {
                this.allNumberSource3 = response.data.data
            }).catch(error => { });

        },
        deleteArrangment(info) {
            this.$axios.get("/arrangement/del", {
                params: {
                    doctorId: info.doctorId,
                    consultingRoomId: info.consultingRoomId,
                    numberSourceDate: info.numberSourceDate,
                    amOrPm: info.amOrPm,
                }
            }).then(response => {
                this.$axios.get("/arrangement/findByDepartmentId/" + this.departmentId).then(response => {
                    this.arrangementInfo = response.data.data
                    this.arrangementKey++;
                }).catch(error => { console.log(error) })
            }).catch(error => { })
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
            this.comfirmDeleteVisible = false
        },
        openArrangmentInfo(info) {
            this.$axios.get("/consultingRoom/rooms/" + this.departmentId).then(response => {
                this.consultingRooms = response.data.data;
            }).catch(error => {
                console.log(error);
            });
            this.selectedArrangementInfo = info;
            this.detailVisible = true;
            this.updateDate = this.selectedArrangementInfo.numberSourceDate
            this.updateAmOrPm = this.selectedArrangementInfo.amOrPm
            this.updateConsultingRoom = this.selectedArrangementInfo.consultingRoomId;

            this.updateDateKey++
            this.updateAmOrPmKey++
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
        selectTrigger() {
            this.$axios.get("/doctor/findById/" + this.selectedDoctor).then(response => {
                this.selectedDoctorInfo = response.data.data

                if (this.selectedDoctorInfo.doctorLevel == '主任医师') {
                    this.selectedConsultingRoomType = '专家门诊'
                }
                if (this.selectedDoctorInfo.doctorLevel == '主治医师') {
                    this.selectedConsultingRoomType = '特需门诊'
                }
                if (this.selectedDoctorInfo.doctorLevel == '医生') {
                    this.selectedConsultingRoomType = '普通门诊'
                }
                this.$axios.get("/arrangement/getRemainNumber", {
                    params: {
                        doctorLevel: this.selectedDoctorInfo.doctorLevel,
                        consultingRoomType: this.selectedConsultingRoomType,
                        date: this.selectedDate,
                        amOrPm: this.selectedAmOrPm,
                        departmentId: this.departmentId
                    }
                }).then(response => {
                    this.remainNumberSource = response.data.data
                }).catch(error => { console.log(error) })
            }).catch(error => { console.log(error) })


        },
        confirmAdd() {
            var r = /^\+?[1-9][0-9]*$/
            if (this.selectedDoctor == '' || this.selectedConsultingRoom == '') {
                ElMessage({
                    message: '添加失败，数据不能为空！',
                    type: 'warning',
                })
                return;
            } else if (!r.test(this.numberSourceNum)) {
                ElMessage({
                    message: '添加失败，号源数量不是正整数！',
                    type: 'warning',
                })
                return;
            } else {
                this.$axios.get("/arrangement/checkDoctor", {   //检查该医生是否排班
                    params: {
                        doctorId: this.selectedDoctor,
                        numberSourceDate: this.selectedDate,
                        amOrPm: this.selectedAmOrPm
                    }
                }).then(response => {
                    var doctorNum = response.data.data
                    this.$axios.get("/arrangement/checkConsultingRoom", { //检查该诊室是否排班
                        params: {
                            consultingRoomId: this.selectedConsultingRoom,
                            numberSourceDate: this.selectedDate,
                            amOrPm: this.selectedAmOrPm
                        }
                    }).then(response => {
                        var consultingRoomNum = response.data.data
                        if (doctorNum > 0) {
                            ElMessage({
                                message: '添加失败，该医生已排班',
                                type: 'warning',
                            })
                            return;
                        } else if (consultingRoomNum > 0) {
                            ElMessage({
                                message: '添加失败，该诊室已排班',
                                type: 'warning',
                            })
                            return;
                        } else {
                            this.$axios.get("/arrangement/getNumberSourceByDate", {   //通过日期和门诊类型得到号源id数组
                                params: {
                                    date: this.selectedDate,
                                    amOrPm: this.selectedAmOrPm,
                                    consultingRoomType: this.selectedConsultingRoomType,
                                    departmentId: this.departmentId
                                }
                            }).then(response => {
                                var id = []
                                id = response.data.data  //号源id数组
                                var numberSourceId = ''
                                for (var i = 0; i < id.length; i++) {  //号源id拼接，因为不会传数组
                                    numberSourceId += id[i] + ','
                                }
                                this.$axios.get("/arrangement/arrange", {
                                    params: {
                                        doctorId: this.selectedDoctor,
                                        consultingRoomId: this.selectedConsultingRoom,
                                        numberSourceDate: this.selectedDate,
                                        numberSourceId: numberSourceId,
                                        amOrPm: this.selectedAmOrPm,
                                        number: this.numberSourceNum,
                                        departmentId: this.departmentId,
                                        consultingRoomType: this.selectedConsultingRoomType
                                    }
                                }).then(response => {
                                    var message = response.data.data
                                    if (message == 1) {
                                        ElMessage({
                                            message: '添加成功',
                                            type: 'success',
                                        })
                                        this.$axios.get("/numberSourceDetail/addNumberSourceDetail", {  //添加号源明细
                                            params: {
                                                doctorId: this.selectedDoctor,
                                                numberSourceDate: this.selectedDate,
                                                amOrPm: this.selectedAmOrPm
                                            }
                                        }).then(response => {

                                        }).catch(error => { })
                                    } else if (message == -1) {
                                        ElMessage({
                                            message: '排班失败，调班日期不在范围内',
                                            type: 'warning',
                                        })
                                    } else if (message == -2) {
                                        ElMessage({
                                            message: '排班失败，该医生在该日期已经排班',
                                            type: 'warning',
                                        })
                                    } else if (message == -3) {
                                        ElMessage({
                                            message: '排班失败，该诊室已被占用',
                                            type: 'warning',
                                        })
                                    } else if (message == -4) {
                                        ElMessage({
                                            message: '排班失败，排班日期的号源不足',
                                            type: 'warning',
                                        })
                                    }

                                    this.$axios.get("/arrangement/findByDepartmentId/" + this.departmentId).then(response => {
                                        this.arrangementInfo = response.data.data
                                        this.arrangementKey++;    //和v-for绑定，用于更新
                                        this.addVisible = false
                                    }).catch(error => { console.log(error) })
                                }).catch(error => { console.log(error) });

                            }).catch(error => { console.log(error) })
                        }
                    }).catch(error => { })

                }).catch(error => { });
            }

        },
        quickArrange() {
            this.comfirmQuickArrangeVisible = false
            this.loading = true
            this.$axios.get("/arrangement/quickArrange/" + this.departmentId).then(response => {
                this.$axios.get("/arrangement/findByDepartmentId/" + this.departmentId).then(response => {
                    this.arrangementInfo = response.data.data
                    this.arrangementKey++;    //和v-for绑定，用于更新
                    this.addVisible = false
                    this.loading = false
                }).catch(error => { console.log(error) })
                ElMessage({
                    message: '排班成功',
                    type: 'success',
                })
            }).catch(error => { });
        },

        confirmLook() {
            if (this.updateDate === this.selectedArrangementInfo.numberSourceDate
                && this.updateAmOrPm === this.selectedArrangementInfo.amOrPm
                && this.updateConsultingRoom === this.selectedArrangementInfo.consultingRoomId) {
                this.detailVisible = false
            }
            else {
                this.comfirmUpdateVisible = true
            }
        },
        confirmUpdate() {
            var consultingRoomType;
            this.$axios.get("/doctor/findById/" + this.selectedArrangementInfo.doctorId).then(response => {
                let data = response.data.data

                if (data.doctorLevel == '主任医师') {
                    consultingRoomType = '专家门诊'
                }
                if (data.doctorLevel == '主治医师') {
                    consultingRoomType = '特需门诊'
                }
                if (data.doctorLevel == '医生') {
                    consultingRoomType = '普通门诊'
                }

                this.$axios.get("/arrangement/getNumberSourceByDate", {   //通过日期和门诊类型得到号源id数组
                    params: {
                        date: this.updateDate,
                        amOrPm: this.updateAmOrPm,
                        consultingRoomType: consultingRoomType,
                        departmentId: this.departmentId
                    }
                }).then(response => {
                    var id = []
                    id = response.data.data  //号源id数组
                    var NewNumberSourceId = ''
                    for (var i = 0; i < id.length; i++) {  //号源id拼接，因为不会传数组
                        NewNumberSourceId += id[i] + ','
                    }

                    this.$axios.get("/arrangement/updateArrangement", {
                        params: {
                            doctorId: this.selectedArrangementInfo.doctorId,
                            consultingRoomId: this.selectedArrangementInfo.consultingRoomId,
                            numberSourceDate: this.selectedArrangementInfo.numberSourceDate,
                            amOrPm: this.selectedArrangementInfo.amOrPm,
                            NewConsultingRoomId: this.updateConsultingRoom,
                            newNumberSourceId: NewNumberSourceId,
                            number: this.selectedArrangementInfo.number,
                            departmentId: this.departmentId,
                            newNumberSourceDate: this.updateDate,
                            newAmOrPm: this.updateAmOrPm,
                            consultingRoomType: consultingRoomType
                        }
                    }).then(response => {
                        var message = response.data.data
                        if (message == 1) {
                            ElMessage({
                                message: '调班成功',
                                type: 'success',
                            })
                            this.$axios.get("/numberSourceDetail/addNumberSourceDetail", {  //添加号源明细
                                params: {
                                    doctorId: this.selectedArrangementInfo.doctorId,
                                    numberSourceDate: this.updateDate,
                                    amOrPm: this.updateAmOrPm
                                }
                            }).then(response => {

                            }).catch(error => { })
                        } else if (message == -1) {
                            ElMessage({
                                message: '调班失败，调班日期不在范围内',
                                type: 'warning',
                            })
                        } else if (message == -2) {
                            ElMessage({
                                message: '调班失败，该医生在调班日期已经排班',
                                type: 'warning',
                            })
                        } else if (message == -3) {
                            ElMessage({
                                message: '调班失败，调班诊室已被占用',
                                type: 'warning',
                            })
                        } else if (message == -4) {
                            ElMessage({
                                message: '调班失败，调班的日期的号源不足',
                                type: 'warning',
                            })
                        }

                        this.$axios.get("/arrangement/findByDepartmentId/" + this.departmentId).then(response => {
                            this.arrangementInfo = response.data.data
                            this.arrangementKey++;    //和v-for绑定，用于更新
                            this.comfirmUpdateVisible = false
                            this.detailVisible = false
                        }).catch(error => { console.log(error) })


                    }).catch(error => { });
                }).catch(error => { })

            }).catch(error => { console.log(error) })


        },
        confirmDelete(info) {
            this.comfirmDeleteVisible = true;
            this.wantDelInfo = info
        },
        confirmDeleteAll() {
            this.$axios.get("/arrangement/deleteAll/" + this.departmentId).then(response => {


                this.$axios.get("/arrangement/findByDepartmentId/" + this.departmentId).then(response => {
                    this.arrangementInfo = response.data.data
                    this.arrangementKey++;    //和v-for绑定，用于更新
                    this.comfirmDeleteAllVisible = false
                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    })
                }).catch(error => { console.log(error) })


            }).catch(error => {

            })
        },
        cancel() {
            this.addVisible = false
        },
        cancelLook() {
            this.detailVisible = false
        },
    },

}
</script>

<style scoped>
.row {
    justify-content: space-between;
}

.col-9 {
    margin-top: 55px;
    background-color: v-bind(grey);
    border-radius: 12px;
}

.frame {
    margin-left: 1%;
    margin-top: 2%;
}

.scrollbar-flex-content {
    display: flex;
}

.arrangementtable {
    /* float: left; */
    /* display: flex; */
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
    width: 96%;
    height: 50px;
    margin-bottom: 3px;
    cursor: pointer;
    font-size: medium;
    color: v-bind(green);
    background-color: rgb(255, 255, 255);
}

.roomName {
    margin-top: 30px;
    color: v-bind(green);
}

.tag-top {
    margin-bottom: 5px;
}
</style>
