import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";
import { Typography, Card, CardContent, CardActions, Button } from "@mui/material";

import Stack from "@mui/system/Stack";

import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { styled } from "@mui/system";

const Item = styled("div")(({ theme }) => {
    return {
        padding: theme.spacing(0),
        textAlign: "left",
        flexGrow: 1,
    };
});

const AppointmentCard = ({ center, startTime, docName, reason, feedback }) => {
    return (
        <Card sx={{ width: 300 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Center: {center}
                </Typography>
                <Typography variant="h6" component="div">
                    At {startTime}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    For: {docName}
                </Typography>
                <Typography variant="body2" sx={{}}>
                    <b>Patient's Feedback: </b> {feedback ? feedback : "-"}
                </Typography>
                <Typography variant="body2">
                    <b>Reason:</b> {reason}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">View Details</Button>
            </CardActions>
        </Card>
    );
};

const DoctorDashboard = () => {
    const [apps, setApps] = useState([]);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const [pageAccess, setPageAccess] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
        else {
            if (role === "doctor") getData();
            else setPageAccess(false);
        }
    }, []);

    const getData = async () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const out = await axios.get(`http://localhost:8081/api/v1/appointment/${userData.email}`);
        setApps(out.data);
    };

    // Separate upcoming and past appointments
    const currentTime = dayjs();
    const upcomingApps = apps.filter((app) => dayjs(app.slot).isAfter(currentTime));
    const pastApps = apps
        .filter((app) => dayjs(app.slot).isBefore(currentTime))
        .sort((a, b) => (b.feedback ? 1 : -1));

    return (
        <div className="doctor-dashboard-details">
            {!pageAccess && (
                <Box sx={{ backgroundColor: "#f5f5f5", padding: "2em 0em 4em 2em" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#319997",
                            marginTop: "3em",
                            marginBottom: "1em",
                            textAlign: "center",
                        }}
                    >
                        You are not authorized to view this page.
                        <br />
                        Please login as a Doctor
                    </Typography>
                </Box>
            )}
            {pageAccess && (
                <Box sx={{ backgroundColor: "#f5f5f5", padding: "2em 0em 4em 2em" }}>
                    <Typography
                        variant="h4"
                        sx={{ color: "#319997", marginBottom: "1em", textAlign: "center" }}
                    >
                        Your Appointments
                    </Typography>
                    <Stack
                        divider={
                            <Box
                                component="hr"
                                sx={{
                                    border: (theme) =>
                                        `1px solid ${
                                            theme.palette.mode === "dark" ? "#262B32" : "#319997"
                                        }`,
                                }}
                            />
                        }
                        spacing={{ xs: 1, sm: 2 }}
                        direction="column"
                        useFlexGap
                        flexWrap="wrap"
                    >
                        <Item>
                            {/* Upcoming Appointments Section */}
                            <Typography variant="h6" sx={{ marginBottom: "1em" }}>
                                Upcoming Appointments
                            </Typography>
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
                                        startTime={dayjs(app.slot).format("DD MMM YYYY HH:mm")}
                                    />
                                ))}
                            </Box>
                        </Item>

                        {/* Past Appointments Section */}
                        <Item>
                            <Typography variant="h6" sx={{ marginBottom: "1em" }}>
                                Past Appointments
                            </Typography>
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
                                        startTime={dayjs(app.slot).format("DD MMM YYYY HH:mm")}
                                    />
                                ))}
                            </Box>
                        </Item>
                    </Stack>
                </Box>
            )}
        </div>
    );
};

export default DoctorDashboard;
