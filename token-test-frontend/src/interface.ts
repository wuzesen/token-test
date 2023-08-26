import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 3000
})

axiosInstance.interceptors.request.use(function(config) {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        config.headers.authorization = 'a ' + accessToken
    }
    return config
})
interface PendingTask {
    config: AxiosRequestConfig;
    resolve: Function;
}
let refreshing = false
const queue: PendingTask[] = []
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    let {data, config} = error.response;

    if (refreshing) {
        return new Promise((resolve) => {
            queue.push({
                config, resolve
            })
        })
    }

    if (data.statusCode === 401 && !config.url.includes('/refresh')) {
        refreshing = true
        const res = await refreshToken()

        if (res.status === 200) {
            queue.forEach(({config, resolve}) => {
                resolve(axiosInstance(config))
            })
            return axiosInstance(config)
        } else {
            alert(data || '登录过去,请重新登录')
        }
    } else {
        return error.response
    }
})
export interface User {
    username: string;
    email?: string;
}
interface IUserInfo {
    accessToken: string;
    refreshToken: string;
    userInfo: User;
}
export async function userLogin(username: string, password: string):Promise<AxiosResponse<IUserInfo>> {
    return await axiosInstance.post<IUserInfo>('/login', {
        username, password
    })
}

async function refreshToken() {
    const res = await axiosInstance.get('/refresh', {
        params: {
            token: localStorage.getItem('refresh_token')
        }
    })
    localStorage.setItem('access_token', res.data.accessToken)
    localStorage.setItem('refresh_token', res.data.accessToken)
    return res
}

export async function aaa() {
    const res = await [
        axiosInstance.get('/aaa'),
        axiosInstance.get('/aaa'),
        axiosInstance.get('/aaa')
    ]
    return res
}