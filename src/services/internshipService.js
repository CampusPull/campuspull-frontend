import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all internships
export const getInternships = async (page = 1) => {
  const response = await axios.get(
    `${API_BASE_URL}/internships?page=${page}`
  );
  return response.data;
};

// Get single internship
export const getInternshipById = async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/internships/${id}`
  );
  return response.data;
};