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
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";
import axios from "axios";
import { nanoid } from "nanoid";
import Swal from "sweetalert2";

function SelectDoctor() {
  const [open, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [docName, setDocName] = useState("");
  const [center, setCenter] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docs, setDocs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllDoctors();
  }, []);

  const getAllDoctors = async () => {
    const res = await axios.get("http://localhost:8081/api/v1/doctors");
    setDocs(res.data);
  };

  const handleSelectDoctor = (_docName, _docEmail, _center) => {
    setDocName(_docName);
    setDocEmail(_docEmail);
    setCenter(_center);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const data = {
      id: nanoid(8),
      userEmail: userData.userEmail,
      doctorName: docName,
      doctorPhone: "1234567890",
      doctorEmail: docEmail,
      startDateTime: startTime,
      endDateTime: endTime,
      reason,
      medicalCenter: center,
    };
    const out = await axios.post(
      "http://localhost:8081/api/v1/addAppointment",
      data
    );
    setModalOpen(false);
    Swal.fire("Appointment Addded !");
    navigate("/userDash");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    display: "flex",
    flexDirection: "column",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Container component={"main"}>
        <IconButton aria-label="back" onClick={() => navigate("/userDash")}>
          <ArrowBackIos />
        </IconButton>
        <h2>Select Preferred Doctor</h2>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {docs.map((doc) => (
            <DoctorCard
              name={doc.name}
              dept={doc.department}
              center={doc.center}
              startTime={new Date(doc.availableStartTime).toLocaleTimeString(
                "en-US"
              )}
              endTime={new Date(doc.availableEndTime).toLocaleTimeString(
                "en-US"
              )}
              onSelect={() =>
                handleSelectDoctor(doc.name, doc.email, doc.center)
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter the Reason for Appointment
          </Typography>
          <TextField onChange={(e) => setReason(e.target.value)} />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter your Appointment Timings
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => {
                setStartTime(newValue["$d"]);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => {
                setEndTime(newValue["$d"]);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <Button onClick={handleSubmit}>Make Appointment</Button>
        </Box>
      </Modal>
    </>
  );
}

function DoctorCard({ onSelect, name, dept, center, startTime, endTime }) {
  return (
    <Box sx={{ width: 275 }} display={"flex"} flexDirection={"column"}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {center}
          </Typography>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {dept}
          </Typography>
          <Typography variant="body2">Start Time : {startTime}</Typography>
          <Typography variant="body2">End Time : {endTime}</Typography>
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
