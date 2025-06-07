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
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import config from '../../config';

const InvoiceGenerator = ({ jobId, jobDetails }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);

  const generateInvoice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const response = await axios.post(
        `${config.API_BASE_URL}/jobs/invoice/generate/${jobId}/${year}/${month}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvoiceData(response.data.invoice_details);
      setSuccess('Invoice generated successfully');
      setError('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate invoice');
      setSuccess('');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: jobDetails?.payment_currency || 'USD',
    }).format(amount);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Invoice Generator
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Generate invoice for {jobDetails?.candidate_name}
          </Typography>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={generateInvoice}
                disabled={loading}
                fullWidth
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Invoice'}
              </Button>
            </Grid>

            {(error || success) && (
              <Grid item xs={12}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
              </Grid>
            )}

            {invoiceData && (
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="h6">Invoice Details</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Period</strong></TableCell>
                        <TableCell>
                          {new Date(invoiceData.period.year, invoiceData.period.month - 1)
                            .toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Attendance</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Regular Days</TableCell>
                        <TableCell>{invoiceData.attendance.regular_days}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weekend Days</TableCell>
                        <TableCell>{invoiceData.attendance.weekend_days}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Holiday Days</TableCell>
                        <TableCell>{invoiceData.attendance.holiday_days}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overtime Hours</TableCell>
                        <TableCell>{invoiceData.attendance.overtime_hours}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Billing Details</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Regular Amount</TableCell>
                        <TableCell>{formatCurrency(invoiceData.billing.regular)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weekend Amount</TableCell>
                        <TableCell>{formatCurrency(invoiceData.billing.weekend)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Holiday Amount</TableCell>
                        <TableCell>{formatCurrency(invoiceData.billing.holiday)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overtime Amount</TableCell>
                        <TableCell>{formatCurrency(invoiceData.billing.overtime)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total Billing Amount</strong></TableCell>
                        <TableCell><strong>{formatCurrency(invoiceData.billing.total)}</strong></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Financial Summary</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Salary</TableCell>
                        <TableCell>{formatCurrency(invoiceData.salary.total)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Commission</TableCell>
                        <TableCell>{formatCurrency(invoiceData.commission)}</TableCell>
                      </TableRow>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Net Profit</strong></TableCell>
                        <TableCell><strong>{formatCurrency(invoiceData.net_profit)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator; 