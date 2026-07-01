import axios from "axios";
import { store } from "../app/store.js";
import { clearUser } from "../features/auth/authSlice.js";

const api = axios.create({
     baseURL: import.meta.env.VITE_BACK_END_URL,
     withCredentials: true,
});

const refrshEndPointApi = axios.create({
     baseURL: import.meta.env.VITE_BACK_END_URL,
     withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (err) => {
     failedQueue.forEach((prom) => {
          if (err) {
               prom.reject(err);
          } else {
               prom.resolve();
          }
     });
     failedQueue = [];
};

api.interceptors.response.use(
     (response) => response,
     async (err) => {
          const originalRequest = err.config;

          if (err.response?.status === 401 && !originalRequest._retry) {
               if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                         failedQueue.push({ resolve, reject });
                    })
                         .then(() => {
                              return api(originalRequest);
                         })
                         .catch((err) => Promise.reject(err));
               }

               originalRequest._retry = true;
               isRefreshing = true;

               try {
                    await refrshEndPointApi.post("/auth/refresh-token");
                    processQueue(null);
                    return api(originalRequest);
               } catch (error) {
                    processQueue(error);
                    store.dispatch(clearUser());
                    return Promise.reject(error);
               } finally {
                    isRefreshing = false;
               }
          }

          return Promise.reject(err);
     },
);

export default api;
