import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://chatbox-production-08a4.up.railway.app', // URL base de tu backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;