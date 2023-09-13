//调用mutations
export const setUser = ({commit},user) => {
    commit("user", user);
}
export const setToken = ({commit},token) =>{
    commit("setToken", token);
}
