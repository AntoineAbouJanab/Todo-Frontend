import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.2:3080", 
});

API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;
