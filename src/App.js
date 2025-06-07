import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from "./pages/Login";
import LoginPage from './pages/LoginPage';
import Dashboard from "./pages/Dashboard";
import DashboardPage from './pages/DashboardPage';
import JobList from "./components/jobs/JobList";
import JobDetails from "./components/jobs/JobDetails";
import JobDetailsPage from './pages/JobDetailsPage';
import JobFinancePage from "./components/jobs/JobFinancePage";
import JobAttendancePage from "./components/jobs/JobAttendancePage";
import AdminPage from "./pages/AdminPage";
import MonthlyInvoicePage from "./components/finance/MonthlyInvoicePage";
import InvoiceDetailsPage from './components/finance/InvoiceDetailsPage';
import InvoicePDFPreview from './components/finance/InvoicePDFPreview';
import CandidateList from "./components/candidates/CandidateList";
import CandidatePage from "./pages/CandidatePage";
import CandidateForm from "./components/candidates/CandidateForm";
import EditCandidate from "./components/candidates/EditCandidate";
import OpportunitiesList from "./components/opportunities/OpportunitiesList";
import OpportunityPage from "./pages/OpportunityPage";
import CreateOpportunity from "./components/opportunities/CreateOpportunity";
import EditOpportunity from "./components/opportunities/EditOpportunity";
import OpportunitiesPage from './pages/OpportunitiesPage';
import FinancePage from './pages/FinancePage';
import AttendancePage from './pages/AttendancePage';
import PrivateRoute from './components/PrivateRoute';
import CreateJob from './pages/CreateJob';
import TaskView from './components/activities/TaskView';
import LayoutWithSidebar from './components/LayoutWithSidebar';

// Create a wrapper component to handle navbar visibility
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <LayoutWithSidebar>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/add-candidate" element={<CandidateForm />} />
                  <Route path="/candidates" element={<CandidateList />} />
                  <Route path="/edit-candidate/:id" element={<EditCandidate />} />
                  <Route path="/candidates/:id" element={<CandidatePage />} />
                  <Route path="/opportunities" element={<OpportunitiesPage />} />
                  <Route path="/opportunity/create" element={<CreateOpportunity />} />
                  <Route path="/opportunity/edit/:id" element={<EditOpportunity />} />
                  <Route path="/opportunity/:id" element={<OpportunityPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/jobs/create" element={<CreateJob />} />
                  <Route path="/jobs/:id" element={<JobDetailsPage />} />
                  <Route path="/jobs/:id/finance" element={<JobFinancePage />} />
                  <Route path="/jobs/:id/attendance" element={<JobAttendancePage />} />
                  <Route path="/monthly-invoice" element={<MonthlyInvoicePage />} />
                  <Route path="/finance" element={<FinancePage />} />
                  <Route path="/finance/invoices/:id" element={<InvoiceDetailsPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/activities/:id" element={<TaskView />} />
                </Routes>
              </LayoutWithSidebar>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

export default App;
