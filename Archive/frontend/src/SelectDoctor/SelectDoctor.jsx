import React, { useEffect, useState } from "react";
import { Box, Container, IconButton, TextField } from "@mui/material";

import { Typography, Card, CardContent, CardActions, Button } from "@mui/material";
import Stack from "@mui/system/Stack";
import { styled } from "@mui/system";

import { Modal } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowBackIos } from "@mui/icons-material";
import axios from "axios";
import { nanoid } from "nanoid";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Item = styled("div")(({ theme }) => {
    return {
        padding: theme.spacing(0),
        textAlign: "left",
        flexGrow: 1,
    };
});

const styles = {
    modalContent: {
        position: "absolute",
        top: "45%", // Adjust the top position as needed
        left: "50%",
        display: "flex",
        flexDirection: "column",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    },
    doctorCard: {
        width: 275,
        display: "flex",
        flexDirection: "column",
        margin: "16px",
    },
    pageContainer: {
        backgroundColor: "#f5f5f5",
        padding: "20px",
    },
    headerContainer: {
        backgroundColor: "#1976D2",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
    },
    backButton: {
        marginRight: "16px",
    },
};

const DoctorCard = ({ onSelect, name, dept, center, startTime, endTime, rating }) => {
    return (
        <Box sx={styles.doctorCard}>
            <Card sx={{ minWidth: 300 }}>
                <CardContent sx={{ textTransform: "uppercase" }}>
                    <Typography variant="h6" component="div">
                        {name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#319997" }} gutterBottom>
                        {center}
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontSize: 12 }} color="text.secondary">
                        {dept}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary" variant="body2">
                        <b>Start Time:</b> {startTime}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary" variant="body2">
                        <b>End Time:</b> {endTime}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <b>Rating:&nbsp;</b>
                        <Rating name={`${name}-rating`} value={rating} readOnly />
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => onSelect()}>
                        Make Appointment
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

