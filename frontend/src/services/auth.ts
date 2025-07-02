import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    const { access_token } = response.data;

    // Store token in cookie
    Cookies.set("token", access_token, { expires: 7 }); // 7 days

    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  async getProfile() {
    const response = await api.post("/auth/me");
    return response.data;
  },

  logout() {
    Cookies.remove("token");
  },

  isAuthenticated() {
    return !!Cookies.get("token");
  },
};
