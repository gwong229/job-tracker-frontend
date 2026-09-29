import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends the httpOnly jwt cookie automatically on every request
});

// Reads a cookie's value by name from document.cookie.
// The XSRF-TOKEN cookie is deliberately NOT httpOnly, so JS can read it here.
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// Before every request, attach the CSRF header if we have a token cookie.
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCookie("XSRF-TOKEN");
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }
  return config;
});

export default apiClient;
