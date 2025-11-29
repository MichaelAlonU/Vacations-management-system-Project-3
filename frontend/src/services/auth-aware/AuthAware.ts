import type { AxiosInstance } from "axios";
import axios from "axios";

export default abstract class AuthAware {
    axiosInstance: AxiosInstance;

    constructor(jwt: string, /*clientId: string*/) {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_REST_SERVER_URL,
        });

        this.axiosInstance.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${jwt}`;
            return config;
        });
    }
}