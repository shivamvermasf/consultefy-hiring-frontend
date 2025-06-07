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
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap", // allow wrapping on small screens
          overflowX: "hidden", // prevent scrolling sideways
        }}
      >
        {/* Left nav buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexShrink: 1, // allow to shrink if needed
            flexWrap: "wrap", // wrap if it overflows
          }}
        >
          <Button sx={{ color: "white" }} component={Link} to="/">
            Dashboard
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/candidates">
            Candidates
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/opportunities">
            Opportunities
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/jobs">
            Jobs
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/monthly-invoice">
            Monthly Invoice
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/certificates">
            Certificates
          </Button>
          <Button sx={{ color: "white" }} component={Link} to="/admin">
            Admin
          </Button>
        </Box>

        {/* Right logout button */}
        <Box sx={{ ml: "auto" }}>
          <Button sx={{ color: "white" }} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
