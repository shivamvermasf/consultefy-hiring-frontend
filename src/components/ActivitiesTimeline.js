// src/components/ActivitiesTimeline.js
import React, { useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from "@mui/lab";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Collapse
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Task as TaskIcon,
  PhoneInTalk as CallIcon,
  EventAvailable as MeetingIcon,
  Email as EmailIcon,
  FiberManualRecord as DefaultIcon
} from "@mui/icons-material";

function groupActivitiesByMonth(activities) {
  const groups = {};
  activities.forEach((act) => {
    const dateStr = act.due_date || act.start_time || act.created_at;
    if (!dateStr) {
      const fallbackKey = "No Date";
      if (!groups[fallbackKey]) groups[fallbackKey] = [];
      groups[fallbackKey].push(act);
      return;
    }
    const d = new Date(dateStr);
    const monthName = d.toLocaleString("default", { month: "long" });
    const year = d.getFullYear();
    const key = `${monthName} ${year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(act);
  });
  return groups;
}

const ActivitiesTimeline = ({ activities }) => {
  // Sort descending by date
  const sorted = [...activities].sort((a, b) => {
    const dateA = new Date(a.due_date || a.start_time || a.created_at);
    const dateB = new Date(b.due_date || b.start_time || b.created_at);
    return dateB - dateA;
  });

  const grouped = groupActivitiesByMonth(sorted);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (activityId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "Task":
        return <TaskIcon fontSize="small" />;
      case "Call":
        return <CallIcon fontSize="small" />;
      case "Meeting":
      case "Event":
        return <MeetingIcon fontSize="small" />;
      case "Email":
        return <EmailIcon fontSize="small" />;
      default:
        return <DefaultIcon fontSize="small" />;
    }
  };

  return (
    <Box
      sx={{
        // Scale slightly smaller
        transform: "scale(0.9)",
        transformOrigin: "top left",
        fontSize: "0.9rem"
      }}
    >
      {Object.keys(grouped).map((groupKey) => {
        const groupActivities = grouped[groupKey];

        return (
          <Box key={groupKey} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              {groupKey}
            </Typography>
            <Timeline
              position="right"
              sx={{
                // Remove default margin/padding
                ml: 0,
                mr: 0,
                p: 0,
              }}
            >
              {groupActivities.map((act) => {
                const timelineDate =
                  act.due_date || act.start_time || act.created_at || null;
                const timelineLabel = timelineDate
                  ? new Date(timelineDate).toLocaleString()
                  : "";

                const isExpanded = expandedItems[act.id] || false;

                return (
                  <TimelineItem key={act.id}>
                    <TimelineOppositeContent
                      color="text.secondary"
                      sx={{
                        flex: 0.2,
                        minWidth: "110px",
                        textAlign: "right",
                        pr: 1,
                        fontSize: "0.8rem"
                      }}
                    >
                      {timelineLabel}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "24px",
                          height: "24px"
                        }}
                      >
                        {getActivityIcon(act.activity_type)}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 1, px: 2 }}>
                      <Paper elevation={2} sx={{ p: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                            {act.subject || "No Subject"}
                          </Typography>
                          <IconButton
                            onClick={() => toggleExpand(act.id)}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Type: {act.activity_type}
                          </Typography>
                          {act.description && (
                            <Typography variant="body2">
                              Description: {act.description}
                            </Typography>
                          )}
                          {act.start_time && (
                            <Typography variant="body2">
                              Start: {new Date(act.start_time).toLocaleString()}
                            </Typography>
                          )}
                          {act.end_time && (
                            <Typography variant="body2">
                              End: {new Date(act.end_time).toLocaleString()}
                            </Typography>
                          )}
                        </Collapse>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Box>
        );
      })}
    </Box>
  );
};

export default ActivitiesTimeline;
