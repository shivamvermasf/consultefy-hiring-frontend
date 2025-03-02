import React from "react";
import { BrowserRouter, Route, Switch, Navigate } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
