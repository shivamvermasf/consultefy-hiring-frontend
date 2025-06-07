import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Toolbar
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import TaskList from '../components/dashboard/TaskList';
import MeetingList from '../components/dashboard/MeetingList';
import SalaryChart from '../components/dashboard/SalaryChart';
import JobsBarChart from '../components/dashboard/JobsBarChart';
import EarningsPieChart from '../components/dashboard/EarningsPieChart';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalBilling: 0,
    totalSalary: 0,
    totalProfit: 0,
    avgProfitPercentage: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activitiesError, setActivitiesError] = useState('');

  const salaryData = [
    { month: 'Jan', salary: 30000 },
    { month: 'Feb', salary: 35000 },
    { month: 'Mar', salary: 37000 },
    { month: 'Apr', salary: 40000 },
    { month: 'May', salary: 42000 },
    { month: 'Jun', salary: 48000 },
  ];

  const jobsData = [
    { job: 'A', count: 10 },
    { job: 'B', count: 15 },
    { job: 'C', count: 20 },
    { job: 'D', count: 25 },
    { job: 'E', count: 30 },
  ];

  const earningsData = [
    { name: 'Earnings', value: 25200 },
    { name: 'Other', value: 8000 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data individually to handle potential missing endpoints
        try {
          const jobsRes = await axiosInstance.get('/jobs/summary/active');
          if (jobsRes.data) {
            console.log('Active jobs summary:', jobsRes.data);
            setStats(prevStats => ({
              ...prevStats,
              activeJobs: jobsRes.data.total_active_jobs || 0,
              totalBilling: parseFloat(jobsRes.data.total_billing_amount) || 0,
              totalSalary: parseFloat(jobsRes.data.total_salary_cost) || 0,
              totalProfit: parseFloat(jobsRes.data.total_profit) || 0,
              avgProfitPercentage: parseFloat(jobsRes.data.avg_profit_percentage) || 0,
              totalRevenue: parseFloat(jobsRes.data.total_billing_amount) || 0,
              monthlyRevenue: parseFloat(jobsRes.data.total_billing_amount) || 0
            }));
          } else {
            console.warn('Invalid jobs summary response:', jobsRes.data);
            setStats(prevStats => ({
              ...prevStats,
              activeJobs: 0,
              totalBilling: 0,
              totalSalary: 0,
              totalProfit: 0,
              avgProfitPercentage: 0,
              totalRevenue: 0,
              monthlyRevenue: 0
            }));
          }
        } catch (error) {
          console.warn('Failed to fetch jobs summary:', error);
          setStats(prevStats => ({
            ...prevStats,
            activeJobs: 0,
            totalBilling: 0,
            totalSalary: 0,
            totalProfit: 0,
            avgProfitPercentage: 0,
            totalRevenue: 0,
            monthlyRevenue: 0
          }));
        }

        // Fetch total candidates count
        try {
          const candidatesRes = await axiosInstance.get('/candidates/count');
          if (candidatesRes.data && typeof candidatesRes.data.total === 'number') {
            console.log('Total candidates:', candidatesRes.data.total);
            setStats(prevStats => ({
              ...prevStats,
              totalCandidates: candidatesRes.data.total
            }));
          } else {
            console.warn('Invalid candidates count response:', candidatesRes.data);
            setStats(prevStats => ({
              ...prevStats,
              totalCandidates: 0
            }));
          }
        } catch (error) {
          console.warn('Failed to fetch candidates count:', error);
          setStats(prevStats => ({
            ...prevStats,
            totalCandidates: 0
          }));
        }

        try {
          const paymentsRes = await axiosInstance.get('/payments/recent');
          setRecentPayments(paymentsRes.data);
        } catch (error) {
          console.warn('Failed to fetch recent payments:', error);
          setRecentPayments([]);
        }

        // Fetch activities from backend
        try {
          const res = await axiosInstance.get('/activities/recent');
          const activities = res.data || [];

          setTasks(
            activities
              .filter(a => a.activity_type === 'Task')
              .map(a => ({
                id: a.id,
                label: a.subject || a.description,
                completed: a.status === 'completed'
              }))
          );

          setMeetings(
            activities
              .filter(a => a.activity_type === 'Meeting')
              .map(a => ({
                id: a.id,
                label: a.subject || a.description,
                time: a.due_date ? new Date(a.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
              }))
          );
        } catch (err) {
          setActivitiesError('Failed to load activities');
          setTasks([]);
          setMeetings([]);
        }

        setError('');
      } catch (error) {
        console.error('Error in dashboard data fetch:', error);
        setError('Failed to load some dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', background: '#f4f6fa', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<PeopleIcon color="primary" />} label="Candidates" value={stats.totalCandidates} sublabel="Active" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <JobsBarChart data={jobsData} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SalaryChart data={salaryData} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EarningsPieChart value={25200} data={earningsData} />
            </Grid>
            <Grid item xs={12} md={6}>
              {loadingActivities ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                  <CircularProgress size={24} />
                </Box>
              ) : activitiesError ? (
                <Alert severity="error">{activitiesError}</Alert>
              ) : (
                <TaskList tasks={tasks} onToggle={() => {}} />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {loadingActivities ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                  <CircularProgress size={24} />
                </Box>
              ) : activitiesError ? (
                <Alert severity="error">{activitiesError}</Alert>
              ) : (
                <MeetingList meetings={meetings} />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage; 