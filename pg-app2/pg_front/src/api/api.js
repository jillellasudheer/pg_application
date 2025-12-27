
// // src/services/adminApi.js
// import axios from "axios";

// const API_URL = "http://localhost:8081/admin"; // adjust port if different

// // Axios instance (optional, for reuse)
// const api = axios.create({
//   baseURL: API_URL,
// });

// // Register admin
// export const registerAdmin = async (adminName, password) => {
//   const response = await api.post("/register", { adminName, password });
//   return response.data;
// };

// // Login admin & get token
// export const loginAdmin = async (adminName, password) => {
//   const response = await api.post("/login", { adminName, password });

//   // Save token in localStorage
//   if (response.data.token) {
//     localStorage.setItem("token", response.data.token);
//   }

//   return response.data;
// };

// // Get logged-in admin details
// export const getAdminDetails = async () => {
//   const token = localStorage.getItem("token");
//   const response = await api.get("/me", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// // Logout admin
// export const logoutAdmin = () => {
//   localStorage.removeItem("token");
// };

// export default api;








// import axios from "axios";

// export const ADMIN_API = "http://localhost:8081/api/admin";
// export const PAYMENT_API = "http://localhost:8083/api/payments";
// export const USER_API = "http://localhost:8082/api/users";

// export const adminAxios = axios.create({
//   baseURL: ADMIN_API,
// });

// adminAxios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });





import axios from "axios";

export const ADMIN_API = "http://localhost:8081/api/admin";
export const USER_API = "http://localhost:8082/api/users";
export const PAYMENT_API = "http://localhost:8083/api/payments";

/* ---------- ADMIN AXIOS ---------- */
export const adminAxios = axios.create({
  baseURL: ADMIN_API,
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- PAYMENT AXIOS ---------- */
export const paymentAxios = axios.create({
  baseURL: PAYMENT_API,
});
