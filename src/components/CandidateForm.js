import React, { useState } from "react";
import { TextField, Button, Container, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";
import ResumeUpload from "./ResumeUpload";

const CandidateForm = () => {
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: "",
    experience: "",
    expected_salary: "",
  });

  const [resumeLink, setResumeLink] = useState(""); // Stores uploaded resume URL
  const [loading, setLoading] = useState(false); // Loading state for submission
  const [error, setError] = useState(""); // Error message handling

  // Handle Input Changes
  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://ec2-13-48-43-6.eu-north-1.compute.amazonaws.com:5001/api/candidates", {
        ...candidate,
        skills: candidate.skills.split(",").map((skill) => skill.trim()), // Convert skills to array
        resume_link: resumeLink,
      });

      alert("✅ Candidate added successfully!");
      setCandidate({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        skills: "",
        experience: "",
        expected_salary: "",
      });
      setResumeLink("");
    } catch (err) {
      setError("❌ Failed to add candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Candidate
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        {/* Resume Upload Component */}
        <ResumeUpload onUpload={setResumeLink} />

        {/* Display Resume Link if Uploaded */}
        {resumeLink && (
          <Typography variant="body2" color="primary">
            ✅ Resume Uploaded: <a href={resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a>
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={candidate.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                value={candidate.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone Number"
                value={candidate.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="linkedin"
                label="LinkedIn Profile"
                value={candidate.linkedin}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="skills"
                label="Skills (comma-separated)"
                value={candidate.skills}
                onChange={handleChange}
                fullWidth
                required
                helperText="Example: Salesforce, Apex, LWC"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="experience"
                label="Experience (Years)"
                value={candidate.experience}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="expected_salary"
                label="Expected Salary ($)"
                value={candidate.expected_salary}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? "Adding Candidate..." : "Add Candidate"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CandidateForm;
