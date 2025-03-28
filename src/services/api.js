import axios from 'axios';
import config from "../config";


const API_BASE_URL = config.API_BASE_URL;

// Get token from local storage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch candidates
export const getCandidates = async () => {
    return await axios.get(`${API_BASE_URL}/candidates`, { headers: getAuthHeader() });
};

// Fetch opportunity
export const getopportunity = async () => {
    return await axios.get(`${API_BASE_URL}/opportunity`, { headers: getAuthHeader() });
};

// Fetch payments
export const getPayments = async () => {
    return await axios.get(`${API_BASE_URL}/payments`, { headers: getAuthHeader() });
};

// User login
export const loginUser = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token); // Store token
    return res.data;
};

export const searchCandidates = async (searchQuery) => {
    return await axios.get(`${API_BASE_URL}/candidates/search?query=${searchQuery}`, { headers: getAuthHeader() });
};
