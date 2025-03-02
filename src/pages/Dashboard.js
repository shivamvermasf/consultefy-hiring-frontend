import React, { useEffect, useState } from "react";
import { getCandidates, getJobs, getPayments } from "../services/api";
import { Container, Typography, Card, CardContent, Grid, Button } from "@mui/material";

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        getCandidates().then((res) => setCandidates(res.data));
        getJobs().then((res) => setJobs(res.data));
        getPayments().then((res) => setPayments(res.data));
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Freelance Recruiting Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Candidates</Typography>
                            {candidates.map((c) => (
                                <Typography key={c.id}>
                                    {c.name} - Trust Score: {c.trust_score}%
                                </Typography>
                            ))}
                            <Button variant="contained" color="primary">View Candidates</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Jobs</Typography>
                            {jobs.map((j) => (
                                <Typography key={j.id}>
                                    {j.title} at {j.company}
                                </Typography>
                            ))}
                            <Button variant="contained" color="secondary">View Jobs</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Payments</Typography>
                            {payments.map((p) => (
                                <Typography key={p.id}>Candidate {p.candidate_id} paid ${p.salary}</Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
