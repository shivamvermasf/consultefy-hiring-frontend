import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import JobDetails from '../components/jobs/JobDetails';

const JobDetailsPage = () => {
  const { id } = useParams();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Details
      </Typography>
      <JobDetails jobId={id} />
    </Container>
  );
};

export default JobDetailsPage; 