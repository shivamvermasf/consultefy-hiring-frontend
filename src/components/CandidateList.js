import React, { useState, useEffect } from "react";
import { Container, Typography, List, ListItem, ListItemText, IconButton, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://ec2-13-48-43-6.eu-north-1.compute.amazonaws.com:5001/api/candidates");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const deleteCandidate = async (id) => {
    try {
      await axios.delete(`http://ec2-13-48-43-6.eu-north-1.compute.amazonaws.com:5001/api/candidates/${id}`);
      setCandidates(candidates.filter((candidate) => candidate.id !== id));
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Candidate List
        </Typography>
        <List>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <ListItem key={candidate.id} secondaryAction={
                <IconButton edge="end" onClick={() => deleteCandidate(candidate.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }>
                <ListItemText
                  primary={`${candidate.name} (${candidate.experience} years)`}
                  secondary={`Skills: ${candidate.skills.join(", ")} | Email: ${candidate.email}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No candidates available.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default CandidateList;
