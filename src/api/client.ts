import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
});

console.log("ENV:", import.meta.env);

export default api;