import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

const store = new Vuex.Store({
    //存储用户登录信息的一个状态
    state:{
        userId: null,   // 用户Id
        userName: null,  // 用户名称
        userPhoneNumber: null,  // 用户电话号码
        userEmail: null, // 用户邮箱
        userType: null, // 用户类型
        isLogin: false,  // 登录状态
        token: '',    // 用户登录成功后持有的token
    },
    //关联着其他三个目录，目的松耦合
    getters,
    mutations,
    actions
})
export default store;
