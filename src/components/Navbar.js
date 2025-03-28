// src/components/Navbar.js
import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Left-aligned navigation links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button sx={{ color: "white" }} component={Link} to="/">
            Dashboard
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/candidates">
            Candidates
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/opportunities">
            Opportunities
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/certificates">
            Certificates
          </Button>
        </Box>

        {/* Spacer to push logout button to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout button on the right */}
        <Button sx={{ color: "white" }} onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
