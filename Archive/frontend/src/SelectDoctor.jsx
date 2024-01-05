import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Card,
  Container,
  CardActions,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Modal } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowBackIos } from "@mui/icons-material";
import axios from "axios";
import { nanoid } from "nanoid";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
};function SelectDoctor() {
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

  const navigate = useNavigate();

  useEffect(() => {
    getAllDoctors();
  }, []);

  const getAllDoctors = async () => {
    const res = await axios.get("http://localhost:8081/api/v1/doctors");
    setDocs(res.data);
  };

  const handleSelectDoctor = (_docName, _docEmail, _center, _availableStartTime, _availableEndTime) => {
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
    const bookedSlots = bookedAppointments.map(
      (appointment) => appointment.slot
    );
    const dateFormatted = tmpSelectedDate.format("YYYY-MM-DD");
    const currentTime = dayjs();

    const allSlots = generateAllSlots(slotDuration);
    var availableSlots = [];

    console.log("currentTime", currentTime);
    console.log("dateFormatted", dateFormatted);
    if (currentTime.isSame(dateFormatted, 'day')) {
      availableSlots = allSlots.filter((slot) => {
        const slotDateTime = `${dateFormatted} ${slot}`;
        const slotTime = dayjs(slotDateTime, 'YYYY-MM-DD HH:mm');
        console.log("slotTime", slotTime);
        console.log("currentTime", currentTime);
        return !bookedSlots.includes(slotDateTime) && currentTime.isBefore(slotTime);
      });
    } else {
      availableSlots = allSlots.filter((slot) => {
        const slotDateTime = `${dateFormatted} ${slot}`;
        return !bookedSlots.includes(slotDateTime);
      });
    }

    setAvailableSlots(availableSlots);
  };

  const generateAllSlots = (duration) => {
    var allSlots = [];
    let currentTime = dayjs(docStartTime, 'HH:mm'); // Parse the start time
    const endTime = dayjs(docEndTime, 'HH:mm'); // Parse the end time

    while (currentTime.isBefore(endTime)) {
      if (
        !currentTime.isSame(dayjs('12:30', 'HH:mm')) &&
        !currentTime.isSame(dayjs('13:00', 'HH:mm'))
      ) {
        allSlots.push(currentTime.format('HH:mm'));
      }

      currentTime = currentTime.add(duration, 'minute');
    }
    console.log("allSlts", allSlots);
    return allSlots;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    calculateAvailableSlots(date);
  };

  const getBookedAppointments = async (_docEmail) => {
    const getAppointmentsForSelectedDoctor = await axios.get(
      `http://localhost:8081/api/v1/appointment/${_docEmail}`
    );
    setBookedAppointments(getAppointmentsForSelectedDoctor.data || []); // add default value for empty case
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

    try {
      // Make API call to add appointment
      const out = await axios.post("http://localhost:8081/api/v1/addAppointment", data);

      // Update booked appointments after successful appointment addition
      getBookedAppointments(docEmail);

      // Close the modal and show success message
      setModalOpen(false);
      Swal.fire("Appointment Added !");
      navigate("/userDash");
    } catch (error) {
      // Handle error
      console.error("Error adding appointment:", error);
      // Optionally show an error message to the user
      Swal.fire("Error adding appointment", "Please try again.", "error");
    }
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
    <>
      <Box sx={styles.headerContainer}>
        <IconButton aria-label="back" onClick={() => navigate("/userDash")} sx={styles.backButton}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h4" component="h2" sx={{ color: "#fff" }}>Select Preferred Doctor</Typography>
      </Box>
      <Container component={"main"} sx={styles.pageContainer}>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
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
                handleSelectDoctor(doc.name, doc.email, doc.center, doc.availableStartTime, doc.availableEndTime)
              }
            />
          ))}
        </Box>
      </Container>
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
      </Modal>
    </>
  );
}

function DoctorCard({ onSelect, name, dept, center, startTime, endTime, rating }) {
  return (
    <Box sx={styles.doctorCard}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {center}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {dept}
          </Typography>
          <Typography variant="body2">Start Time : {startTime}</Typography>
          <Typography variant="body2">End Time : {endTime}</Typography>
          {rating && (
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              Rating:&nbsp;
              <Rating name={`${name}-rating`} value={rating} readOnly />
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => onSelect()}>
            Make Appointment
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default SelectDoctor;