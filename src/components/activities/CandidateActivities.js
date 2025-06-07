import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Tabs, Tab, Box, Button } from "@mui/material";
import axios from "axios";
import config from "../config";

const CandidateActivities = ({ candidateId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${config.API_BASE_URL}/activities/candidate/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching activities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [candidateId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter activities based on tab selection:
  const filteredActivities = activities.filter((activity) => {
    if (tabValue === 0) return true;
    const types = ["Task", "Call", "Meeting", "Email"];
    return activity.activity_type === types[tabValue - 1];
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Candidate Activities</Typography>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="All" />
          <Tab label="Tasks" />
          <Tab label="Calls" />
          <Tab label="Meetings" />
          <Tab label="Emails" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Typography>Loading activities...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredActivities.length === 0 ? (
            <Typography>No activities found.</Typography>
          ) : (
            filteredActivities.map((act) => (
              <Paper key={act.id} sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle1">
                  <strong>{act.activity_type}</strong>: {act.subject}
                </Typography>
                <Typography variant="body2">{act.description}</Typography>
                {act.due_date && (
                  <Typography variant="body2">
                    <strong>Due Date:</strong> {new Date(act.due_date).toLocaleString()}
                  </Typography>
                )}
                {act.start_time && (
                  <Typography variant="body2">
                    <strong>Start Time:</strong> {new Date(act.start_time).toLocaleString()}
                  </Typography>
                )}
                {act.end_time && (
                  <Typography variant="body2">
                    <strong>End Time:</strong> {new Date(act.end_time).toLocaleString()}
                  </Typography>
                )}
                {act.location && (
                  <Typography variant="body2">
                    <strong>Location:</strong> {act.location}
                  </Typography>
                )}
                {/* You can add more fields as needed */}
              </Paper>
            ))
          )}
        </Box>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => console.log("Open new activity form")}>
          Add New Activity
        </Button>
      </Paper>
    </Container>
  );
};

export default CandidateActivities;
