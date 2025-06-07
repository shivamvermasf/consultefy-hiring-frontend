import React from 'react';
import { Container, Typography } from '@mui/material';
import AttendanceTracker from '../components/finance/AttendanceTracker';

const AttendancePage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>
      <AttendanceTracker />
    </Container>
  );
};

export default AttendancePage; 