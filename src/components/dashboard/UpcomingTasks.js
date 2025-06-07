import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { getUpcomingTasks, getOverdueTasks } from '../../services/api';

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log(`Fetching ${activeTab === 0 ? 'upcoming' : 'overdue'} tasks...`);
      const response = activeTab === 0 
        ? await getUpcomingTasks()
        : await getOverdueTasks();
      console.log('Tasks response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
        setError('');
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching tasks:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || `Failed to load ${activeTab === 0 ? 'upcoming' : 'overdue'} tasks. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTaskIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'INTERVIEW':
        return <EventIcon color="primary" />;
      case 'FOLLOW_UP':
        return <PersonIcon color="secondary" />;
      case 'MEETING':
        return <BusinessIcon color="info" />;
      default:
        return <TaskIcon color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'OVERDUE':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchTasks}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Tasks
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => {/* TODO: Add task creation handler */}}
        >
          Add Task
        </Button>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{ mb: 2 }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TaskIcon fontSize="small" />
              Upcoming
            </Box>
          } 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon fontSize="small" color="error" />
              Overdue
            </Box>
          } 
        />
      </Tabs>
      
      {tasks.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            {activeTab === 0 
              ? 'No upcoming tasks found'
              : 'No overdue tasks found'
            }
          </Typography>
          <Button
            variant="text"
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => {/* TODO: Add task creation handler */}}
          >
            Create your first task
          </Button>
        </Box>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              divider
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                {getTaskIcon(task.type)}
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={
                  <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="textSecondary">
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" color="textSecondary">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                      </Typography>
                      {task.status && (
                        <Chip
                          label={task.status}
                          size="small"
                          color={getStatusColor(task.status)}
                        />
                      )}
                    </Box>
                    {task.relatedTo && (
                      <Typography variant="caption" color="textSecondary">
                        Related to: {task.relatedTo.type} - {task.relatedTo.name}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default UpcomingTasks; 