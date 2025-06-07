import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Paper, Chip, Autocomplete, CircularProgress } from "@mui/material";
import axios from "axios";
import config from "../../config";

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: "",
    experience: "",
    expected_salary: "",
    certificates: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.API_BASE_URL}/candidates/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let skills = response.data.skills;
        try {
          skills = JSON.parse(skills);
          if (Array.isArray(skills)) skills = skills.join(", ");
        } catch (e) {}
        setCandidate({ ...response.data, skills });
        setSelectedCertificates(response.data.certificates || []);
        setLoading(false);
      } catch (err) {
        setError("Error loading candidate data.");
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const fetchCertificates = async (query) => {
    if (!query) return;
    setCertLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/certificates?search=${query}`);
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
    setCertLoading(false);
  };

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const skillsArray = candidate.skills.split(",").map(skill => skill.trim());
      const payload = {
        ...candidate,
        skills: skillsArray,
        certificates: selectedCertificates.map(cert => cert.id)
      };
      await axios.put(`${config.API_BASE_URL}/candidates/${id}`, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      navigate(`/candidates/${id}`);
    } catch (err) {
      console.error("Error updating candidate:", err);
      setError("Error updating candidate details.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Edit Candidate</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Full Name" name="name" fullWidth margin="normal" value={candidate.name} onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth margin="normal" value={candidate.email} onChange={handleChange} />
          <TextField label="Phone" name="phone" fullWidth margin="normal" value={candidate.phone} onChange={handleChange} />
          <TextField label="LinkedIn" name="linkedin" fullWidth margin="normal" value={candidate.linkedin} onChange={handleChange} />
          <TextField label="Skills" name="skills" fullWidth margin="normal" value={candidate.skills} onChange={handleChange} helperText="Comma separated values" />
          <TextField label="Experience" name="experience" fullWidth margin="normal" value={candidate.experience} onChange={handleChange} />
          <TextField label="Expected Salary" name="expected_salary" fullWidth margin="normal" value={candidate.expected_salary} onChange={handleChange} />
          
          <Autocomplete
            multiple
            options={certificates}
            getOptionLabel={(option) => option.name}
            value={selectedCertificates}
            onChange={(event, newValue) => setSelectedCertificates(newValue)}
            filterSelectedOptions
            onInputChange={(event, value) => fetchCertificates(value)}
            renderInput={(params) => (
              <TextField {...params} label="Certificates" margin="normal" fullWidth placeholder="Search for certificates" 
                InputProps={{ ...params.InputProps, endAdornment: certLoading ? <CircularProgress color="inherit" size={20} /> : null }}
              />
            )}
            renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.id} label={option.name} sx={{ m: 0.5 }} />
            ))}
          />
          
          {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">Save Changes</Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCandidate;
