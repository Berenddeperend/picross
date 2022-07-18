import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const http = axios.create({
  baseURL: isProd
    ? process.env.VUE_API_URL
    : "http://localhost:7200",
});

export default http;
