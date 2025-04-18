import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
import config from '../config';

const FinancePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeJobs, setActiveJobs] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch active jobs
      const jobsResponse = await axios.get(`${config.API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter active jobs
      const activeJobs = jobsResponse.data.filter(job => job.status === 'active');
      setActiveJobs(activeJobs);

      // Fetch financial summary
      const summaryResponse = await axios.get(
        `${config.API_BASE_URL}/jobs/summary/active`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(summaryResponse.data);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch financial data');
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
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
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Active Jobs</Typography>
            <Typography variant="h4" color="primary">
              {summary?.total_active_jobs || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Billing</Typography>
            <Typography variant="h4">
              {formatCurrency(summary?.total_billing_amount || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Cost</Typography>
            <Typography variant="h4">
              {formatCurrency(summary?.total_salary_cost || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Profit</Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(summary?.total_profit || 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Active Jobs Table */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Active Jobs
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Client Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell align="right">Monthly Billing</TableCell>
                  <TableCell align="right">Monthly Salary</TableCell>
                  <TableCell align="right">Monthly Profit</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.candidate_name}</TableCell>
                    <TableCell>{job.client_company}</TableCell>
                    <TableCell>{job.opportunity_title}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(job.client_billing_amount, job.payment_currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(job.candidate_salary, job.payment_currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        job.client_billing_amount - job.candidate_salary,
                        job.payment_currency
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        component={Link}
                        to={`/jobs/${job.id}/finance`}
                        startIcon={<AttachMoneyIcon />}
                        variant="outlined"
                        size="small"
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {activeJobs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No active jobs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FinancePage; 