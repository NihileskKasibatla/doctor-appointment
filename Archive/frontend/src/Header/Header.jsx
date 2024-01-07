import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import doctorLogo from "../assets/Doctor-Tool.png";
import { useNavigate } from "react-router-dom";

import { Menu, MenuItem, Fab, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Tooltip from "@mui/material/Tooltip";

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const username = localStorage.getItem("username");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogoutClose = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleHomePageLogoClick = () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            if (role === "doctor") navigate("/doctorDashboard");
            else navigate("/userDashboard");
        }
    };

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" sticky="top">
                <Container>
                    <Navbar.Brand style={{ cursor: "pointer" }} onClick={handleHomePageLogoClick}>
                        <img
                            alt="Doctor App Header Logo"
                            src={doctorLogo}
                            width="100"
                            className="d-inline-block align-top"
                        />{" "}
                        Dr. App
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        {isLoggedIn && <Navbar.Text>Signed in as: {username}</Navbar.Text>}
                    </Navbar.Collapse>
                    {isLoggedIn && (
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleLogoutClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                        {isLoggedIn && (
                            <Tooltip title="Account settings">
                                <Fab
                                    size="small"
                                    color="secondary"
                                    aria-label="profile"
                                    onClick={handleLogoutClick}
                                    sx={{ marginLeft: "1em" }}
                                >
                                    <AccountCircleIcon />
                                </Fab>
                            </Tooltip>
                        )}
                    </Box>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
