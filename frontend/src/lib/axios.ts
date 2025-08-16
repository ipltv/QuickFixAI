// frontend/src/lib/axios.ts
// This file sets up Axios for making HTTP requests in the frontend application.
// It configures the base URL and enables credentials for cross-origin requests.
import axios from "axios";
import { API_URL } from "../config/env";


// Create an Axios instance with the base URL from the environment variables.
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


export default api;
