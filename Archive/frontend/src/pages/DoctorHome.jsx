import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Box } from "@mui/system";
import { Logout } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

function DoctorHome() {
  const [apps, setApps] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const out = await axios.get(
      `http://localhost:8081/api/v1/appointment/${userData.email}`
    );
    setApps(out.data);
  };

  const handleLogoutClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogoutClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Separate upcoming and past appointments
  const currentTime = dayjs();
  const upcomingApps = apps.filter((app) => dayjs(app.slot).isAfter(currentTime));
  const pastApps = apps
    .filter((app) => dayjs(app.slot).isBefore(currentTime))
    .sort((a, b) => (b.feedback ? 1 : -1));

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontSize: "1.5rem" }}>
              Dr. App
            </Typography>
          </Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleLogoutClick}
          >
            <Logout />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLogoutClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: "#f5f5f5", padding: "20px" }}>
        <Typography variant="h3" sx={{ marginBottom: "20px" }}>Appointments For You</Typography>

        {/* Upcoming Appointments Section */}
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>Upcoming Appointments</Typography>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"row"}
          gap={2}
          flexWrap={"wrap"}
        >
          {upcomingApps.map((app) => (
            <AppointmentCard
              key={app.id}
              center={app.medicalCenter}
              reason={app.reason}
              docPhone={app.doctorPhone}
              docName={app.userEmail}
              startTime={dayjs(app.slot).format('DD MMM YYYY HH:mm')}
            />
          ))}
        </Box>

        {/* Past Appointments Section */}
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>Past Appointments</Typography>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"row"}
          gap={2}
          flexWrap={"wrap"}
        >
          {pastApps.map((app) => (
            <AppointmentCard
              key={app.id}
              center={app.medicalCenter}
              reason={app.reason}
              docPhone={app.doctorPhone}
              docName={app.userEmail}
              feedback={app.feedback}
              startTime={dayjs(app.slot).format('DD MMM YYYY HH:mm')}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

function AppointmentCard({ center, startTime, docName, reason, feedback }) {
  return (
    <Box sx={{ width: 275, marginBottom: "20px" }} display={"flex"} flexDirection={"column"}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Center: {center}
          </Typography>
          <Typography variant="h5" component="div">
            At {startTime}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            For: {docName}
          </Typography>
          {feedback && <Typography variant="body2"> <b>Patient's Feedback: </b> {feedback}</Typography>}
          <Typography variant="body2">Reason: {reason}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DoctorHome;


