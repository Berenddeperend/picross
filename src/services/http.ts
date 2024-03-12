import axios from "axios";

const headers = localStorage.getItem("nono-admin-password")
  ? { "nono-admin-password": localStorage.getItem("nono-admin-password") }
  : {};

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers,
});

export default http;
