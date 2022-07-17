import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const http = axios.create({
  baseURL: isProd
    ? "https://berendswennenhuis.nl/nonogram/api"
    : "http://localhost:7200",
});

export default http;
