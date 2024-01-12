import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";
import {
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    CardActions,
} from "@mui/material";

import Stack from "@mui/system/Stack";

import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { styled } from "@mui/system";
import { Cancel } from "@mui/icons-material";

const Item = styled("div")(({ theme }) => {
    return {
        padding: theme.spacing(0),
        textAlign: "left",
        flexGrow: 1,
    };
});

const AppointmentCard = ({
    center,
    startTime,
    userEmail,
    reason,
    feedback,
    onSendMessageClick,
    isUpComing,
}) => {
    const handleSendMessage = () => onSendMessageClick();
    return (
        <Card sx={{ width: 300 }}>
            <CardContent sx={{ textTransform: "uppercase" }}>
                <Typography variant="h6" component="div">
                    {startTime}
                </Typography>
                <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    Center: <span style={{ color: "#319997", fontSsize: "12px" }}>{center}</span>
                </Typography>
                <Typography sx={{ mb: 1.5, fontSize: 12 }} color="text.secondary">
                    Patient: <span style={{ color: "#319997", fontSize: "12px" }}>{userEmail}</span>
                </Typography>
                <Typography sx={{ fontSize: 12 }} variant="body2">
                    Patient's Feedback: {feedback}
                </Typography>
                <Typography sx={{ fontSize: 12 }} variant="body2">
                    <b>Reason:</b> {reason}
                </Typography>
            </CardContent>
            {isUpComing && (
                <CardActions>
                    <Button size="small" onClick={handleSendMessage}>
                        Send Message
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

const DoctorDashboard = () => {
    const [apps, setApps] = useState([]);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const [pageAccess, setPageAccess] = useState(true);
    const navigate = useNavigate();
    const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageTo, setMessageTo] = useState("");
    const [errorSendMessage, setErrorSendMessage] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

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

    // Sort the apps array based on the appointment time
    const sortedApps = apps.sort((a, b) => dayjs(a.slot).valueOf() - dayjs(b.slot).valueOf());

    // Separate upcoming and past appointments
    const currentTime = dayjs();
    const upcomingApps = sortedApps.filter((app) => {
        return dayjs(app.slot).isAfter(currentTime);
    });
    const pastApps = apps.filter((app) => {
        return dayjs(app.slot).isBefore(currentTime);
    });

    const handleOuterSendMessage = async (appointment) => {
        setMessageTo(appointment.userEmail);
        setSendMessageDialogOpen(true);
        setErrorSendMessage(false);
        setSelectedAppointment(appointment);
    };

    const handleSendMessageDialogClose = () => {
        setSendMessageDialogOpen(false);
        setSelectedAppointment(null);
    };

    const saveMessage = async () => {
        try {
            await axios.post("http://localhost:8081/api/v1/updateMessage", {
                id: selectedAppointment.id,
                message,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const sendMessageToPatient = async () => {
        if (message) {
            setSendMessageDialogOpen(false);
            setMessage("");
            await saveMessage();
        } else {
            setErrorSendMessage(true);
        }
    };

    const handleSendMessageChange = (message) => {
        setMessage(message);
        if (message) {
            setErrorSendMessage(false);
        } else {
            setErrorSendMessage(true);
        }
    };

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
                                        userEmail={app.userEmail}
                                        startTime={dayjs(app.slot).format("DD MMM YYYY HH:mm")}
                                        onSendMessageClick={() => handleOuterSendMessage(app)}
                                        isUpComing={true}
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
                                        userEmail={app.userEmail}
                                        feedback={app.feedback}
                                        startTime={dayjs(app.slot).format("DD MMM YYYY HH:mm")}
                                    />
                                ))}
                            </Box>
                        </Item>
                    </Stack>
                </Box>
            )}

            <Dialog open={sendMessageDialogOpen} onClose={handleSendMessageDialogClose}>
                <DialogTitle className="send-message-title">Message to {messageTo}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="feedback"
                        label="Message to Patient"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={message}
                        onChange={(e) => handleSendMessageChange(e.target.value)}
                    />
                    {errorSendMessage && (
                        <DialogTitle style={{ color: "red" }}>
                            Message to patient cannot be empty
                        </DialogTitle>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSendMessageDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={sendMessageToPatient} color="primary">
                        Send Message
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DoctorDashboard;
