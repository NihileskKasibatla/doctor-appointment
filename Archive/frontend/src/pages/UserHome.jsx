import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Fab,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { CalendarMonth } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserHome() {
  const [apps, setApps] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const out = await axios.get(
      `http://localhost:8081/api/v1/appointment/${userData.userEmail}`
    );
    setApps(out.data);
    console.log(out);
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/");
  };

  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Button onClick={() => logout()}>Logout</Button>
        <Typography variant="h2">User Dashboard - Dr. App</Typography>
        <Box>
          <Typography variant="h4">Appointments you made</Typography>
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
                docName={app.doctorName}
                startTime={new Date(app.startDateTime).toLocaleTimeString(
                  "en-US"
                )}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Fab variant="extended" onClick={() => navigate("/selectDoctor")}>
        <CalendarMonth sx={{ mr: 1 }} />
        Book New Appointment
      </Fab>
    </>
  );
}

export default UserHome;
function AppointmentCard({ center, startTime, docName, reason }) {
  return (
    <Box sx={{ width: 275 }} display={"flex"} flexDirection={"column"}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {center}
          </Typography>
          <Typography variant="h5" component="div">
            {startTime}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {docName}
          </Typography>
          <Typography variant="body2">{reason}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Call Doctor</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
