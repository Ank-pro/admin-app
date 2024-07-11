import axios from "axios";
import Cookies from "universal-cookie";


const TOKEN = "TOKEN";
export const cookies = new Cookies()
export const api = axios.create({
    baseURL: "https://e-commerce-be-sigma.vercel.app",
});

api.interceptors.request.use(
    async (config) => {
        
     

        const token = cookies.get(TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);