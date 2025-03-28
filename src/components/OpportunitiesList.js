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
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch opportunities data from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
    axios
      .get(`${config.API_BASE_URL}/opportunity`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOpportunities(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching opportunities.");
        setLoading(false);
      });
  }, []);

  // Total opportunities count
  const totalOpportunities = opportunities.length;

  // Handler for clicking on the "Add Opportunity" button
  const handleAddOpportunity = () => {
    navigate("/opportunity/create");
  };

  // Handler for editing an opportunity
  const handleEditOpportunity = (id, e) => {
    // Prevent the row click event from triggering when clicking the edit button
    e.stopPropagation();
    navigate(`/opportunity/edit/${id}`);
  };

  // Handler for clicking on a row to view details
  const handleRowClick = (id) => {
    navigate(`/opportunity/${id}`);
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
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">
          Opportunities ({totalOpportunities})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpportunity}>
          Add Opportunity
        </Button>
      </Paper>

      {loading ? (
        <Typography>Loading opportunities...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : opportunities.length === 0 ? (
        <Typography>No opportunities available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Required Skills</strong></TableCell>
                <TableCell><strong>Rate/Hour</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opportunities.map((opp) => (
                <TableRow
                  key={opp.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(opp.id)}
                >
                  <TableCell>{opp.title}</TableCell>
                  <TableCell>{opp.company}</TableCell>
                  <TableCell>{opp.location}</TableCell>
                  <TableCell>
                    {Array.isArray(opp.required_skills)
                      ? opp.required_skills.join(", ")
                      : opp.required_skills}
                  </TableCell>
                  <TableCell>{opp.rate_per_hour}</TableCell>
                  <TableCell>{opp.status}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleEditOpportunity(opp.id, e)}>
                      <EditIcon />
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

export default OpportunityList;
