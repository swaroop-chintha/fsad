import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only force logout if it's not the actual login endpoint failing
            if (error.config.url !== '/api/auth/login') {
                console.error("Authentication expired or invalid. Logging out.");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("name");
                window.location.href = '/login'; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);

export default api;
