// src/components/Activities.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Box, Typography, Button, Stack } from "@mui/material";
import ActivityFilterBar from "./ActivityFilterBar";
import ActivitiesTimeline from "./ActivitiesTimeline"; // Use the timeline-based layout
import NewTaskForm from "./NewTaskForm";
import LogCallForm from "./LogCallForm";
import NewEventForm from "./NewEventForm";
import LogNotesForm from "./LogNotesForm";

const Activities = ({ parentType, parentId }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [timeFilter, setTimeFilter] = useState("All time");
  const [activityFilter, setActivityFilter] = useState("All activities");
  const [typeFilter, setTypeFilter] = useState("All types");

  // States for modals
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/activities/parent/${parentType}/${parentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching activities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [parentType, parentId]);

  // Filter logic
  useEffect(() => {
    let result = [...activities];
    if (typeFilter !== "All types") {
      result = result.filter(act => act.activity_type === typeFilter);
    }
    if (activityFilter !== "All activities") {
      if (activityFilter === "Open") {
        result = result.filter(act => act.status !== "Completed");
      } else if (activityFilter === "Closed") {
        result = result.filter(act => act.status === "Completed");
      }
    }
    setFilteredActivities(result);
  }, [activities, timeFilter, activityFilter, typeFilter]);

  // Handlers to open modals
  const handleOpenTaskForm = () => setShowTaskForm(true);
  const handleCloseTaskForm = () => setShowTaskForm(false);
  const handleOpenCallForm = () => setShowCallForm(true);
  const handleCloseCallForm = () => setShowCallForm(false);
  const handleOpenEventForm = () => setShowEventForm(true);
  const handleCloseEventForm = () => setShowEventForm(false);
  const handleOpenNotesForm = () => setShowNotesForm(true);
  const handleCloseNotesForm = () => setShowNotesForm(false);

  // Handler for saving a new activity
  const handleSaveActivity = async (newActivity) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${config.API_BASE_URL}/activities`, {
        parent_type: parentType,
        parent_id: parentId,
        ...newActivity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchActivities();
    } catch (err) {
      console.error("Error saving activity:", err);
      alert("Failed to save activity.");
    }
  };

  if (loading) return <Typography>Loading activities...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      {/* Creation Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleOpenTaskForm}>New Task</Button>
        <Button variant="contained" onClick={handleOpenCallForm}>Log a Call</Button>
        <Button variant="contained" onClick={handleOpenEventForm}>New Event</Button>
        <Button variant="contained" onClick={handleOpenNotesForm}>Log Notes</Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2}}>
        <Button variant="outlined" onClick={fetchActivities}>Refresh</Button>
        <Button variant="outlined" >Expand All</Button>
        <Button variant="outlined" >View All</Button>
      </Stack>

      {/* Filter Bar */}
      <ActivityFilterBar
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onRefresh={fetchActivities}
        onExpandAll={() => console.log("Expand All")}
        onViewAll={() => console.log("View All")}
      />

      {/* Timeline-based layout */}
      <Box sx={{ mt: 2 }}>
        <ActivitiesTimeline activities={filteredActivities} />
      </Box>

      {/* Modals for creating new tasks, calls, events, and notes */}
      <NewTaskForm open={showTaskForm} onClose={handleCloseTaskForm} onSave={handleSaveActivity} />
      <LogCallForm open={showCallForm} onClose={handleCloseCallForm} onSave={handleSaveActivity} />
      <NewEventForm open={showEventForm} onClose={handleCloseEventForm} onSave={handleSaveActivity} />
      <LogNotesForm open={showNotesForm} onClose={handleCloseNotesForm} onSave={handleSaveActivity} />
    </Box>
  );
};

export default Activities;
