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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import axios from 'axios';
import config from '../../config';

const AttendanceTracker = ({ jobId, jobDetails }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    leaves: 0,
    halfDays: 0,
    holidays: 0,
    workingHours: 0
  });
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [selectedDate, jobId]);

  const fetchMonthlyAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const response = await axios.get(
        `${config.API_BASE_URL}/attendance/job/${jobId}/monthly?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.success) {
        const { attendance, summary } = response.data;

        // Transform the data to include all days of the month
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const transformedData = allDays.map(date => {
          const dayStr = format(date, 'd');
          const existingRecord = attendance.find(a => 
            a.day === parseInt(dayStr) && 
            a.month === month && 
            a.year === year
          );

          if (existingRecord) {
            return {
              date,
              status: existingRecord.status,
              timeIn: existingRecord.time_in || null,
              timeOut: existingRecord.time_out || null,
              totalHours: parseFloat(existingRecord.total_hours_worked) || 0,
              notes: existingRecord.notes || ''
            };
          }

          return {
            date,
            status: isWeekend(date) ? 'weekend' : 'absent',
            timeIn: null,
            timeOut: null,
            totalHours: 0,
            notes: ''
          };
        });

        setMonthlyAttendance(transformedData);

        // Calculate summary from the transformed data
        const newSummary = {
          totalDays: allDays.length,
          presentDays: transformedData.filter(r => r.status === 'present' && !isWeekend(r.date)).length,
          absentDays: transformedData.filter(r => r.status === 'absent' && !isWeekend(r.date)).length,
          leaves: transformedData.filter(r => r.status === 'leave').length,
          halfDays: transformedData.filter(r => r.status === 'half_day').length,
          holidays: transformedData.filter(r => r.status === 'holiday').length,
          workingHours: transformedData.reduce((total, r) => 
            total + (r.status === 'present' ? (r.totalHours || 0) : 0), 0
          )
        };

        setSummary(newSummary);
        setError('');
      } else {
        throw new Error('Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.response?.data?.error || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceUpdate = async (date, updates) => {
    try {
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      await axios.post(
        `${config.API_BASE_URL}/jobs/attendance`,
        {
          job_id: jobId,
          year,
          month,
          regular_days_worked: summary.presentDays,
          weekend_days_worked: monthlyAttendance.filter(record => 
            isWeekend(record.date) && record.status === 'present'
          ).length,
          holiday_days_worked: summary.holidays,
          leaves_taken: summary.leaves,
          overtime_hours: 0, // This would need to be calculated based on actual overtime
          notes: updates.notes || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Attendance updated successfully');
      setError('');
      fetchMonthlyAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update attendance');
      setSuccess('');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      present: 'success',
      absent: 'error',
      'half_day': 'warning',
      leave: 'info',
      weekend: 'default',
      holiday: 'secondary'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'absent':
        return <CancelIcon fontSize="small" color="error" />;
      case 'half_day':
        return <AccessTimeIcon fontSize="small" color="warning" />;
      case 'leave':
        return <EventBusyIcon fontSize="small" color="info" />;
      default:
        return <CalendarTodayIcon fontSize="small" />;
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
  };

  const handleStatusChange = async (record, newStatus) => {
    // Only update the UI state, don't save to backend yet
    const updatedAttendance = [...monthlyAttendance];
    const recordIndex = updatedAttendance.findIndex(r => 
      format(r.date, 'yyyy-MM-dd') === format(record.date, 'yyyy-MM-dd')
    );

    if (recordIndex !== -1) {
      // If we're editing an existing record, use the editingRecord values
      const updatedRecord = editingRecord ? {
        ...editingRecord,
        status: newStatus,
        timeIn: newStatus === 'present' ? editingRecord.timeIn : null,
        timeOut: newStatus === 'present' ? editingRecord.timeOut : null,
        totalHours: newStatus === 'present' ? editingRecord.totalHours : 0,
      } : {
        ...updatedAttendance[recordIndex],
        status: newStatus,
        timeIn: newStatus === 'present' ? '09:00' : null,
        timeOut: newStatus === 'present' ? '17:00' : null,
        totalHours: newStatus === 'present' ? 8 : 0,
      };

      updatedAttendance[recordIndex] = updatedRecord;
      setMonthlyAttendance(updatedAttendance);
      setEditingRecord(updatedRecord);

      // Calculate new summary
      const newSummary = {
        totalDays: summary.totalDays,
        presentDays: updatedAttendance.filter(r => r.status === 'present' && !isWeekend(r.date)).length,
        absentDays: updatedAttendance.filter(r => r.status === 'absent' && !isWeekend(r.date)).length,
        leaves: updatedAttendance.filter(r => r.status === 'leave').length,
        halfDays: updatedAttendance.filter(r => r.status === 'half_day').length,
        holidays: updatedAttendance.filter(r => r.status === 'holiday').length,
        workingHours: updatedAttendance.reduce((total, r) => 
          total + (r.status === 'present' ? (r.totalHours || 0) : 0), 0
        )
      };

      setSummary(newSummary);
    }
  };

  const handleSaveAttendance = async () => {
    if (!editingRecord) return;

    try {
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = format(editingRecord.date, 'd');

      // Create the composite key for the URL
      const compositeKey = `${jobId}_${year}_${month}_${day}`;

      // Update the attendance record
      const response = await axios.post(
        `${config.API_BASE_URL}/attendance/${compositeKey}`,
        {
          status: editingRecord.status,
          time_in: editingRecord.timeIn,
          time_out: editingRecord.timeOut,
          hours_worked: editingRecord.totalHours,
          notes: editingRecord.notes || ''
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        setSuccess('Attendance updated successfully');
        setError('');
        setEditingRecord(null);
        // Refresh the attendance data
        fetchMonthlyAttendance();
      } else {
        throw new Error('Failed to update attendance');
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError(err.response?.data?.error || 'Failed to update attendance');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Working Days</Typography>
            <Typography variant="h4" color="primary">
              {summary.presentDays + summary.halfDays}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Absents</Typography>
            <Typography variant="h4" color="error">
              {summary.absentDays}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Leaves</Typography>
            <Typography variant="h4" color="info">
              {summary.leaves}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Half Days</Typography>
            <Typography variant="h4" color="warning">
              {summary.halfDays}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary">Holidays</Typography>
            <Typography variant="h4">
              {summary.holidays}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Hours</Typography>
            <Typography variant="h4" color="primary">
              {summary.workingHours}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Month Selector and Controls */}
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month']}
                  label="Select Month"
                  minDate={new Date(jobDetails?.start_date)}
                  maxDate={jobDetails?.end_date ? new Date(jobDetails.end_date) : new Date()}
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      // Set to the first day of the selected month
                      const firstDayOfMonth = new Date(newValue.getFullYear(), newValue.getMonth(), 1);
                      setSelectedDate(firstDayOfMonth);
                    }
                  }}
                  openTo="month"
                  disableFuture={!jobDetails?.end_date}
                  format="MMMM yyyy"
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      size: 'medium',
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }
                    },
                    toolbar: {
                      toolbarFormat: 'MMMM yyyy',
                      hidden: false,
                    },
                    actionBar: {
                      actions: ['accept', 'cancel', 'clear'],
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Present"
                  color="success"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
                <Chip
                  icon={<CancelIcon />}
                  label="Absent"
                  color="error"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label="Half Day"
                  color="warning"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
                <Chip
                  icon={<EventBusyIcon />}
                  label="Leave"
                  color="info"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
                <Chip
                  icon={<CalendarTodayIcon />}
                  label="Holiday"
                  color="secondary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time In</TableCell>
              <TableCell>Time Out</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyAttendance.map((record) => (
              <TableRow 
                key={format(record.date, 'yyyy-MM-dd')}
                sx={{
                  bgcolor: record.isHoliday ? '#fafafa' : 'inherit',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <TableCell>{format(record.date, 'dd MMM yyyy')}</TableCell>
                <TableCell>{format(record.date, 'EEEE')}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(record.status)}
                    label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{record.timeIn || '-'}</TableCell>
                <TableCell>{record.timeOut || '-'}</TableCell>
                <TableCell>{record.totalHours || '-'}</TableCell>
                <TableCell>
                  <Typography noWrap sx={{ maxWidth: 200 }}>
                    {record.notes || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Attendance">
                    <IconButton 
                      size="small"
                      onClick={() => handleEditClick(record)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {editingRecord?.date.getTime() === record.date.getTime() && (
                    <Box sx={{ 
                      position: 'absolute', 
                      zIndex: 1, 
                      bgcolor: 'background.paper', 
                      p: 2, 
                      boxShadow: 3, 
                      borderRadius: 1,
                      minWidth: 300
                    }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Present"
                            color={record.status === 'present' ? 'success' : 'default'}
                            variant={record.status === 'present' ? 'filled' : 'outlined'}
                            onClick={() => handleStatusChange(record, 'present')}
                            size="small"
                          />
                          <Chip
                            icon={<CancelIcon />}
                            label="Absent"
                            color={record.status === 'absent' ? 'error' : 'default'}
                            variant={record.status === 'absent' ? 'filled' : 'outlined'}
                            onClick={() => handleStatusChange(record, 'absent')}
                            size="small"
                          />
                          <Chip
                            icon={<AccessTimeIcon />}
                            label="Half Day"
                            color={record.status === 'half_day' ? 'warning' : 'default'}
                            variant={record.status === 'half_day' ? 'filled' : 'outlined'}
                            onClick={() => handleStatusChange(record, 'half_day')}
                            size="small"
                          />
                          <Chip
                            icon={<EventBusyIcon />}
                            label="Leave"
                            color={record.status === 'leave' ? 'info' : 'default'}
                            variant={record.status === 'leave' ? 'filled' : 'outlined'}
                            onClick={() => handleStatusChange(record, 'leave')}
                            size="small"
                          />
                        </Stack>
                        {editingRecord.status === 'present' && (
                          <Stack direction="row" spacing={2}>
                            <TextField
                              label="Time In"
                              type="time"
                              value={editingRecord.timeIn || '09:00'}
                              onChange={(e) => {
                                const timeIn = e.target.value;
                                const timeOut = editingRecord.timeOut || '17:00';
                                
                                // Calculate total hours
                                const [inHours, inMinutes] = timeIn.split(':').map(Number);
                                const [outHours, outMinutes] = timeOut.split(':').map(Number);
                                const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
                                const totalHours = Math.max(0, totalMinutes / 60);

                                setEditingRecord({
                                  ...editingRecord,
                                  timeIn: timeIn,
                                  totalHours: totalHours
                                });
                              }}
                              size="small"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                step: 300, // 5 min
                              }}
                            />
                            <TextField
                              label="Time Out"
                              type="time"
                              value={editingRecord.timeOut || '17:00'}
                              onChange={(e) => {
                                const timeOut = e.target.value;
                                const timeIn = editingRecord.timeIn || '09:00';
                                
                                // Calculate total hours
                                const [inHours, inMinutes] = timeIn.split(':').map(Number);
                                const [outHours, outMinutes] = timeOut.split(':').map(Number);
                                const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
                                const totalHours = Math.max(0, totalMinutes / 60);

                                setEditingRecord({
                                  ...editingRecord,
                                  timeOut: timeOut,
                                  totalHours: totalHours
                                });
                              }}
                              size="small"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                step: 300, // 5 min
                              }}
                            />
                            <TextField
                              label="Total Hours"
                              type="number"
                              value={editingRecord.totalHours || 0}
                              onChange={(e) => {
                                setEditingRecord({
                                  ...editingRecord,
                                  totalHours: parseFloat(e.target.value) || 0
                                });
                              }}
                              size="small"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                min: 0,
                                max: 24,
                                step: 0.5
                              }}
                            />
                          </Stack>
                        )}
                        <TextField
                          label="Notes"
                          multiline
                          rows={2}
                          value={editingRecord.notes || ''}
                          onChange={(e) => {
                            setEditingRecord({
                              ...editingRecord,
                              notes: e.target.value
                            });
                          }}
                          fullWidth
                          size="small"
                        />
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setEditingRecord(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              handleSaveAttendance();
                              setEditingRecord(null);
                            }}
                          >
                            Save
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default AttendanceTracker; 