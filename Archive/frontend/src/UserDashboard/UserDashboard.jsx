import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import Stack from "@mui/system/Stack";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Rating,
    Fab,
    Popover,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
} from "@mui/material";

import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { styled } from "@mui/system";
import Swal from "sweetalert2";

import { CalendarMonth, StarRate, Cancel, InfoOutlined } from "@mui/icons-material";

const styles = {
    header: {
        backgroundColor: "#3f51b5",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        marginBottom: "20px",
    },
    pageTitle: {
        fontWeight: "bold",
        color: "#3f51b5",
    },
    contentBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "-2em",
        marginRight: "1.8em",
        position: "relative",
        top: "-4.8em",
    },
    fabButton: {
        backgroundColor: "#3f51b5",
        color: "white",
        "&:hover": {
            backgroundColor: "#2c387e",
        },
    },
    appointmentCard: {
        width: "48%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 8,
        marginRight: "2%",
        borderRadius: 8,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    feedbackIcon: {
        marginRight: 5,
    },
};

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
    docName,
    reason,
    feedback,
    onFeedbackClick,
    onCancelClick,
    isUpcoming,
}) => {
    const isFeedbackGiven = !!feedback;
    const handleFeedbackClick = () => {
        // Disable the feedback button if feedback is already given
        if (!isFeedbackGiven) {
            onFeedbackClick(); // Call the original onFeedbackClick function
        } else {
            Swal.fire("Feedback is already provided!!");
        }
    };

    return (
        <Card sx={{ width: 300 }}>
            <CardContent sx={{ textTransform: "uppercase" }}>
                <Typography variant="h6" component="div">
                    {startTime}
                </Typography>
                <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    Center: <span style={{ color: "#319997", fontSize: "12px" }}>{center}</span>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
                <Typography sx={{ fontSize: 12 }} variant="body2">
                    <b>Doctor:</b> {docName}
                </Typography>
                <Typography sx={{ fontSize: 12 }} variant="body2">
                    <b>Reason:</b> {reason}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={handleFeedbackClick}
                    startIcon={<StarRate style={styles.feedbackIcon} />}
                >
                    Feedback
                </Button>
                {isUpcoming && (
                    <Button
                        size="small"
                        onClick={onCancelClick}
                        color="error"
                        startIcon={<Cancel />}
                    >
                        Cancel
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

const UserDashboard = () => {
    const [apps, setApps] = useState([]);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [pageAccess, setPageAccess] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);
    const [infoPopupOpen, setInfoPopupOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
        else {
            if (role === "patient") getData();
            else setPageAccess(false);
        }
    }, []);

    const getData = async () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const out = await axios.get(
            `http://localhost:8081/api/v1/appointment/${userData.userEmail}`,
        );
        setApps(out.data);
    };

    // Sort the apps array based on the appointment time
    const sortedApps = apps.sort((a, b) => dayjs(a.slot).valueOf() - dayjs(b.slot).valueOf());

    // Separate upcoming and past appointments
    const currentTime = dayjs();
    const upcomingApps = sortedApps.filter((app) => dayjs(app.slot).isAfter(currentTime));
    const pastApps = sortedApps.filter((app) => dayjs(app.slot).isBefore(currentTime));

    // Helper text or headline message about doctor's lunch and dinner times
    const lunchTimeMessage =
        "Please note: The doctor's lunchtime is from 12:00 PM to 1:00 PM, and dinner time is from 7:00 PM to 8:00 PM.";

    const handleCancelClick = async (appointment) => {
        try {
            await axios.post(`http://localhost:8081/api/v1/cancelAppointment/${appointment.id}`);

            setApps((prevApps) => prevApps.filter((app) => app.id !== appointment.id));

            Swal.fire("Appointment cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            Swal.fire("Failed to cancel appointment. Please try again.");
        }
    };

    const handleFeedbackClick = async (appointment) => {
        const appointmentTime = dayjs(appointment.slot);
        const currentTime = dayjs();

        // Allow feedback only if the appointment time has passed
        if (currentTime.isAfter(appointmentTime)) {
            setSelectedAppointment(appointment);
            setFeedbackDialogOpen(true);
        } else {
            // Provide user feedback that they can only give feedback for past appointments
            Swal.fire("You can only give feedback for past appointments.");
        }
    };

    const handleFeedbackDialogClose = () => {
        setSelectedAppointment(null);
        setFeedback("");
        setRating(0);
        setFeedbackDialogOpen(false);
    };

    const handleInfoPopupClose = () => {
        setInfoPopupOpen(null);
    };

    const handleInfoIconClick = (event) => {
        setInfoPopupOpen(event.currentTarget);
    };

    const submitFeedback = async () => {
        await axios.post("http://localhost:8081/api/v1/updateRating", {
            email: selectedAppointment.doctorEmail,
            rating,
        });

        await axios.post("http://localhost:8081/api/v1/updateFeedback", {
            id: selectedAppointment.id,
            feedback,
        });

        setFeedbackDialogOpen(false);
    };

    return (
        <div className="user-dashboard-details">
            {/* Info Popup */}
            <Popover
                open={Boolean(infoPopupOpen)}
                anchorEl={infoPopupOpen}
                onClose={handleInfoPopupClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Typography sx={{ p: 2 }}>{lunchTimeMessage}</Typography>
            </Popover>
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
                        Please login as a Patient
                    </Typography>
                </Box>
            )}

            {pageAccess && (
                <Box sx={{ backgroundColor: "#f5f5f5", padding: "2em 0em 4em 2em" }}>
                    <Typography
                        variant="h4"
                        sx={{ color: "#319997", marginBottom: "1em", textAlign: "center" }}
                    >
                        Your Health Dashboard
                    </Typography>

                    {/* Book New Appointment Section */}
                    <Box sx={styles.contentBox}>
                        <Fab
                            variant="extended"
                            onClick={() => navigate("/createAppointment")}
                            sx={{ ...styles.fabButton, marginLeft: "auto" }}
                        >
                            <CalendarMonth sx={{ mr: 1 }} />
                            Book New Appointment
                        </Fab>
                    </Box>

                    {/* Content Section */}

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
                            <Typography variant="h6" sx={{ marginBottom: "1.7em" }}>
                                Upcoming Appointments
                                {/* Info icon for lunch and dinner time message */}
                                <IconButton
                                    size="small"
                                    color="primary"
                                    aria-label="info"
                                    onClick={handleInfoIconClick}
                                    sx={styles.infoIcon}
                                >
                                    <InfoOutlined />
                                </IconButton>
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
                                        docName={app.doctorName}
                                        feedback={app.feedback}
                                        startTime={dayjs(app.slot).format("DD MMM YYYY HH:mm")}
                                        onFeedbackClick={() => handleFeedbackClick(app)}
                                        onCancelClick={() => handleCancelClick(app)}
                                        isUpcoming={true}
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
                                        docName={app.doctorName}
                                        feedback={app.feedback}
                                        startTime={dayjs(app.slot).format("DD MMM YYYY HH:mm")}
                                        onFeedbackClick={() => handleFeedbackClick(app)}
                                    />
                                ))}
                            </Box>
                        </Item>
                    </Stack>
                </Box>
            )}

            {pageAccess && (
                <Dialog open={feedbackDialogOpen} onClose={handleFeedbackDialogClose}>
                    <DialogTitle>Provide Feedback</DialogTitle>
                    <DialogContent>
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="feedback"
                            label="Your Comments"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFeedbackDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={submitFeedback} color="primary">
                            Submit Feedback
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default UserDashboard;
