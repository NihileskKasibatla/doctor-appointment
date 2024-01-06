import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import doctorLogo from "../assets/Doctor-Tool.png";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

import { IconButton, Menu, MenuItem, Fab, Box, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const username = localStorage.getItem("username");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const open = Boolean(anchorEl);

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" sticky="top">
                <Container>
                    <Navbar.Brand href="#home">
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
