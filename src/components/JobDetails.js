import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import axios from 'axios';
import config from '../config';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch job details');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      active: 'success',
      pending: 'warning',
      completed: 'info',
      terminated: 'error',
    };
    return statusColors[status] || 'default';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Alert severity="info">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WorkIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h5" gutterBottom>
                {job.opportunity_title}
              </Typography>
              <Chip
                label={job.status}
                color={getStatusColor(job.status)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {job.status === 'active' && (
              <Button
                variant="outlined"
                startIcon={<AttachMoneyIcon />}
                onClick={() => navigate(`/jobs/${id}/finance`)}
              >
                View Financials
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/jobs/${id}/edit`)}
            >
              Edit Job
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Candidate Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Candidate Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">{job.candidate_name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{job.candidate_email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Salary</Typography>
                  <Typography variant="body1">
                    {formatCurrency(job.candidate_salary, job.payment_currency)}
                    <Typography component="span" variant="body2" color="textSecondary">
                      {' '}/ {job.payment_frequency}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Company Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Company Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Client Company</Typography>
                  <Typography variant="body1">{job.client_company}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Partner Company</Typography>
                  <Typography variant="body1">{job.partner_company || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Billing Amount</Typography>
                  <Typography variant="body1">
                    {formatCurrency(job.client_billing_amount, job.payment_currency)}
                    <Typography component="span" variant="body2" color="textSecondary">
                      {' '}/ {job.payment_frequency}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contract Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Contract Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Start Date</Typography>
                  <Typography variant="body1">{formatDate(job.start_date)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">End Date</Typography>
                  <Typography variant="body1">{formatDate(job.end_date)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Payment Frequency</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {job.payment_frequency}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Currency</Typography>
                  <Typography variant="body1">{job.payment_currency}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Notes */}
          {job.notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Notes
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1">{job.notes}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default JobDetails; 