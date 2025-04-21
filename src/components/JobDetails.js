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
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LaunchIcon from '@mui/icons-material/Launch';
import EventNoteIcon from '@mui/icons-material/EventNote';
import axios from 'axios';
import config from '../config';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllDetails();
  }, [id]);

  const fetchAllDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch job details
      const jobResponse = await axios.get(`${config.API_BASE_URL}/jobs/${id}`, { headers });
      setJob(jobResponse.data);

      // Fetch opportunity details if opportunity_id exists
      if (jobResponse.data.opportunity_id) {
        const opportunityResponse = await axios.get(
          `${config.API_BASE_URL}/opportunity/${jobResponse.data.opportunity_id}`,
          { headers }
        );
        setOpportunity(opportunityResponse.data);
      }

      // Fetch candidate details if candidate_id exists
      if (jobResponse.data.candidate_id) {
        const candidateResponse = await axios.get(
          `${config.API_BASE_URL}/candidates/${jobResponse.data.candidate_id}`,
          { headers }
        );
        setCandidate(candidateResponse.data);
      }

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

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (typeof skills === 'string') {
      try {
        return JSON.parse(skills);
      } catch (e) {
        return skills.split(',').map(s => s.trim());
      }
    }
    return Array.isArray(skills) ? skills : [];
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
    <Container 
      maxWidth={false} 
      sx={{ 
        mt: 2,
        mx: 2,
        pr: 0,
        '& .MuiPaper-root': {
          borderRadius: 1
        }
      }}
    >
      {/* Header Card */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ flex: '0 0 94%' }}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {opportunity?.title || job.opportunity_title} - {job.client_company}
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
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EventNoteIcon />}
                      onClick={() => navigate(`/jobs/${id}/attendance`)}
                      sx={{ minWidth: '140px', whiteSpace: 'nowrap' }}
                    >
                      Attendance
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AttachMoneyIcon />}
                      onClick={() => navigate(`/jobs/${id}/finance`)}
                      sx={{ minWidth: '140px', whiteSpace: 'nowrap' }}
                    >
                      Financials
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/jobs/${id}/edit`)}
                  sx={{ minWidth: '100px', whiteSpace: 'nowrap' }}
                >
                  Edit Job
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left side - Job Details (2/3) */}
        <Box sx={{ flex: '0 0 60%' }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BusinessIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" color="primary">Job Details</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Client Company</Typography>
                  <Typography variant="body1">{job.client_company}</Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Partner Company</Typography>
                  <Typography variant="body1">{job.partner_company || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Billing Amount</Typography>
                  <Typography variant="body1">
                    {formatCurrency(job.client_billing_amount, job.payment_currency)}
                    <Typography component="span" variant="body2" color="textSecondary">
                      {' '}/ {job.payment_frequency}
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Payment Terms</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {job.payment_frequency}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Start Date</Typography>
                  <Typography variant="body1">{formatDate(job.start_date)}</Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">End Date</Typography>
                  <Typography variant="body1">{formatDate(job.end_date)}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{job.status}</Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                  <Typography variant="body1">{job.notes || 'No notes available'}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right side - Related Information (1/3) */}
        <Box sx={{ flex: '0 0 32%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Opportunity Information */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e0e0e0',
                bgcolor: '#f5f5f5',
                mx: -3,
                mt: -3,
                px: 3,
                pt: 2
              }}>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <BusinessIcon sx={{ mr: 1 }} /> Opportunity Details
                </Typography>
                {opportunity && (
                  <Tooltip title="View Opportunity">
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/opportunity/${opportunity.id}`)}
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {opportunity ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="subtitle2" color="textSecondary">Title</Typography>
                      <Typography variant="body1">{opportunity.title}</Typography>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                      <Chip
                        label={opportunity.status}
                        size="small"
                        color={opportunity.status === 'Candidate Selected' ? 'success' : 'default'}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">Required Skills</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 1 }}>
                      {parseSkills(opportunity.required_skills).map((skill, index) => (
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
                  </Box>
                </Box>
              ) : (
                <Typography color="textSecondary">No opportunity details available</Typography>
              )}
            </Paper>

            {/* Candidate Information */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e0e0e0',
                bgcolor: '#f5f5f5',
                mx: -3,
                mt: -3,
                px: 3,
                pt: 2
              }}>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <PersonIcon sx={{ mr: 1 }} /> Candidate Details
                </Typography>
                {candidate && (
                  <Tooltip title="View Candidate">
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {candidate ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                      <Typography variant="body1">{candidate.name}</Typography>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{candidate.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                      <Typography variant="body1">{candidate.phone}</Typography>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="subtitle2" color="textSecondary">Skills</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 1 }}>
                        {parseSkills(candidate.skills).map((skill, index) => (
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
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography color="textSecondary">No candidate details available</Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default JobDetails; 