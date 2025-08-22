// frontend/src/api/setupInterceptors.ts
// This file sets up Axios interceptors for handling authentication tokens.
import type { Store } from "@reduxjs/toolkit";
import { setAccessToken, logout } from "../features/auth/authSlice";
import api from "../lib/axios";

/**
 * This function sets up the Axios interceptors. It's called outside the
 * initial module loading cycle to prevent circular dependencies.
 * @param store The Redux store instance.
 */
const setupAxiosInterceptors = (store: Store) => {
  /**
   * Request Interceptor: This function runs before every single request is sent.
   * Its job is to grab the latest accessToken from Redux state and add it to
   * the Authorization header.
   */
  api.interceptors.request.use(
    (config) => {
      console.log("Setting up request interceptor");
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response Interceptor: This function runs when a response is received.
   * It specifically looks for a '401 Unauthorized' error, which indicates an
   * expired accessToken.
   */
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log("Handling response error:", error);
      console.log("Refreshing access token");

      const originalRequest = error.config;

      // Check if the error is 401 and we haven't already retried this request
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "/auth/refresh"
      ) {
        originalRequest._retry = true; // Mark the request to prevent infinite loops

        try {
          // Attempt to get a new access token from the /refresh endpoint
          const { data } = await api.post("/auth/refresh");
          const newAccessToken = data.accessToken;

          // Update the token in the Redux store
          store.dispatch(setAccessToken(newAccessToken));

          // Update the header on the original request and retry it
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refreshing the token fails, log the user out
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
