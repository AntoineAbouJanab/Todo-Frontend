import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-backend-1-eu3v.onrender.com/", 
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
