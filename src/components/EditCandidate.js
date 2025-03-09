import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import axios from "axios";
import config from "../config";

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize candidate state as an object for controlled inputs
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: "",
    experience: "",
    expected_salary: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.API_BASE_URL}/candidates/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Candidate's skills are stored as JSON string; parse and convert to comma-separated string
        let skills = response.data.skills;
        try {
          skills = JSON.parse(response.data.skills);
          if (Array.isArray(skills)) {
            skills = skills.join(", ");
          }
        } catch (e) {
          // Leave as is if parsing fails
        }
        setCandidate({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          linkedin: response.data.linkedin || "",
          skills: skills || "",
          experience: response.data.experience || "",
          expected_salary: response.data.expected_salary || ""
        });
        setLoading(false);
      } catch (err) {
        setError("Error loading candidate data.");
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  // Handle form submission to update candidate
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Convert skills from comma-separated string to an array
      const skillsArray = candidate.skills.split(",").map(skill => skill.trim());
      const payload = {
        ...candidate,
        skills: skillsArray,
      };
      await axios.put(`${config.API_BASE_URL}/candidates/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // On success, navigate back to candidate details page
      navigate(`/candidates/${id}`);
    } catch (err) {
      console.error("Error updating candidate:", err.response?.data || err.message);
      setError("Error updating candidate details. Please try again.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!candidate) return <Typography>No candidate data found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Edit Candidate</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={candidate.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={candidate.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={candidate.phone}
            onChange={handleChange}
          />
          <TextField
            label="LinkedIn"
            name="linkedin"
            fullWidth
            margin="normal"
            value={candidate.linkedin}
            onChange={handleChange}
          />
          <TextField
            label="Skills"
            name="skills"
            fullWidth
            margin="normal"
            value={candidate.skills}
            onChange={handleChange}
            helperText="Comma separated values"
          />
          <TextField
            label="Experience"
            name="experience"
            fullWidth
            margin="normal"
            value={candidate.experience}
            onChange={handleChange}
          />
          <TextField
            label="Expected Salary"
            name="expected_salary"
            fullWidth
            margin="normal"
            value={candidate.expected_salary}
            onChange={handleChange}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
            Save Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCandidate;
