import axios from "axios";
import { API_BASE_URL } from "./apiPaths.js";



const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout:10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

// request interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        // Add any custom headers or logic here
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
           //handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access  redirect to login
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Internal server error");
            }
        } else if (error.code === "ECONNABORTED") {
            // Handle network errors
            console.error("Network error");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
