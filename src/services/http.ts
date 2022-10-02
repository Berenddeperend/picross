import axios from "axios";

const isProd = import.meta.env.PROD;

console.log('isProd:', isProd);

//deze conditional is prima, laten staan.
console.log(location)
const http = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_API_URL
    : "http://localhost:7200",
});

export default http;
