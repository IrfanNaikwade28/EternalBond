import axios from "axios";

export const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000";
export const USER_API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL || "http://localhost:5001";
export const ASSETS_BASE_URL = (import.meta.env.VITE_ASSETS_BASE_URL || `${ADMIN_API_BASE_URL}/uploads`).replace(/\/$/, "");

export const adminApi = axios.create({ baseURL: ADMIN_API_BASE_URL });
export const userApi = axios.create({ baseURL: USER_API_BASE_URL });

export const withBase = (url) => {
  if (!url) return url;
  if (url.startsWith("http://localhost:5000") || url.startsWith("https://localhost:5000")) {
    return url.replace(/https?:\/\/localhost:5000/, ADMIN_API_BASE_URL);
  }
  if (url.startsWith("http://localhost:5001") || url.startsWith("https://localhost:5001")) {
    return url.replace(/https?:\/\/localhost:5001/, USER_API_BASE_URL);
  }
  return url;
};

export const asset = (path) => {
  if (!path) return path;
  // If already an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // If caller passes a full uploads path, strip the prefix
  const normalized = path.replace(/^\/+/, "");
  return `${ASSETS_BASE_URL}/${normalized}`;
};
