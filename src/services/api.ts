import axios from "axios";

export const BASE_URL = "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config.url?.includes("/auth/")
    ) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
