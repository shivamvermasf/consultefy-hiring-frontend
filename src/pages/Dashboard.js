import React, { useEffect, useState } from "react";
import { getCandidates, getopportunity, getPayments } from "../services/api";
import { Container, Typography, Card, CardContent, Grid, Button, Divider, List, ListItem, ListItemText, Chip, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import UpcomingTasks from '../components/dashboard/UpcomingTasks';

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        getCandidates().then((res) => setCandidates(res.data));
        getopportunity().then((res) => setOpportunities(res.data));
        getPayments().then((res) => setPayments(res.data));
    }, []);

    // Mock earnings data for visualization
    const earningsData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Earnings ($)",
                data: [5000, 7000, 6500, 8000, 9000, 7500], 
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Upcoming Tasks Section */}
                <Grid item xs={12} md={8}>
                    <UpcomingTasks />
                </Grid>

                {/* Quick Stats Section */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Active Jobs
                                </Typography>
                                <Typography component="p" variant="h4">
                                    12
                                </Typography>
                                <Typography color="text.secondary" sx={{ flex: 1 }}>
                                    Currently active job postings
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Pending Interviews
                                </Typography>
                                <Typography component="p" variant="h4">
                                    5
                                </Typography>
                                <Typography color="text.secondary" sx={{ flex: 1 }}>
                                    Interviews scheduled for this week
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Active Candidates
                                </Typography>
                                <Typography component="p" variant="h4">
                                    28
                                </Typography>
                                <Typography color="text.secondary" sx={{ flex: 1 }}>
                                    Candidates in the pipeline
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
