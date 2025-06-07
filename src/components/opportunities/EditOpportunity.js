// src/components/EditOpportunity.js
import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import Quill styles
import "../../styles/QuillEditor.css"; // Custom styles

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [error, setError] = useState("");

  const fetchOpportunity = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }
    try {
      const response = await axios.get(`${config.API_BASE_URL}/opportunity/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const skills = typeof response.data.required_skills === "string"
        ? JSON.parse(response.data.required_skills).join(", ")
        : response.data.required_skills.join(", ");

      setOpportunity({ ...response.data, required_skills: skills });
    } catch (err) {
      setError("Error fetching opportunity details.");
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const handleChange = (e) => {
    setOpportunity({ ...opportunity, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setOpportunity({ ...opportunity, job_description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }
    try {
      const skillsArray = opportunity.required_skills.split(",").map((s) => s.trim());
      const payload = { ...opportunity, required_skills: skillsArray };
      await axios.put(`${config.API_BASE_URL}/opportunity/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/opportunities");
    } catch (err) {
      setError("Error updating opportunity.");
      console.error(err);
    }
  };

  if (!opportunity) {
    return (
      <Box sx={{ mx: 3, my: 2 }}>
        <Typography>Loading opportunity details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 3, my: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Edit Opportunity</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Title" name="title" value={opportunity.title} onChange={handleChange} fullWidth required />
          <TextField label="Company" name="company" value={opportunity.company} onChange={handleChange} fullWidth required />
          <TextField label="Location" name="location" value={opportunity.location} onChange={handleChange} fullWidth required />
          <TextField label="Required Skills (comma-separated)" name="required_skills" value={opportunity.required_skills} onChange={handleChange} fullWidth required />
          <TextField label="Rate per Hour" name="rate_per_hour" value={opportunity.rate_per_hour} onChange={handleChange} fullWidth required type="number" />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label="Status" name="status" value={opportunity.status} onChange={handleChange}>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Candidate Mapping">Candidate Mapping</MenuItem>
              <MenuItem value="Profile Shared">Profile Shared</MenuItem>
              <MenuItem value="Interviewing">Interviewing</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Candidate Selected">Candidate Selected</MenuItem>
              <MenuItem value="Closed Lost">Closed Lost</MenuItem>
            </Select>
          </FormControl>

          {/* Rich Text Editor for Description */}
          <Typography>Job Description</Typography>
          <div className="quill-editor-container">
            <ReactQuill
              value={opportunity.job_description || ""}
              onChange={handleDescriptionChange}
              style={{ minHeight: "200px" }} // Set minimum height
            />
          </div>

          <Button type="submit" variant="contained">Update Opportunity</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditOpportunity;
