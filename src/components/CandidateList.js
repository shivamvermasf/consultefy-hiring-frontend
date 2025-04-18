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
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch candidate data from the backend
  const fetchCandidates = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${config.API_BASE_URL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching candidates.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
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
  const handleRowClick = (id, event) => {
    if (event.target.closest('.MuiChip-root')) {
      return;
    }
    navigate(`/candidates/${id}`);
  };

  // Handler for adding a new candidate
  const handleAddCandidate = () => {
    navigate("/add-candidate");
  };

  // Function to parse and normalize skills
  const parseSkills = (skills) => {
    if (typeof skills === "string") {
      try {
        return JSON.parse(skills);
      } catch (e) {
        return skills.split(",").map((s) => s.trim());
      }
    }
    return Array.isArray(skills) ? skills : [];
  };

  return (
    <Box
      sx={{
        maxWidth: 1500,
        margin: "0 auto",
        py: 2,
        px: 2,
      }}
    >
      {/* Header Section */}
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 3, 
          bgcolor: '#f8f9fa',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'start', sm: 'center' }}
            sx={{ mb: 2 }}
          >
            <Box flex={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  Candidate Overview
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Candidates: {totalCandidates}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddCandidate}
                  sx={{ 
                    padding: '6px 12px',
                    '& .MuiButton-startIcon': {
                      margin: '0 4px 0 0'
                    }
                  }}
                >
                  Add Candidate
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh list">
                <IconButton 
                  onClick={fetchCandidates}
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter list">
                <IconButton 
                  size="small"
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Top Skills
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {Object.entries(skillsCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([skill, count]) => (
                  <Chip
                    key={skill}
                    label={`${skill} (${count})`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Skills</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  hover
                  sx={{ 
                    cursor: "pointer",
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={(e) => handleRowClick(candidate.id, e)}
                >
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      {candidate.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      {candidate.phone}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {parseSkills(candidate.skills).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            '&:hover': {
                              backgroundColor: '#bbdefb'
                            }
                          }}
                        />
                      ))}
                    </Stack>
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
