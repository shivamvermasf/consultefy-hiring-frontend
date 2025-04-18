import React from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import EditCandidate from "./components/EditCandidate";
import CandidatePage from "./components/CandidatePage";
import CreateOpportunity from "./components/CreateOpportunity";
import EditOpportunity from "./components/EditOpportunity";
import OpportunitiesList from "./components/OpportunitiesList";
import OpportunityPage from "./components/OpportunityPage";
import CertificatesPage from "./components/CertificatesPage";  // ✅ Import Certificates Page
import AdminPage from "./pages/AdminPage";  // ✅ Import Admin Page
import CreateJob from "./components/CreateJob";
import FinancePage from './components/FinancePage';
import JobFinancePage from './components/JobFinancePage';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/add-candidate" element={<PrivateRoute element={<CandidateForm />} />} />
        <Route path="/candidates" element={<PrivateRoute element={<CandidateList />} />} />
        <Route path="/edit-candidate/:id" element={<EditCandidate />} />
        <Route path="/candidates/:id" element={<CandidatePage />} />
        <Route path="/opportunities" element={<PrivateRoute element={<OpportunitiesList />} />} />
        <Route path="/opportunity/create" element={<CreateOpportunity />} />
        <Route path="/opportunity/edit/:id" element={<EditOpportunity />} />
        <Route path="/opportunity/:id" element={<OpportunityPage />} />
        <Route path="/certificates" element={<PrivateRoute element={<CertificatesPage />} />} />  
        <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />  {/* ✅ Add Route for Admin Page */}
        <Route path="/jobs" element={<PrivateRoute element={<JobList />} />} />
        <Route path="/jobs/create" element={<PrivateRoute element={<CreateJob />} />} />
        <Route path="/jobs/:id" element={<PrivateRoute element={<JobDetails />} />} />
        <Route path="/jobs/:id/finance" element={<PrivateRoute element={<JobFinancePage />} />} />
        <Route path="/finance" element={<FinancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
