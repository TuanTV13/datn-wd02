import axios from "axios";
import API_URL from "./api_url"



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
