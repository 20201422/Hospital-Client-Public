//更改用户状态信息
export const user = (state, user) => {
    //判断用户是否存在
    if (user != null){
        state.userId = JSON.parse(user).userId;
        state.userName = JSON.parse(user).userName;
        state.userPhoneNumber = JSON.parse(user).userPhoneNumber;
        state.userEmail = JSON.parse(user).userEmail;
        state.userType = JSON.parse(user).userType;
        state.isLogin = true;
    }else if (user == null){
        //登出时清空sessionStorage里面的参数
        sessionStorage.setItem("user", null);
        sessionStorage.setItem("userToken", '');
        state.currentUser = null;
        state.isLogin = false;
        state.assign='';
    }
}

//更改token
export const setToken = (state,token) => {
    if (token!=null){
        state.token = token;
    }else {
        state.token = '';
    }
}
