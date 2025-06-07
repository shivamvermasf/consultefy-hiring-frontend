// Updated JobList with summary header and professional layout
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import config from "../../config";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Jobs data:', response.data);
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const handleJobClick = (jobId, action = 'finance') => {
    console.log('Job ID:', jobId);
    if (action === 'details') {
      navigate(`/jobs/${jobId}`);
    } else {
      navigate(`/jobs/${jobId}/finance`);
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

  const activeJobsCount = jobs.filter(job => job.status === 'active').length;

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
      {/* Summary Header */}
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
          >
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold">
                Job Overview
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Total Jobs: {jobs.length} | Active: {activeJobsCount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/jobs/create')}
                sx={{ 
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                }}
              >
                Create New Job
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Job Table */}
      <TableContainer 
        component={Paper} 
        variant="outlined"
        sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Client Company</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Billing Amount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Salary</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => {
              console.log('Job object:', job);
              return (
                <TableRow 
                  key={job.id} 
                  hover
                  onClick={() => handleJobClick(job.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <TableCell>{job.candidate_name}</TableCell>
                  <TableCell>{job.opportunity_title}</TableCell>
                  <TableCell>{job.client_company}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(job.client_billing_amount, job.payment_currency)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(job.candidate_salary, job.payment_currency)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleJobClick(job.id, 'details')}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {job.status === 'active' && (
                        <Tooltip title="View Financials">
                          <IconButton size="small" onClick={() => handleJobClick(job.id, 'finance')}>
                            <AttachMoneyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No jobs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="error">{error}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default JobList;