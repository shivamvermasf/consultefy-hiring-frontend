import React from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import CandidateDetails from "./components/CandidateDetails";
import EditCandidate from "./components/EditCandidate";
import CandidatePage from "./components/CandidatePage";
import CreateOpportunity from "./components/CreateOpportunity";
import EditOpportunity from "./components/EditOpportunity";
import OpportunitiesList from "./components/OpportunitiesList";
import OpportunityPage from "./components/OpportunityPage";
import CertificatesPage from "./components/CertificatesPage";  // ✅ Import Certificates Page

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
        <Route path="/certificates" element={<PrivateRoute element={<CertificatesPage />} />} />  {/* ✅ Add Route for Certificates */}
      </Routes>
    </Router>
  );
}

export default App;
