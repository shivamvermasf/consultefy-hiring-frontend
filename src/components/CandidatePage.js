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
  Paper,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import config from "../config";
import CandidateDetails from "./CandidateDetails";
import ResumePreview from "./ResumePreview";
import Activities from "./Activities";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CandidatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leftTab, setLeftTab] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    fetchCandidateData();
  }, [id]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_BASE_URL}/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidate(response.data);

      // Fetch active job for this candidate if exists
      const jobsResponse = await axios.get(`${config.API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeJob = jobsResponse.data.find(
        job => job.candidate_id === parseInt(id) && job.status === 'active'
      );
      setActiveJob(activeJob);

      if (response.data.resume_url) {
        setPdfUrl(response.data.resume_url);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch candidate data");
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setLeftTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
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
              p: 2,
            }}
          >
            <Typography variant="h5">
              {candidate.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeJob && (
                <Button
                  startIcon={<AttachMoneyIcon />}
                  onClick={() => navigate(`/jobs/${activeJob.id}/finance`)}
                  sx={{ 
                    color: '#1976d2',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    padding: '4px 8px',
                  }}
                >
                  View Financials
                </Button>
              )}
              <Button
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-candidate/${id}`)}
                sx={{ 
                  color: '#1976d2',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  padding: '4px 8px',
                }}
              >
                Edit/Update Candidate
              </Button>
            </Box>
          </Box>

          {/* Additional header details row */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Title</Typography>
              <Typography variant="body1">Director of Vendor Relations</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Company</Typography>
              <Typography variant="body1">Farmers Coop. of Florida</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Phone</Typography>
              <Typography variant="body1">{candidate.phone}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{candidate.email}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <Grid container spacing={2}>
        {/* Left Column: Details and Resume */}
        <Grid item xs={12} lg={8}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={leftTab} onChange={handleTabChange}>
                  <Tab label="Details" />
                  <Tab label="Resume" />
                </Tabs>
              </Box>
              <Box sx={{ minHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                {leftTab === 0 && <CandidateDetails candidate={candidate} />}
                {leftTab === 1 && <ResumePreview pdfUrl={pdfUrl} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Activities */}
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Activities
              </Typography>
              <Box sx={{ minHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                <Activities parentType="Candidate" parentId={id} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CandidatePage;
