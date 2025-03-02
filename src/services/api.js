import axios from 'axios';

const API_URL = "http://ec2-13-48-43-6.eu-north-1.compute.amazonaws.com:5001/api";

// Get token from local storage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch candidates
export const getCandidates = async () => {
    return await axios.get(`${API_URL}/candidates`, { headers: getAuthHeader() });
};

// Fetch jobs
export const getJobs = async () => {
    return await axios.get(`${API_URL}/jobs`, { headers: getAuthHeader() });
};

// Fetch payments
export const getPayments = async () => {
    return await axios.get(`${API_URL}/payments`, { headers: getAuthHeader() });
};

// User login
export const loginUser = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token); // Store token
    return res.data;
};

export const searchCandidates = async (searchQuery) => {
    return await axios.get(`${API_URL}/candidates/search?query=${searchQuery}`, { headers: getAuthHeader() });
};
