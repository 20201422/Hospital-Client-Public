import axios from "axios"
import { ElMessage } from 'element-plus'
import router from '@/router' // 导入路由实例

axios.defaults.baseURL = "http://localhost:9090"

const request = axios.create({
    timeout: 999999,
    headers: {

    }
})

request.interceptors.request.use(
    config => {
        config.headers["token"] = localStorage.getItem("token");
        return config;
    },
    error => {
        // 请求发生错误时的处理逻辑
        console.error("请求发生错误:", error);
        // 可以使用 Element Plus 的 Message 组件显示错误提示
        ElMessage.error("请求发生错误，请稍后重试");
        // 返回一个 Promise.reject()，将错误继续传递下去
        return Promise.reject(error);
    }
)

request.interceptors.response.use(
    response => {
        let data = response.data // 获取响应数据
        // console.log(response)
        if (data.code === 200) {
            return response
        } else {
            if (data.code === 301 || data.code === 401) { // 重定向或权限不足
                ElMessage.error(data.message)
                this.$router.replace('/Login') // 跳转到登录界面
                return Promise.reject(data.message)
            }

            ElMessage.error(!data.message ? "系统异常，请联系管理员" : data.message)

            return Promise.reject(data.message)
        }
    },
    error => {
        // console.log(error)
        // return Promise.reject(error)
        if (error.response) {
            // 服务器返回了错误响应，可以根据错误状态码进行处理
            const status = error.response.status

            if (status === 500) {
                // 服务器内部错误
                ElMessage.error('服务器发生内部错误，请稍后重试')
            } else if (status === 404) {
                // 请求的资源不存在
                ElMessage.error('请求的资源不存在')
            } else if (status === 400) {
                ElMessage.error("请求出错")
            } else {
                // 其他错误状态码的处理逻辑
                // ...
                ElMessage.error('未知错误')
            }
        } else if (error.request) {
            // 无法连接到服务器的处理逻辑
            ElMessage.error('无法连接到服务器，请检查网络连接')
        } else {
            // 发生了其他类型的错误
            ElMessage.error('发生了错误，请稍后重试')
        }

        return Promise.reject(error)
    }
)

export default request
