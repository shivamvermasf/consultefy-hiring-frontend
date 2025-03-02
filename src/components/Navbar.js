import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { logoutUser } from "../services/auth";

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" onClick={logoutUser}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
