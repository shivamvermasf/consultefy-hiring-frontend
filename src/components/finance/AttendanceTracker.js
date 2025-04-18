import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import config from '../../config';

const AttendanceTracker = ({ jobId, jobDetails }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendance, setAttendance] = useState({
    regular_days_worked: 0,
    weekend_days_worked: 0,
    holiday_days_worked: 0,
    leaves_taken: 0,
    overtime_hours: 0,
    notes: '',
  });
  const [workingDays, setWorkingDays] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const response = await axios.get(
        `${config.API_BASE_URL}/jobs/attendance/${jobId}/${year}/${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setAttendance({
          regular_days_worked: response.data.regular_days_worked || 0,
          weekend_days_worked: response.data.weekend_days_worked || 0,
          holiday_days_worked: response.data.holiday_days_worked || 0,
          leaves_taken: response.data.leaves_taken || 0,
          overtime_hours: response.data.overtime_hours || 0,
          notes: response.data.notes || '',
        });
        setWorkingDays(response.data.total_working_days);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance data');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      await axios.post(
        `${config.API_BASE_URL}/jobs/attendance`,
        {
          job_id: jobId,
          year,
          month,
          ...attendance,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Attendance recorded successfully');
      setError('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record attendance');
      setSuccess('');
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setAttendance({
      ...attendance,
      [field]: event.target.value,
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Tracker
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Record working days and attendance for {jobDetails?.candidate_name}
          </Typography>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                views={['year', 'month']}
                label="Select Month"
                minDate={new Date(jobDetails?.start_date)}
                maxDate={jobDetails?.end_date ? new Date(jobDetails.end_date) : new Date()}
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Working Days"
                value={workingDays || ''}
                disabled
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Regular Days Worked"
                type="number"
                value={attendance.regular_days_worked}
                onChange={handleInputChange('regular_days_worked')}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: workingDays } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Weekend Days Worked"
                type="number"
                value={attendance.weekend_days_worked}
                onChange={handleInputChange('weekend_days_worked')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Holiday Days Worked"
                type="number"
                value={attendance.holiday_days_worked}
                onChange={handleInputChange('holiday_days_worked')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Leaves Taken"
                type="number"
                value={attendance.leaves_taken}
                onChange={handleInputChange('leaves_taken')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Overtime Hours"
                type="number"
                value={attendance.overtime_hours}
                onChange={handleInputChange('overtime_hours')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={4}
                value={attendance.notes}
                onChange={handleInputChange('notes')}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Save Attendance'}
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker; 