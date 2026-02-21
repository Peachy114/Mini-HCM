import axios from "axios";
import { auth } from "@/config/firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//Firebase token to every request automatically
api.interceptors.request.use(async(config) => {
  const currentUser = auth.currentUser;
  if(currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

