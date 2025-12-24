// src/utils/axiosInstance.js
import axios from "axios";
import config from "../config/apiconfig"; // Adjust path if needed

const api = axios.create({
  baseURL: config.BASE_URL,
});

// Request Interceptor: Automatically add Authorization header
api.interceptors.request.use((config) => {
  const eBillingData = localStorage.getItem("eBilling");
  if (eBillingData) {
    const { accessToken } = JSON.parse(eBillingData);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Response Interceptor: Handle 401 by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once to avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const eBillingData = localStorage.getItem("eBilling");
        if (!eBillingData) throw new Error("No auth data");

        const { refreshToken } = JSON.parse(eBillingData);
        if (!refreshToken) throw new Error("No refresh token");

        // Call your custom refresh endpoint
        const refreshResponse = await axios.post(
          `${config.BASE_URL}/get/access-token/by/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        if (!newAccessToken) throw new Error("No new access token received");

        // Update localStorage
        const updatedEBilling = {
          ...JSON.parse(eBillingData),
          accessToken: newAccessToken,
        };
        localStorage.setItem("eBilling", JSON.stringify(updatedEBilling));

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Force logout on refresh failure
        localStorage.removeItem("eBilling");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;