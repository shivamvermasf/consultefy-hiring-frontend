import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';

const LayoutWithSidebar = ({ children }) => (
  <Box sx={{ display: 'flex', background: '#f4f6fa', minHeight: '100vh' }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      {children}
    </Box>
  </Box>
);

export default LayoutWithSidebar;