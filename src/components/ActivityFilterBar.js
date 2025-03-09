// src/components/ActivityFilterBar.js
import React from "react";
import { Box, FormControl, Select, MenuItem, Button, Typography } from "@mui/material";

const ActivityFilterBar = ({
  timeFilter,
  setTimeFilter,
  activityFilter,
  setActivityFilter,
  typeFilter,
  setTypeFilter,
  onRefresh,
  onExpandAll,
  onViewAll,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>Filters:</Typography>
        <FormControl size="small">
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <MenuItem value="All time">All time</MenuItem>
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This week">This week</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
            <MenuItem value="All activities">All activities</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="All types">All types</MenuItem>
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Call">Call</MenuItem>
            <MenuItem value="Meeting">Meeting</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button variant="outlined" onClick={onRefresh}>Refresh</Button>
      <Button variant="outlined" onClick={onExpandAll}>Expand All</Button>
      <Button variant="outlined" onClick={onViewAll}>View All</Button>
    </Box>
  );
};

export default ActivityFilterBar;
