import React, { useEffect, useState } from "react";
import { getCandidates, getopportunity, getPayments } from "../services/api";
import { Container, Typography, Card, CardContent, Grid, Button, Divider, List, ListItem, ListItemText, Chip } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

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
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Freelance Recruiting Dashboard
            </Typography>

            {/* Grid Layout */}
            <Grid container spacing={3}>
                {/* Upcoming Activities */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">📌 Upcoming Activities</Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary="Follow-up with John Doe" secondary="Tomorrow 10 AM" />
                                    <Chip label="Pending" color="warning" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Submit Resume for AWS Architect Role" secondary="Due in 2 days" />
                                    <Chip label="Urgent" color="error" />
                                </ListItem>
                            </List>
                            <Button variant="outlined" color="primary" fullWidth>
                                View All Activities
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Candidate Status */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">🧑‍💼 Candidate Status</Typography>
                            {candidates.slice(0, 3).map((c) => (
                                <Typography key={c.id}>
                                    {c.name} - <Chip label={c.status} color={c.status === "Hired" ? "success" : "info"} />
                                </Typography>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Button variant="contained" color="primary" fullWidth>
                                View All Candidates
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Payments & Invoices */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">💰 Payments & Invoices</Typography>
                            {payments.slice(0, 3).map((p) => (
                                <Typography key={p.id}>
                                    Invoice #{p.id} - Due: {p.due_date} - <Chip label={`$${p.amount}`} color="success" />
                                </Typography>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Button variant="contained" color="secondary" fullWidth>
                                Manage Payments
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Earnings Overview */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">📊 Earnings Overview</Typography>
                            <Bar data={earningsData} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Job Opportunities */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">📋 Active Job Opportunities</Typography>
                            {opportunities.slice(0, 3).map((job) => (
                                <Typography key={job.id}>
                                    {job.title} at {job.company} - <Chip label={job.status} color="info" />
                                </Typography>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Button variant="outlined" color="primary" fullWidth>
                                View All Jobs
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
