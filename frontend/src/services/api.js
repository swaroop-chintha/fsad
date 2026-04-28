import axios from 'axios';

// In development, leave baseURL empty so Vite's proxy handles /api/* requests.
// In production, VITE_API_BASE_URL must be set to the backend URL.
const api = axios.create({
    baseURL: import.meta.env.PROD ? (import.meta.env.VITE_API_BASE_URL || '') : '',
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
            if (error.config?.url !== '/api/auth/login') {
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
