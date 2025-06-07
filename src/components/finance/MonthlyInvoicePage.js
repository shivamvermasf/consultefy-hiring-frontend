import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const MonthlyInvoicePage = () => {
  // Invoice generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedJob, setSelectedJob] = useState('');
  const [jobs, setJobs] = useState([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);

  // Invoice list/filter state
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [filterYear, setFilterYear] = useState(getCurrentYear());

  const navigate = useNavigate();

  // Fetch jobs for invoice generation
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch invoices for filter
  useEffect(() => {
    fetchInvoices();
  }, [filterMonth, filterYear]);

  const fetchJobs = async () => {
    try {
      setFetchingJobs(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeJobs = response.data.filter(job => job.status === 'active');
      setJobs(activeJobs);
      setFetchingJobs(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setFetchingJobs(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setInvoiceLoading(true);
      setInvoiceError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/invoices/monthly`, {
        params: { year: filterYear, month: filterMonth },
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(response.data.invoices || []);
    } catch (err) {
      setInvoiceError('Failed to fetch invoices');
      setInvoices([]);
      console.error('Error fetching invoices:', err);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedJob) {
      setError('Please select a job');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const payload = {
        year,
        month,
        job_ids: selectedJob === 'all'
          ? jobs.map(job => job.id)
          : [Number(selectedJob)]
      };

      await axios.post(
        `${config.API_BASE_URL}/invoices/generate`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Invoice generated successfully');
      fetchInvoices(); // Refresh invoice list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate invoice');
      console.error('Error generating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (event) => {
    const value = event.target.value;
    setSelectedJob(value);
    if (value === 'all') {
      // Handle all jobs selection
      console.log('Selected all jobs');
    } else {
      // Handle single job selection
      console.log('Selected job:', value);
    }
  };

  // Years for filter dropdown (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => getCurrentYear() - i);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Invoice Generation Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Generate Monthly Invoice
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ minWidth: 500, width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel id="select-job-label">Select Job</InputLabel>
                <Select
                  labelId="select-job-label"
                  id="select-job"
                  value={selectedJob}
                  onChange={handleJobChange}
                  label="Select Job"
                  fullWidth
                  sx={{
                    width: '100%',
                    '& .MuiSelect-select': {
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    },
                  }}
                  disabled={fetchingJobs}
                >
                  {fetchingJobs ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading jobs...
                    </MenuItem>
                  ) : [
                    <MenuItem key="all" value="all">All Active Jobs</MenuItem>,
                    ...jobs.map((job) => (
                      <MenuItem key={job.id} value={String(job.id)}>
                        {job.opportunity_title} - {job.client_company}
                      </MenuItem>
                    ))
                  ]}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Month"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                views={['month', 'year']}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateInvoice}
                disabled={loading || fetchingJobs || jobs.length === 0}
                sx={{ minWidth: '200px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Invoice'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoice List and Filters */}
      <Paper elevation={2} sx={{ px: 2, pb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          mb={0}
          sx={{
            bgcolor: '#ECF0F1',
            color: '#222',
            px: 2,
            py: 1,
            borderRadius: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              color: 'inherit',
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            Invoices
          </Typography>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Month</InputLabel>
            <Select
              value={filterMonth}
              label="Month"
              onChange={e => setFilterMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, idx) => (
                <MenuItem key={m} value={idx + 1}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={filterYear}
              label="Year"
              onChange={e => setFilterYear(Number(e.target.value))}
            >
              {yearOptions.map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {invoiceError && <Alert severity="error" sx={{ mb: 2 }}>{invoiceError}</Alert>}
        {invoiceLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : invoices.length === 0 ? (
          <Alert severity="info">No invoices found for the selected month and year.</Alert>
        ) : (
          <TableContainer sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#ECF0F1' }}>
                  <TableCell align="center" sx={{ color: '#222', fontWeight: 'bold' }}>Month</TableCell>
                  <TableCell align="center" sx={{ color: '#222', fontWeight: 'bold' }}>Year</TableCell>
                  <TableCell align="center" sx={{ color: '#222', fontWeight: 'bold' }}>Candidate</TableCell>
                  <TableCell align="center" sx={{ color: '#222', fontWeight: 'bold' }}>Job Title</TableCell>
                  <TableCell align="center" sx={{ color: '#222', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell align="center" sx={{ color: '#222', fontWeight: 'bold' }}>Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      '&:hover': { backgroundColor: '#e3f2fd' },
                    }}
                    onClick={() =>
                      navigate(`/invoice/${inv.job?.id}/${inv.summary?.year}/${inv.summary?.month}`)
                    }
                  >
                    <TableCell align="center">{MONTHS[(inv.summary.month || filterMonth) - 1]}</TableCell>
                    <TableCell align="center">{inv.summary.year || filterYear}</TableCell>
                    <TableCell align="center">{inv.candidate?.name || '-'}</TableCell>
                    <TableCell align="center">{inv.job?.title || '-'}</TableCell>
                    <TableCell align="center">
                      {inv.summary?.totalSalary ? `₹${inv.summary.totalSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        component="a"
                        href={`${config.API_BASE_URL}/invoices/job/${inv.job.id}/monthly/pdf?year=${inv.summary.year}&month=${inv.summary.month}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          window.open(`/invoice/${inv.job.id}/${inv.summary.year}/${inv.summary.month}`, '_blank');
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default MonthlyInvoicePage; 