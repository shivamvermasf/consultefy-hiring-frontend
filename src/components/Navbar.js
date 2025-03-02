import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens if stored
    localStorage.removeItem("token"); 
    sessionStorage.removeItem("token"); 
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Left-aligned navigation links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/add-candidate">
            Add Candidate
          </Button>
          <Button color="inherit" component={Link} to="/candidates">
            Candidate List
          </Button>
        </Box>

        {/* Spacer to push logout button to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout button on the right */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
