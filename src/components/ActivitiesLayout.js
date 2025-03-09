// src/components/ActivitiesLayout.js
import React from "react";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { CalendarMonth, EventNote } from "@mui/icons-material";

const ActivitiesLayout = ({ activities }) => {
  // For demonstration, we separate activities into upcoming (not "Completed") and past ("Completed")
  const upcomingActivities = activities.filter(act => act.status !== "Completed");
  const pastActivities = activities.filter(act => act.status === "Completed");

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Upcoming & Overdue</Typography>
      {upcomingActivities.length === 0 ? (
        <Typography>No upcoming activities.</Typography>
      ) : (
        upcomingActivities.map(act => (
          <Paper key={act.id} sx={{ p: 1, mb: 1, display: "flex", gap: 2, alignItems: "center" }}>
            {act.activity_type === "Task" ? <EventNote color="primary" /> : <CalendarMonth color="secondary" />}
            <Box>
              <Typography variant="subtitle1"><strong>{act.subject}</strong></Typography>
              <Typography variant="body2">{act.description}</Typography>
              {act.due_date && (
                <Typography variant="caption">
                  {new Date(act.due_date).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Paper>
        ))
      )}
      <Button variant="outlined" sx={{ mt: 1 }}>View More</Button>
      <Divider sx={{ my: 2 }} />
      {pastActivities.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No past activity.
        </Typography>
      ) : (
        pastActivities.map(act => (
          <Paper key={act.id} sx={{ p: 1, mb: 1 }}>
            <Typography variant="subtitle2">
              <strong>Past {act.activity_type}:</strong> {act.subject}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ActivitiesLayout;
