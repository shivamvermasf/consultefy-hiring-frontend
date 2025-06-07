// src/components/Createopportunity.js
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [opportunity, setopportunity] = useState({
    title: "",
    company: "",
    location: "",
    required_skills: "",
    rate_per_hour: "",
    status: "Open"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setopportunity({ ...opportunity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }
    try {
      // Convert required_skills to array if needed
      const skills = opportunity.required_skills.split(",").map((s) => s.trim());
      const payload = { ...opportunity, required_skills: skills };
      await axios.post(`${config.API_BASE_URL}/opportunity`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/opportunities");
    } catch (err) {
      setError("Error creating opportunity.");
      console.error(err);
    }
  };

  return (
    <Box sx={{ mx: 3, my: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Create Opportunity</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={opportunity.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Company"
            name="company"
            value={opportunity.company}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Location"
            name="location"
            value={opportunity.location}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Required Skills (comma-separated)"
            name="required_skills"
            value={opportunity.required_skills}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Rate per Hour"
            name="rate_per_hour"
            value={opportunity.rate_per_hour}
            onChange={handleChange}
            fullWidth
            required
            type="number"
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={opportunity.status}
              onChange={handleChange}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Candidate Mapping">Candidate Mapping</MenuItem>
              <MenuItem value="Profile Shared">Profile Shared</MenuItem>
              <MenuItem value="Interviewing">Interviewing</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Candidate Selected">Candidate Selected</MenuItem>
              <MenuItem value="Closed Lost">Closed Lost</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained">Create opportunity</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateOpportunity;
