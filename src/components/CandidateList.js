// src/components/CandidateList.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BuildIcon from "@mui/icons-material/Build";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch candidate data from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
    axios
      .get(`${config.API_BASE_URL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCandidates(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching candidates.");
        setLoading(false);
      });
  }, []);

  // Calculate total candidates and count by skills
  const totalCandidates = candidates.length;
  const skillsCount = {};
  candidates.forEach((candidate) => {
    let candidateSkills = candidate.skills;
    if (typeof candidateSkills === "string") {
      try {
        candidateSkills = JSON.parse(candidateSkills);
      } catch (e) {
        candidateSkills = candidateSkills.split(",").map((s) => s.trim());
      }
    }
    if (Array.isArray(candidateSkills)) {
      candidateSkills.forEach((skill) => {
        if (skill) {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        }
      });
    }
  });

  // Handler for clicking on a candidate row
  const handleRowClick = (id) => {
    navigate(`/candidates/${id}`);
  };

  // Handler for adding a new candidate
  const handleAddCandidate = () => {
    navigate("/add-candidate");
  };

  return (
    <Box
      sx={{
        // Constrain the width so there's guaranteed margin on wide screens
        maxWidth: 1500,
        // Center the box horizontally
        margin: "0 auto",
        // Add top/bottom padding
        py: 2,
        // Some horizontal padding so content isn't flush against the edges
        px: 2,
      }}
    >
      {/* Header Section */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PeopleIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h6" sx={{ m: 0 }}>
              Candidate List
            </Typography>
            <Typography variant="body2" sx={{ m: 0 }}>
              Total Candidates: {totalCandidates}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ m: 0 }}>
              <BuildIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
              {Object.entries(skillsCount).map(([skill, count]) => (
                <span key={skill} style={{ marginRight: 8 }}>
                  {skill}: {count}
                </span>
              ))}
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleAddCandidate}>
            Add Candidate
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Typography>Loading candidates...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Skills</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(candidate.id)}
                >
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>
                    <EmailIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                    {candidate.email}
                  </TableCell>
                  <TableCell>
                    <PhoneIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                    {candidate.phone}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(candidate.skills)
                      ? candidate.skills.join(", ")
                      : candidate.skills}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CandidateList;
