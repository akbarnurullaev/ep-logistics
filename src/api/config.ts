import axios from "axios";

const baseURL = "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL,
});

// api.interceptors.request.use(
//   function(config) {
//     const token = JSON.parse(localStorage.getItem("token") || "");
//     if (token) {
//       config.headers["Authorization"] = "Token " + token;
//     }
//     return config;
//   },
//   function(error) {
//     if (error.response.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
