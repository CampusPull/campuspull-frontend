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
  // Backend: GET /internships is a public route — no auth needed for listing
  const response = await api.get(`/internships?page=${page}`);
  return response.data;
};

/* ================================
   GET SINGLE INTERNSHIP
   Supports guest/public API
================================ */
export const getInternshipById = async (id, isGuest) => {
  // Backend: GET /internships/:id is a public route — no auth needed
  const response = await api.get(`/internships/${id}`);
  return response.data;
};