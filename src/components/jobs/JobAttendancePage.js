import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import axios from 'axios';
import config from "../../config";
import AttendanceTracker from "../finance/AttendanceTracker";

const JobAttendancePage = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobDetails(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch job details');
      setLoading(false);
    }
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
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f5f5f5', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Attendance Management - {jobDetails?.opportunity_title}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">Candidate</Typography>
              <Typography variant="body1">{jobDetails?.candidate_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">Client Company</Typography>
              <Typography variant="body1">{jobDetails?.client_company}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">Payment Frequency</Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {jobDetails?.payment_frequency}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <AttendanceTracker 
        jobId={id} 
        jobDetails={jobDetails}
      />
    </Container>
  );
};

export default JobAttendancePage; 