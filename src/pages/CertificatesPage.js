import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import config from "../config";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({ name: "", provider: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_BASE_URL}/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(response.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setError("Failed to load certificates.");
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!newCertificate.name || !newCertificate.provider) {
      setError("Both fields are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${config.API_BASE_URL}/certificates`, newCertificate, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Ensure response contains full certificate object
      const addedCertificate = response.data; // Ensure backend returns { id, name, provider }
  
      if (!addedCertificate.id || !addedCertificate.name || !addedCertificate.provider) {
        setError("Invalid response from server. Refresh the page to see updated certificates.");
        return;
      }
  
      setCertificates([...certificates, addedCertificate]);
      setNewCertificate({ name: "", provider: "" }); // Reset form
      setError("");
    } catch (err) {
      console.error("Error adding certificate:", err);
      setError("Error adding certificate.");
    }
  };

  const handleDeleteCertificate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.API_BASE_URL}/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(certificates.filter((cert) => cert.id !== id));
    } catch (err) {
      console.error("Error deleting certificate:", err);
      setError("Error deleting certificate.");
    }
  };

  return (
    <Box sx={{ mx: 3, my: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Certificates</Typography>
        {error && <Typography color="error">{error}</Typography>}

        {/* Add Certificate Form */}
        <Box component="form" onSubmit={handleAddCertificate} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Certificate Name"
            name="name"
            value={newCertificate.name}
            onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Provider"
            name="provider"
            value={newCertificate.provider}
            onChange={(e) => setNewCertificate({ ...newCertificate, provider: e.target.value })}
            fullWidth
            required
          />
          <Button type="submit" variant="contained">Add Certificate</Button>
        </Box>

        {/* Certificate List */}
        <List sx={{ mt: 3 }}>
          {certificates.map((cert) => (
            <ListItem
              key={cert.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteCertificate(cert.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={`${cert.name} - ${cert.provider}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CertificatesPage;
