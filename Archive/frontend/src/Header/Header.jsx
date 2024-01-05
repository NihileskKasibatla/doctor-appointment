import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import doctorLogo from "../assets/Doctor-Tool.png";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";

// const removeQuotes = (str) => {
//     return str ? str.replace(/['"]+/g, "") : "";
// };

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const username = localStorage.getItem("username");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

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
                        {isLoggedIn && (
                            <IconButton
                                size="large"
                                edge="end"
                                color="primary"
                                onClick={handleLogoutClick}
                            >
                                <Logout />
                            </IconButton>
                        )}
                        {isLoggedIn && (
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleLogoutClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
