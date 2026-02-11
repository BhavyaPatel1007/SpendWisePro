import axios from 'axios';

const API = axios.create({
    baseURL: 'https://spendwisepro.onrender.com/api'
});

// Add tokens to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    console.log(`[API Request] ${req.method?.toUpperCase()} ${req.url} | Token: ${token ? 'Present' : 'MISSING'}`);
    if (token) {
        // Use both standard and backup header names for maximum compatibility
        req.headers['Authorization'] = `Bearer ${token}`;
        req.headers['x-auth-token'] = token;
    }
    return req;
});

// Response interceptor to handle 401 errors (Invalid/Expired Token)
API.interceptors.response.use(
    (response) => {
        console.log(`[API Success] ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error(`[API 401 Unauthorized] ${error.config.url}`, error.response.data);

            // Avoid redirecting if we're already on login/signup pages
            const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/signup');

            if (!isAuthPage) {
                console.log('Unauthorized access detected. Not redirecting automatically for debug...');
                // localStorage.removeItem('token');
                // localStorage.removeItem('user');
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);

export const fetchExpenses = () => API.get('/expenses');
export const addExpense = (data) => API.post('/expenses', data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const fetchStats = () => API.get('/expenses/stats');
export const updateSettings = (data) => API.put('/expenses/settings', data);
export const updateProfile = (data) => API.put('/auth/profile', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

export default API;
