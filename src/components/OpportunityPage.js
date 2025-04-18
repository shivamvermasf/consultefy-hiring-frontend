import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Box,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";
import config from "../config";
import Activities from "./Activities";

// Custom Stepper Icon Component
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: completed ? "#2E86C1" : active ? "#1A5276" : "#D5DBDB",
        color: completed || active ? "#fff" : "#424949",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "0.3s",
      }}
    >
      {icon}
    </div>
  );
};

const OpportunityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState({ resumeVersion: "", rate: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [linkedCandidates, setLinkedCandidates] = useState([]); // Candidates linked to the opportunity

  useEffect(() => {
    fetchOpportunity();
    fetchCandidates();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${config.API_BASE_URL}/opportunity/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunity(response.data);
      fetchLinkedCandidates(); // Fetch candidates linked to this opportunity
    } catch (err) {
      setError("Failed to fetch opportunity details.");
    }
    setLoading(false);
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/candidates`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCandidates(response.data);
    } catch (err) {
      console.error("Failed to fetch candidates.");
    }
  };

  const fetchLinkedCandidates = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/opportunity-candidates/opportunity/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLinkedCandidates(response.data);
    } catch (err) {
      console.error("Failed to fetch linked candidates.");
    }
  };

  const handleAddCandidate = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate.");
      return;
    }

    try {
      await axios.post(
        `${config.API_BASE_URL}/opportunity-candidates`,
        {
          opportunity_id: id,
          candidate_id: selectedCandidate.id,
          resume_url: candidateDetails.resumeVersion,
          offered_salary: candidateDetails.rate,
          referral_user_id: null,
          status: "Forwarded",
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setOpenDialog(false);
      fetchOpportunity(); // Refresh details
    } catch (err) {
      console.error("Failed to add candidate:", err);
    }
  };

  const baseStages = ["Open", "Candidate Mapping", "Profile Shared", "Interviewing"];
  const finalStage =
    opportunity?.status === "Candidate Selected"
      ? "Candidate Selected"
      : opportunity?.status === "Closed Lost"
      ? "Closed Lost"
      : "Closed";
  const stages = [...baseStages, finalStage];
  const currentStageIndex = opportunity ? stages.indexOf(opportunity.status) : 0;

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <CircularProgress />
        <Typography>Loading opportunity data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!opportunity) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography>Opportunity not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, px: 2, py: 2 }}>
      <Grid>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5">{opportunity.title}</Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => navigate(`/opportunity/edit/${opportunity.id}`)}
                sx={{ mr: 1 }}
              >
                Edit/Update Opportunity
              </Button>
              <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                Add Candidate
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3, px: 2, py: 1, backgroundColor: "#ECF0F1", borderRadius: "8px" }}>
            <Stepper activeStep={currentStageIndex} alternativeLabel>
              {stages.map((stage, index) => (
                <Step key={stage} completed={index < currentStageIndex}>
                  <StepLabel StepIconComponent={CustomStepIcon}>{stage}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6} lg={6}>
              <Typography variant="subtitle1"><strong>Company:</strong> {opportunity.company}</Typography>
              <Typography variant="subtitle1"><strong>Location:</strong> {opportunity.location}</Typography>
              <Typography variant="subtitle1"><strong>Rate per Hour:</strong> {opportunity.rate_per_hour}</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Typography variant="subtitle1"><strong>Status:</strong> {opportunity.status}</Typography>
            </Grid>
          </Grid>

        </Paper>
      </Grid>

      
      <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
              <Grid size={8}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">Job Description</Typography>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: opportunity.job_description || "No description provided." }}
                  />
                </Paper>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">Candidates</Typography>
                  <List>
                    {linkedCandidates.length > 0 ? (
                      linkedCandidates.map((candidate) => (
                        <React.Fragment key={candidate.id}>
                          <ListItem>
                            <ListItemText primary={candidate.name} secondary={`Rate: ${candidate.rate} | Status: ${candidate.status}`} />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography>No candidates linked to this opportunity.</Typography>
                    )}
                  </List>
                </Paper>
              </Grid>

              <Grid size={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">Activities</Typography>
                  <Activities parentType="Opportunity" parentId={opportunity.id} />
                </Paper>
              </Grid>
      </Grid>

    </Container>
  );
};

export default OpportunityPage;
