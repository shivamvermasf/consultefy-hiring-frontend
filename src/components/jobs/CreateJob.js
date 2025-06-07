import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import WorkIcon from "@mui/icons-material/Work";

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    client_company: "",
    partner_company: "",
    candidate_salary: "",
    client_billing_amount: "",
    start_date: "",
    end_date: "",
    hourly_rate: "",
    monthly_rate: "",
    payment_frequency: "monthly",
    payment_currency: "INR",
    notes: "",
  });

  useEffect(() => {
    fetchCandidates();
    fetchOpportunities();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_BASE_URL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data);
    } catch (err) {
      setError("Failed to fetch candidates");
    }
  };

  const fetchOpportunities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_BASE_URL}/opportunity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities(response.data);
    } catch (err) {
      setError("Failed to fetch opportunities");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.API_BASE_URL}/jobs`,
        {
          opportunity_id: selectedOpportunity?.id,
          candidate_id: selectedCandidate?.id,
          client_company: formData.client_company,
          partner_company: formData.partner_company,
          candidate_salary: formData.candidate_salary,
          client_billing_amount: formData.client_billing_amount,
          start_date: formData.start_date,
          end_date: formData.end_date,
          payment_frequency: formData.payment_frequency,
          payment_currency: formData.payment_currency,
          notes: formData.notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Job created successfully');
      setError('');
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <WorkIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Create New Job
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "primary.main", 
              fontWeight: "bold", 
              mb: 3,
              fontSize: "1.2rem" 
            }}
          >
            Select Candidate and Opportunity
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Grid 
              container 
              spacing={4} 
              sx={{
                '& .MuiAutocomplete-root': {
                  width: '100%',
                  minWidth: '300px',
                },
                '& .MuiInputBase-root': {
                  height: '56px',
                }
              }}
            >
              <Grid item xs={12} md={6}>
                <Autocomplete
                  size="large"
                  options={candidates}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={selectedCandidate}
                  onChange={(event, newValue) => setSelectedCandidate(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select Candidate" 
                      required 
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  size="large"
                  options={opportunities}
                  getOptionLabel={(option) => option.title}
                  value={selectedOpportunity}
                  onChange={(event, newValue) => setSelectedOpportunity(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select Opportunity" 
                      required 
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            Company Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Client Company" name="client_company" value={formData.client_company} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Partner Company" name="partner_company" value={formData.partner_company} onChange={handleInputChange} />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            Financial Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {[
              { name: "candidate_salary", label: "Candidate Salary" },
              { name: "client_billing_amount", label: "Client Billing Amount" },
              { name: "hourly_rate", label: "Hourly Rate" },
              { name: "monthly_rate", label: "Monthly Rate" },
            ].map((field) => (
              <Grid item xs={12} md={6} key={field.name}>
                <TextField
                  fullWidth
                  type="number"
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            Dates and Payment Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Frequency</InputLabel>
                <Select name="payment_frequency" value={formData.payment_frequency} onChange={handleInputChange} label="Payment Frequency" required>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Currency</InputLabel>
                <Select name="payment_currency" value={formData.payment_currency} onChange={handleInputChange} label="Payment Currency">
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            Additional Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Notes" name="notes" multiline rows={4} value={formData.notes} onChange={handleInputChange} />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading} sx={{ minWidth: 120 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ minWidth: 120 }}>
              {loading ? <CircularProgress size={24} /> : "Create Job"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateJob;
