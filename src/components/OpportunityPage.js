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
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import config from "../config";
import Activities from "./Activities";

// Custom styling for Salesforce-style Path
const CustomStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: ownerState.completed
    ? "#2E86C1"
    : ownerState.active
    ? "#1A5276"
    : "#D5DBDB",
  color: ownerState.completed || ownerState.active ? "#fff" : "#424949",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "0.3s",
}));

const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;
  return (
    <CustomStepIconRoot ownerState={{ active, completed }}>
      {icon}
    </CustomStepIconRoot>
  );
};

const OpportunityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOpportunity = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${config.API_BASE_URL}/opportunity/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunity(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch opportunity details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const baseStages = ["Open", "Candidate Mapping", "Profile Shared", "Interviewing"];
  const finalStage = opportunity?.status === "Candidate Selected" ? "Candidate Selected" : 
                     opportunity?.status === "Closed Lost" ? "Closed Lost" : "Closed";
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
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">{opportunity.title}</Typography>
          <Button variant="outlined" onClick={() => navigate(`/opportunity/edit/${opportunity.id}`)}>
            Edit/Update Opportunity
          </Button>
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
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1"><strong>Company:</strong> {opportunity.company}</Typography>
            <Typography variant="subtitle1"><strong>Location:</strong> {opportunity.location}</Typography>
            <Typography variant="subtitle1"><strong>Rate per Hour:</strong> {opportunity.rate_per_hour}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1"><strong>Status:</strong> {opportunity.status}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Job Description</Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: opportunity.job_description || "No description provided." }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Activities</Typography>
              <Activities parentType="Opportunity" parentId={opportunity.id} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default OpportunityPage;
