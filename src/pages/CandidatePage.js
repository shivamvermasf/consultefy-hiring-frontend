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
  Alert,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from "axios";
import config from "../config";
import CandidateDetails from "../components/candidates/CandidateDetails";
import ResumePreview from "../components/candidates/ResumePreview";
import Activities from "../components/activities/Activities";
import Documents from '../components/documents/Documents';

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
      <Grid>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5">{candidate.name}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeJob && (
                <Button
                  variant="outlined"
                  startIcon={<AttachMoneyIcon />}
                  onClick={() => navigate(`/jobs/${activeJob.id}/finance`)}
                  sx={{ 
                    minWidth: '200px',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                  }}
                >
                  View Financials
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-candidate/${id}`)}
                sx={{ 
                  minWidth: '200px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                }}
              >
                Edit/Update Candidate
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6} lg={6}>
              <Typography variant="subtitle1"><strong>Phone:</strong> {candidate.phone}</Typography>
              <Typography variant="subtitle1"><strong>Email:</strong> {candidate.email}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Column: Details and Resume */}
        <Box sx={{ width: '66.66%' }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <Box sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={leftTab} onChange={handleTabChange}>
                    <Tab label="Details" />
                    <Tab label="Resume" />
                    <Tab label="Documents" />
                  </Tabs>
                </Box>
              </CardContent>
            </Box>
            <CardContent>
              <Box sx={{ minHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                {leftTab === 0 && <CandidateDetails candidate={candidate} />}
                {leftTab === 1 && <ResumePreview pdfUrl={pdfUrl} />}
                {leftTab === 2 && <Documents entityType="candidate" entityId={id} />}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Activities */}
        <Box sx={{ width: '33.33%' }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <Box sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Activities
                </Typography>
              </CardContent>
            </Box>
            <CardContent>
              <Box sx={{ minHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                <Activities parentType="Candidate" parentId={id} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default CandidatePage;
