// src/components/CandidateDetails.js
import React from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CandidateDetails = ({ candidate }) => {
  const navigate = useNavigate();

  if (!candidate) {
    return <Typography>No candidate data available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Candidate Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1"><strong>Full Name:</strong> {candidate.name}</Typography>
          <Typography variant="subtitle1"><strong>Email:</strong> {candidate.email}</Typography>
          <Typography variant="subtitle1"><strong>Phone:</strong> {candidate.phone}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">
            <strong>LinkedIn:</strong>{" "}
            {candidate.linkedin ? (
              <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
                {candidate.linkedin}
              </a>
            ) : "Not Provided"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Skills:</strong>{" "}
            {Array.isArray(candidate.skills) ? candidate.skills.join(", ") : candidate.skills}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Experience:</strong> {candidate.experience} years
          </Typography>
          <Typography variant="subtitle1">
            <strong>Expected Salary:</strong> ₹{candidate.expected_salary}
          </Typography>
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        onClick={() => navigate(`/edit-candidate/${candidate.id}`)}
        sx={{ mt: 2 }}
      >
        Edit/Update Candidate
      </Button>
    </Box>
  );
};

export default CandidateDetails;
