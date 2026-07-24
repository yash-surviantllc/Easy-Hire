import axios from 'axios';
import { USER_API_END_POINT } from './constant';
import store from '../redux/store';
import { setUser } from '../redux/authSlice';

// Set global default to send cookies (session/tokens) with every request
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for 401 status and ensure we aren't already retrying this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // If the refresh request itself returns a 401, reject immediately to avoid infinite loops
            if (originalRequest.url === `${USER_API_END_POINT}/refresh`) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue requests while token is refreshing
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return axios(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Request a new access token
                await axios.post(`${USER_API_END_POINT}/refresh`);
                
                isRefreshing = false;
                processQueue(null);
                
                // Retry the original request with the new access token cookie
                return axios(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);
                
                // Refresh failed (token expired/invalid), clear local Redux state
                store.dispatch(setUser(null));
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
