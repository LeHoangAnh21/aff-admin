import axios from "axios";
import queryString from 'query-string'

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
    paramsSerializer: params => queryString.stringify(params),
});

API.interceptors.request.use(async (config) => {
    return config;
});

API.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    },
);

export default API;
