import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import config from '../../config';

const FinancialDashboard = ({ jobId, jobDetails }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearToDateSummary, setYearToDateSummary] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, [jobId]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch monthly data for the past 12 months
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1);
      
      const monthlyDataPromises = [];
      for (let d = startDate; d <= currentDate; d.setMonth(d.getMonth() + 1)) {
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        monthlyDataPromises.push(
          axios.get(
            `${config.API_BASE_URL}/jobs/invoice/generate/${jobId}/${year}/${month}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch(() => null) // Handle months with no data
        );
      }

      const responses = await Promise.all(monthlyDataPromises);
      const validResponses = responses
        .filter(response => response && response.data)
        .map(response => {
          const { period, billing, salary, commission, net_profit } = response.data.invoice_details;
          return {
            period: `${period.year}-${String(period.month).padStart(2, '0')}`,
            billingAmount: billing.total,
            salaryAmount: salary.total,
            commission,
            netProfit: net_profit,
          };
        });

      setMonthlyData(validResponses);

      // Calculate year-to-date summary
      const ytdData = validResponses.filter(data => {
        const [year] = data.period.split('-');
        return parseInt(year) === currentDate.getFullYear();
      });

      const ytdSummary = ytdData.reduce((acc, curr) => ({
        totalBilling: (acc.totalBilling || 0) + curr.billingAmount,
        totalSalary: (acc.totalSalary || 0) + curr.salaryAmount,
        totalCommission: (acc.totalCommission || 0) + curr.commission,
        totalProfit: (acc.totalProfit || 0) + curr.netProfit,
      }), {});

      setYearToDateSummary(ytdSummary);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch financial data');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: jobDetails?.payment_currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Year-to-Date Summary Cards */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Year-to-Date Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Billing</Typography>
              <Typography variant="h6">
                {formatCurrency(yearToDateSummary?.totalBilling || 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Salary</Typography>
              <Typography variant="h6">
                {formatCurrency(yearToDateSummary?.totalSalary || 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Commission</Typography>
              <Typography variant="h6">
                {formatCurrency(yearToDateSummary?.totalCommission || 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, height: '100%', bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" color="textSecondary">Net Profit</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(yearToDateSummary?.totalProfit || 0)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* Monthly Trends Chart */}
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>Monthly Trends</Typography>
            <Box sx={{ height: 400, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => {
                      const [year, month] = label.split('-');
                      return new Date(year, month - 1).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      });
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="billingAmount"
                    name="Billing"
                    stroke="#2196f3"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="salaryAmount"
                    name="Salary"
                    stroke="#f44336"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="netProfit"
                    name="Net Profit"
                    stroke="#4caf50"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Profit Breakdown Chart */}
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>Monthly Profit Breakdown</Typography>
            <Box sx={{ height: 400, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => {
                      const [year, month] = label.split('-');
                      return new Date(year, month - 1).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      });
                    }}
                  />
                  <Legend />
                  <Bar dataKey="salaryAmount" name="Salary" fill="#f44336" stackId="a" />
                  <Bar dataKey="commission" name="Commission" fill="#ff9800" stackId="a" />
                  <Bar dataKey="netProfit" name="Net Profit" fill="#4caf50" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FinancialDashboard; 