import axios from "axios";

const isDev = import.meta.env.DEV;
const configuredBaseURL = import.meta.env.VITE_BASE_URL?.trim();
const baseURL = isDev ? "/api" : configuredBaseURL;

if (!baseURL) {
  throw new Error("VITE_BASE_URL is required for production builds.");
}

const api = axios.create({
  baseURL,
});

export default api;
