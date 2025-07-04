import axios from "axios";
import Cookies from "js-cookie";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: `${API_BASE_URL}`
})

// request interceptor
api.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if ( token ) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default api;