import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function DoctorHome() {
  const [apps, setApps] = useState([]);
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
    console.log(out);
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Box>
        <Button onClick={() => logout()}>Logout</Button>
        <Typography variant="h3">Appointments For You</Typography>
        <Box>
          <Box
            display={"flex"}
            margin={1}
            flexDirection={"row"}
            gap={2}
            flexWrap={"wrap"}
          >
            {apps.map((app) => (
              <AppointmentCard
                center={app.medicalCenter}
                reason={app.reason}
                docPhone={app.doctorPhone}
                docName={app.userEmail}
                id = {app.id}
                startTime={new Date(app.startDateTime).toLocaleTimeString(
                  "en-US"
                )}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function AppointmentCard({ center, startTime, docName, reason, id }) {
  return (
    <Box sx={{ width: 275 }} display={"flex"} flexDirection={"column"}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Center : {center}
          </Typography>
          <Typography variant="h5" component="div">
            At {startTime}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            For : {docName}
          </Typography>
          <Typography variant="body2">Reason : {reason}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DoctorHome;
