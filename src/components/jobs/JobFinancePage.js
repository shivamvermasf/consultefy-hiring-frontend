import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import config from "../../config";
import InvoiceGenerator from "../finance/InvoiceGenerator";
import FinancialDashboard from "../finance/FinancialDashboard";

const JobFinancePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Financial Management - {jobDetails?.opportunity_title}
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Invoice Generation" />
          <Tab label="Financial Dashboard" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <InvoiceGenerator 
            jobId={id} 
            jobDetails={jobDetails}
          />
        )}
        {activeTab === 1 && (
          <FinancialDashboard 
            jobId={id} 
            jobDetails={jobDetails}
          />
        )}
      </Box>
    </Container>
  );
};

export default JobFinancePage; 