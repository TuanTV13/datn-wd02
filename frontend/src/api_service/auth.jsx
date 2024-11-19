import axios from "axios";

// Base URL for your API
const API_URL = "http://127.0.0.1:8000/api/v1"; // Replace with your actual API URL

// Function to handle user login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Handle the response as needed
  } catch (error) {
    throw error.response.data; // Handle errors appropriately
  }
};

// Function to handle user registration
export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data; // Handle the response as needed
  } catch (error) {
    throw error.response.data; // Handle errors appropriately
  }
};
