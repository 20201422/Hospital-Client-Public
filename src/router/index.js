import { createRouter, createWebHistory } from 'vue-router'

import Login from "@/views/LoginView.vue"
import Register from "@/views/RegisterView.vue";
import Main from "@/views/MainView.vue"
import User from "@/views/UserView.vue";
import Department from "@/views/DepartmentView.vue"
import Registration from "@/views/RegistrationView.vue";
import MyRegistration from "@/views/MyRegistrationView.vue"
import MedicalRecords from "@/views/MedicalRecordsView.vue"
import departmentHeaderMain from "@/components/departmentHeader/departmentHeaderMain.vue"
import doctorMain from "@/components/doctor/doctorMain.vue"
import personalInformation from "@/components/doctor/personalInformation.vue"
import patientQueue from "@/components/doctor/patientQueue.vue"
import myArrangement from "@/components/doctor/myArrangement.vue"
import introduction from "@/components/departmentHeader/introduction.vue"
import arrangement from "@/components/departmentHeader/arrangement.vue"
import changeShiftApply from "@/components/doctor/changeshiftApply.vue"
import changeShiftManage from "@/components/departmentHeader/changeshiftManage.vue"
import managerMain from "@/components/manger/ManagerMain.vue"
import showBusiness from "@/components/manger/showBusiness.vue";
import departmentReservationData from "@/components/manger/DepartmentReservationData.vue"
import doctorReservationData from "@/components/manger/DoctorReservationData.vue"
import showNumberSource from "@/components/manger/showNumberSource.vue"
import showBlockList from "@/components/manger/showBlockList.vue"
const routes = [
    {
        path: '/',
        redirect: '/Main'
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/Register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/Main',
        name: 'Main',
        component: Main,
    },
    {
        path: '/User',
        name: 'User',
        component: User,
    },
    {
        path: '/Patient/Department',
        name: 'Department',
        component: Department,
    },
    {
      path: '/Patient/Registration/:departmentId',
        name: 'Registration',
        component: Registration,
    },
    {
        path: '/Patient/MyRegistration',
        name: 'MyRegistration',
        component: MyRegistration,
    },
    {
        path: '/Patient/MedicalRecords',
        name: 'MedicalRecords',
        component: MedicalRecords,
    },
    {
        path:'/departmentHeaderMain',
        name: 'departmentHeaderMain',
        component:departmentHeaderMain,
        children:[
            { path: '/departmentHeaderMain',redirect:'/departmentHeaderMain/introduction'},
            { path: 'introduction',component:introduction},
            { path: 'arrangement', component:arrangement},
            { path: 'changeShiftManage',component:changeShiftManage}
        ]
    },
    {
        path:'/doctorMain',
        name: 'doctorMain',
        component:doctorMain,
        children: [
            { path: '/doctorMain', redirect:'/doctorMain/personalInformation'},
            { path: 'personalInformation' ,component:personalInformation},
            { path: 'patientQueue', component: patientQueue},
            { path: 'myArrangement' , component:myArrangement},
            { path: 'changeShiftApply', component:changeShiftApply},
        ]
    },
    {
        path:'/mangerMain',
        name: 'mangerMain',
        component:managerMain,
        children:[
            { path: 'showBusiness',component:showBusiness},
            { path: 'departmentReservationData',component:departmentReservationData},
            { path: 'doctorReservationData',component:doctorReservationData},
            { path: 'showNumberSource',component:showNumberSource},
            { path: 'showBlockList',component:showBlockList},
        ]
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
