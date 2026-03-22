// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Get all internships
// export const getInternships = async (page = 1) => {
//   const response = await axios.get(
//     `${API_BASE_URL}/internships?page=${page}`
//   );
//   return response.data;
// };

// // Get single internship
// export const getInternshipById = async (id) => {
//   const response = await axios.get(
//     `${API_BASE_URL}/internships/${id}`
//   );
//   return response.data;
// };



import api from "../utils/api"; // FIX 1: use api instance, not plain axios
                                 // api instance has Authorization header auto-set

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================================
   GET ALL INTERNSHIPS
   Supports guest/public API
================================ */
export const getInternships = async (isGuest, page = 1) => {
  const endpoint = isGuest
    ? "/public/internships"   // guest: no token needed
    : "/internships";         // logged-in: api instance sends token automatically

  const response = await api.get(`${endpoint}?page=${page}`);
  // FIX 2: no need to prepend API_BASE_URL — api instance already has baseURL set
  // response.data = Sakshi's full body: { data: [], currentPage, totalPages, totalItems }

  return response.data;
};

/* ================================
   GET SINGLE INTERNSHIP
   Supports guest/public API
================================ */
export const getInternshipById = async (id, isGuest) => {
  const endpoint = isGuest
    ? `/public/internships/${id}`
    : `/internships/${id}`;

  const response = await api.get(endpoint);

  return response.data;
};