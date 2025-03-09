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
        <Route path="/add-candidate" element={<PrivateRoute element={<CandidateForm />} />} />  {/* ✅ Add Route */}
        <Route path="/candidates" element={<PrivateRoute element={<CandidateList />} />} />  {/* ✅ Add Route */}
        <Route path="/edit-candidate/:id" element={<EditCandidate />} />
        <Route path="/candidates/:id" element={<CandidatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
