import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import axios from 'axios';
import config from '../config';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

const CreateJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const prefillOpportunityId = params.get('opportunity_id');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'FULL_TIME',
    status: 'OPEN',
    salary: '',
    clientCompany: '',
    partnerCompany: '',
    startDate: '',
    endDate: '',
    opportunity_id: prefillOpportunityId || '',
    candidate_id: '',
    candidate_salary: '',
    client_billing_amount: '',
    payment_frequency: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [opportunityName, setOpportunityName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (prefillOpportunityId) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${config.API_BASE_URL}/opportunity/${prefillOpportunityId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOpportunityName(res.data.title || res.data.name || '');
        } catch (err) {
          setOpportunityName('Not found');
        }
      }
    };
    fetchOpportunity();
  }, [prefillOpportunityId]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${config.API_BASE_URL}/candidates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCandidates(res.data);
      } catch (err) {
        setCandidates([]);
      }
    };
    fetchCandidates();
  }, [prefillOpportunityId]);

  useEffect(() => {
    const found = candidates.find(c => String(c.id) === String(formData.candidate_id)) || null;
    setSelectedCandidate(found);
    console.log('Selected candidate:', formData.candidate_id, found);
  }, [candidates, formData.candidate_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        client_company: formData.clientCompany,
        partner_company: formData.partnerCompany,
        start_date: formData.startDate,
        end_date: formData.endDate,
        client_billing_amount: formData.client_billing_amount,
        candidate_salary: formData.candidate_salary,
        opportunity_id: formData.opportunity_id,
        candidate_id: formData.candidate_id,
      };
      delete payload.clientCompany;
      delete payload.partnerCompany;
      delete payload.startDate;
      delete payload.endDate;

      const response = await axios.post(
        `${config.API_BASE_URL}/jobs`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/jobs/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, px: 6 }}>
        <Typography variant="h4" gutterBottom>
          Create New Job
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            {/* Row 1 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Job Title" name="title" value={formData.title} onChange={handleChange} />
              </Grid>
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Job Description" name="description" value={formData.description} onChange={handleChange} />
              </Grid>
            </Grid>
            {/* Row 2 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth select label="Job Type" name="type" value={formData.type} onChange={handleChange}>
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                  <MenuItem value="FREELANCE">Freelance</MenuItem>
                </TextField>
              </Grid>
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
              </Grid>
            </Grid>
            {/* Row 3 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange}>
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                  <MenuItem value="ON_HOLD">On Hold</MenuItem>
                </TextField>
              </Grid>
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Partner Company" name="partnerCompany" value={formData.partnerCompany} onChange={handleChange} />
              </Grid>
            </Grid>
            {/* Row 4 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                {prefillOpportunityId ? (
                  <>
                    <TextField fullWidth label="Opportunity" value={opportunityName} InputProps={{ readOnly: true }} helperText="Linked opportunity." />
                    <input type="hidden" name="opportunity_id" value={formData.opportunity_id} />
                  </>
                ) : (
                  <TextField required fullWidth label="Opportunity ID" name="opportunity_id" value={formData.opportunity_id} onChange={handleChange} />
                )}
              </Grid>
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField
                  label="Candidate"
                  value={selectedCandidate ? selectedCandidate.name : ''}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  required
                  sx={{ mr: 2 }}
                />
                <Button variant="outlined" onClick={() => setCandidateModalOpen(true)}>
                  Select Candidate
                </Button>
              </Grid>
            </Grid>
            {/* Row 5 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Client Company" name="clientCompany" value={formData.clientCompany} onChange={handleChange} />
              </Grid>
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Client Billing Amount" name="client_billing_amount" type="number" value={formData.client_billing_amount} onChange={handleChange} />
              </Grid>
            </Grid>
            {/* Row 6 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth label="Candidate Salary" name="candidate_salary" type="number" value={formData.candidate_salary} onChange={handleChange} />
              </Grid>
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField required fullWidth select label="Payment Frequency" name="payment_frequency" value={formData.payment_frequency} onChange={handleChange}>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            {/* Row 7 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
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
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField fullWidth label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            {/* Row 8 */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item sx={{ flex: 1, maxWidth: '48%' }}>
                <TextField fullWidth label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            {/* Row 8: Buttons */}
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <Button variant="outlined" onClick={() => navigate('/jobs')} sx={{ minWidth: 120 }}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ minWidth: 150 }}>
                  {loading ? 'Creating...' : 'Create Job'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {/* Candidate Lookup Modal */}
      <Dialog
        open={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            boxShadow: 12,
            transform: 'scale(0.85)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle>Select Candidate</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search by name, skill, or rate"
            value={candidateSearch}
            onChange={e => setCandidateSearch(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              )
            }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>Expected Rate</TableCell>
                  <TableCell>Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.filter(c => {
                  const search = candidateSearch.toLowerCase();
                  return (
                    c.name?.toLowerCase().includes(search) ||
                    (Array.isArray(c.skills) ? c.skills.join(', ').toLowerCase() : (c.skills || '').toLowerCase()).includes(search) ||
                    (c.expectedRate && c.expectedRate.toString().includes(search))
                  );
                }).map(c => (
                  <TableRow
                    key={c.id}
                    selected={String(c.id) === String(formData.candidate_id)}
                    hover
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      console.log('Selecting candidate', c.id);
                      setFormData(prev => ({ ...prev, candidate_id: String(c.id) }));
                      setCandidateModalOpen(false);
                    }}
                  >
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{(() => {
                      let skillsArr = Array.isArray(c.skills)
                        ? c.skills
                        : (typeof c.skills === 'string' && c.skills.startsWith('[') && c.skills.endsWith(']'))
                          ? (() => { try { return JSON.parse(c.skills); } catch { return []; } })()
                          : c.skills;
                      return Array.isArray(skillsArr) && skillsArr.length > 0
                        ? skillsArr.map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              sx={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 500,
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                mr: 0.5,
                                mb: 0.5,
                                px: 1.5,
                                py: 0.5,
                                border: '1px solid #90caf9'
                              }}
                            />
                          ))
                        : (skillsArr ? <Chip label={skillsArr} size="small" sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 500,
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            px: 1.5,
                            py: 0.5,
                            border: '1px solid #90caf9'
                          }} /> : '-')
                    })()}</TableCell>
                    <TableCell>{c.expectedRate || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant={String(c.id) === String(formData.candidate_id) ? 'contained' : 'outlined'}
                        onClick={e => {
                          e.stopPropagation();
                          console.log('Selecting candidate', c.id);
                          setFormData(prev => ({ ...prev, candidate_id: String(c.id) }));
                          setCandidateModalOpen(false);
                        }}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCandidateModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateJob;
