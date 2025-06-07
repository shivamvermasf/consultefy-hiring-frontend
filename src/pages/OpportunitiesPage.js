import React from 'react';
import { Container, Typography } from '@mui/material';
import OpportunitiesList from '../components/opportunities/OpportunitiesList';

const OpportunitiesPage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Opportunities
      </Typography>
      <OpportunitiesList />
    </Container>
  );
};

export default OpportunitiesPage; 