import axios from "axios";
import { apiUrl } from "../constants/global.ts";

const client = axios.create({
    baseURL: apiUrl + "/api",
    withCredentials: true,
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 || error.response.status === 403) {
            window.dispatchEvent(new Event("session-expired"));
        }
        return Promise.reject(error)
    }
);


export default client;