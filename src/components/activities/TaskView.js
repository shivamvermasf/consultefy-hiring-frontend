import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import axiosInstance from '../../utils/axios';
import config from '../../config';

const TaskView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    due_date: '',
    status: '',
    priority: '',
    assigned_to: ''
  });
  const [users, setUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchTask = async (taskId) => {
    try {
      setLoading(true);
      console.log('Fetching task with ID:', taskId);
      
      const url = `/activities/${taskId}`;
      console.log('API URL:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Full API Response:', response);
      console.log('Task API Response Data:', response.data);
      
      if (response.data) {
        console.log('Activity Type:', response.data.activity_type);
        
        if (response.data.activity_type !== 'Task') {
          setError('This is not a task');
          return;
        }

        setTask(response.data);
        setFormData({
          subject: response.data.subject || '',
          description: response.data.description || '',
          due_date: response.data.due_date ? new Date(response.data.due_date).toISOString().split('T')[0] : '',
          status: response.data.status || 'pending',
          priority: response.data.priority || 'medium',
          assigned_to: response.data.assigned_to || ''
        });
        console.log('Form data set:', formData);
      } else {
        console.warn('No data in response:', response);
        setError('Task data is empty');
      }
      setError('');
    } catch (error) {
      console.error('Error fetching task:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 404) {
        setError('Task not found. Please check the ID and try again.');
      } else if (error.response?.status === 401) {
        setError('Please log in to view this task.');
      } else {
        setError(error.response?.data?.error || 'Failed to load task details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users list');
      const response = await axiosInstance.get('/users');
      console.log('Users API Response:', response.data);
      
      if (response.data) {
        setUsers(response.data);
      } else {
        console.warn('No users data in response');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  useEffect(() => {
    fetchTask(id);
    fetchUsers();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/activities/${id}`, formData);
      
      if (response.data) {
        setTask(response.data);
        setEditMode(false);
        setError('');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.error || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/activities/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.error || 'Failed to delete task');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Task not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            {editMode ? 'Edit Task' : 'Task Details'}
          </Typography>
          <Box>
            {!editMode && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
            {editMode && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  startIcon={<SaveIcon />}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              disabled={!editMode}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              disabled={!editMode}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!editMode}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!editMode}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!editMode}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                label="Assigned To"
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskView; 