const SelectDoctor = () => {
    const [open, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [reason, setReason] = useState("");
    const [docName, setDocName] = useState("");
    const [center, setCenter] = useState("");
    const [docEmail, setDocEmail] = useState("");
    const [docStartTime, setDocStartTime] = useState("");
    const [docEndTime, setDocEndTime] = useState("");
    const [docs, setDocs] = useState([]);
    const currentDate = dayjs();
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bookedAppointments, setBookedAppointments] = useState([]);
    const [selectedSlotNoFormat, setSelectedSlotNoFormat] = useState("");

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const [pageAccess, setPageAccess] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
        else {
            if (role === "patient") getAllDoctors();
            else setPageAccess(false);
        }
    }, []);

    const getAllDoctors = async () => {
        const res = await axios.get("http://localhost:8081/api/v1/doctors");
        setDocs(res.data);
    };

    const handleSelectDoctor = (
        _docName,
        _docEmail,
        _center,
        _availableStartTime,
        _availableEndTime,
    ) => {
        setDocName(_docName);
        setDocEmail(_docEmail);
        setCenter(_center);
        setDocStartTime(_availableStartTime);
        setDocEndTime(_availableEndTime);
        setModalOpen(true);
        getBookedAppointments(_docEmail);
    };

    const calculateAvailableSlots = (tmpSelectedDate) => {
        const slotDuration = 30; // in minutes
        const bookedSlots = bookedAppointments.map((appointment) => appointment.slot);
        const currentDateTime = dayjs();
        const selectedDateTime = dayjs(tmpSelectedDate);

        let allSlots = generateAllSlots(slotDuration);
        if (selectedDateTime.isSame(currentDateTime, "day")) {
            const currentHourMinute = currentDateTime.format("HH:mm");
            allSlots = allSlots.filter((slot) => slot > currentHourMinute);
        }

        const dateFormatted = selectedDateTime.format().split("T")[0];
        const availableSlots = allSlots.filter((slot) => {
            const slotDateTime = `${dateFormatted} ${slot}`;
            return !bookedSlots.includes(slotDateTime);
        });

        setAvailableSlots(availableSlots);
    };

    const generateAllSlots = (duration) => {
        var allSlots = [];
        let currentTime = docStartTime;
        while (currentTime <= docEndTime) {
            if (currentTime !== "12:30" && currentTime !== "13:00") {
                allSlots.push(currentTime);
            }

            const [hours, minutes] = currentTime.split(":");
            const currentMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
            const newMinutes = currentMinutes + duration;
            const newHours = Math.floor(newMinutes / 60);
            const formattedHours = newHours < 10 ? `0${newHours}` : `${newHours}`;
            const formattedMinutes =
                newMinutes % 60 < 10 ? `0${newMinutes % 60}` : `${newMinutes % 60}`;

            currentTime = `${formattedHours}:${formattedMinutes}`;
        }
        return allSlots;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        calculateAvailableSlots(date);
    };

    const getBookedAppointments = async (_docEmail) => {
        const getAppointmentsForSelectedDoctor = await axios.get(
            `http://localhost:8081/api/v1/appointment/${_docEmail}`,
        );
        setBookedAppointments(getAppointmentsForSelectedDoctor.data);
    };

    const handleSlotSelection = (selectedSlot) => {
        setSelectedSlotNoFormat(selectedSlot);
        setSelectedSlot(`${selectedDate.format().split("T")[0]} ${selectedSlot}`);
    };

    const handleSubmit = async () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const data = {
            id: nanoid(8),
            userEmail: userData.userEmail,
            doctorName: docName,
            doctorPhone: "1234567890",
            doctorEmail: docEmail,
            slot: selectedSlot,
            reason,
            medicalCenter: center,
        };
        await axios.post("http://localhost:8081/api/v1/addAppointment", data);
        setModalOpen(false);
        Swal.fire("Appointment Added !");
        navigate("/userDashboard");
    };

    const availableSlotStyle = {
        flexContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
        },
        slotButton: {
            minWidth: "100px",
        },
    };

    return (
        <div className="select-doctor-details">
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
                        Select Preferred Doctor
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
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#1A5889",
                                    textTransform: "capitalize",
                                    marginBottom: "0em",
                                }}
                            >
                                Available Doctors
                            </Typography>
                            <Box
                                display={"flex"}
                                margin={1}
                                flexDirection={"row"}
                                gap={2}
                                flexWrap={"wrap"}
                            >
                                {docs.map((doc) => (
                                    <DoctorCard
                                        key={doc.email}
                                        name={doc.name}
                                        dept={doc.department}
                                        center={doc.center}
                                        startTime={doc.availableStartTime}
                                        endTime={doc.availableEndTime}
                                        rating={doc.rating}
                                        onSelect={() =>
                                            handleSelectDoctor(
                                                doc.name,
                                                doc.email,
                                                doc.center,
                                                doc.availableStartTime,
                                                doc.availableEndTime,
                                            )
                                        }
                                    />
                                ))}
                            </Box>
                        </Item>
                    </Stack>
                </Box>
            )}
            <Modal
                open={open}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modalContent}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Enter the Reason for Appointment
                    </Typography>
                    <TextField onChange={(e) => setReason(e.target.value)} />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Select the Appointment Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date"
                            value={selectedDate}
                            onChange={(newDate) => handleDateChange(newDate)}
                            minDate={currentDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Typography variant="h6" component="h2">
                        Available Slots:
                    </Typography>
                    <div style={availableSlotStyle.flexContainer}>
                        {availableSlots.map((slot) => (
                            <Button
                                key={slot}
                                style={availableSlotStyle.slotButton}
                                onClick={() => handleSlotSelection(slot)}
                                variant={selectedSlotNoFormat === slot ? "contained" : "outlined"}
                            >
                                {slot}
                            </Button>
                        ))}
                    </div>
                    <Button onClick={handleSubmit}>Make Appointment</Button>
                </Box>
            </Modal>{" "}
            */}
        </div>
    );
};

export default SelectDoctor;
