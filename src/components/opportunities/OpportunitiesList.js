// src/components/OpportunityList.js
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
  IconButton,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Tooltip,
  LinearProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOpportunities = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${config.API_BASE_URL}/opportunity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching opportunities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Total opportunities count
  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter(opp => opp.status === 'Open').length;

  // Handler for clicking on the "Add Opportunity" button
  const handleAddOpportunity = () => {
    navigate("/opportunity/create");
  };

  // Handler for editing an opportunity
  const handleEditOpportunity = (id, e) => {
    e.stopPropagation();
    navigate(`/opportunity/edit/${id}`);
  };

  // Handler for clicking on a row to view details
  const handleRowClick = (id) => {
    navigate(`/opportunity/${id}`);
  };

  // Function to parse skills
  const parseSkills = (skills) => {
    if (typeof skills === 'string') {
      try {
        return JSON.parse(skills);
      } catch (e) {
        return skills.split(',').map(s => s.trim());
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
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 3
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
                  Opportunity Overview
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Opportunities: {totalOpportunities} | Active: {activeOpportunities}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddOpportunity}
                  sx={{ 
                    padding: '6px 12px',
                    '& .MuiButton-startIcon': {
                      margin: '0 4px 0 0'
                    }
                  }}
                >
                  Add Opportunity
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh list">
                <IconButton 
                  onClick={fetchOpportunities}
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
              Status Overview
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {['Open', 'Candidate Mapping', 'Profile Shared', 'Interviewing', 'Closed'].map((status) => {
                const count = opportunities.filter(opp => opp.status === status).length;
                if (count > 0) {
                  return (
                    <Chip
                      key={status}
                      label={`${status} (${count})`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  );
                }
                return null;
              })}
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
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Required Skills</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rate/Hour</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opportunities.map((opp) => (
                <TableRow
                  key={opp.id}
                  hover
                  sx={{ 
                    cursor: "pointer",
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={() => handleRowClick(opp.id)}
                >
                  <TableCell>{opp.title}</TableCell>
                  <TableCell>{opp.company}</TableCell>
                  <TableCell>{opp.location}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {parseSkills(opp.required_skills).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                            '&:hover': {
                              backgroundColor: '#bbdefb',
                              boxShadow: '0px 2px 4px rgba(0,0,0,0.15)'
                            },
                            fontWeight: 500,
                            border: '1px solid rgba(25, 118, 210, 0.1)'
                          }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{opp.rate_per_hour}</TableCell>
                  <TableCell>
                    <Chip
                      label={opp.status}
                      size="small"
                      color={
                        opp.status === 'Candidate Selected' ? 'success' 
                        : opp.status === 'Closed Lost' ? 'error'
                        : 'default'
                      }
                      sx={{ 
                        textTransform: 'capitalize',
                        backgroundColor: opp.status === 'Open' ? '#f5f5f5' : undefined
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={(e) => handleEditOpportunity(opp.id, e)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
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

export default OpportunitiesList;
