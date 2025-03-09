import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper
} from "@mui/material";
import axios from "axios";
import config from "../config";
import CandidateDetails from "./CandidateDetails";
import ResumePreview from "./ResumePreview";
import Activities from "./Activities";

const CandidatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leftTab, setLeftTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setLeftTab(newValue);
  };

  const fetchCandidateDetail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${config.API_BASE_URL}/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched candidate:", response.data); // Debug log
      setCandidate(response.data);
      if (response.data.resume_link) {
        try {
          const parsed = JSON.parse(response.data.resume_link);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPdfUrl(parsed[0]);
          }
        } catch (e) {
          console.error("Error parsing resume_link", e);
        }
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch candidate details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateDetail();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <CircularProgress />
        <Typography>Loading candidate data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!candidate) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography>Candidate not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, px: 2, py: 2 }}>
      {/* Candidate Header Card */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "lightgray",
              p: 1,
            }}
          >
            <Typography variant="h5">{candidate.name}</Typography>
            <Button
              variant="outlined"
              onClick={() => navigate(`/edit-candidate/${candidate.id}`)}
            >
              Edit/Update Candidate
            </Button>
          </Box>
          {/* Additional header details row */}
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="body2" color="textSecondary">Title</Typography>
              <Typography variant="body1">Director of Vendor Relations</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="body2" color="textSecondary">Company</Typography>
              <Typography variant="body1">Farmers Coop. of Florida</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="body2" color="textSecondary">Phone</Typography>
              <Typography variant="body1">{candidate.phone}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <Typography variant="body1">{candidate.email}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Two-Column Layout */}
      <Grid container spacing={2}>
        {/* Left Column: Tabs for Details and Resume */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Tabs value={leftTab} onChange={handleTabChange}>
                <Tab label="Details" />
                <Tab label="Resume" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {leftTab === 0 && <CandidateDetails candidate={candidate} />}
                {leftTab === 1 && <ResumePreview pdfUrl={pdfUrl} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Right Column: Activities (Timeline) */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Activities</Typography>
              <Activities parentType="Candidate" parentId={candidate.id} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CandidatePage;
