import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
  Divider,
  Popover,
} from "@mui/material";
import { ArrowBack, CalendarMonth, StarRate, Cancel, InfoOutlined } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    marginBottom: "10px",
  },
  fabButton: {
    backgroundColor: "#3f51b5",
    color: "white",
    "&:hover": {
      backgroundColor: "#2c387e",
    },
  },
  appointmentCard: {
    width: '48%',
    display: "flex",
    flexDirection: "column",
    marginBottom: 8,
    marginRight: '2%',
    borderRadius: 8,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  feedbackIcon: {
    marginRight: 5,
  },
  infoIcon: {
    marginLeft: 1,
    fontSize: 18,
    cursor: 'pointer',
  },
};

function UserHome() {
  const [apps, setApps] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [infoPopupOpen, setInfoPopupOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const out = await axios.get(
      `http://localhost:8081/api/v1/appointment/${userData.userEmail}`
    );
    setApps(out.data);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/");
  };

  const navigate = useNavigate();

  const handleFeedbackClick = async (appointment) => {
    const appointmentTime = dayjs(appointment.slot);
    const currentTime = dayjs();

    if (currentTime.isAfter(appointmentTime)) {
      setSelectedAppointment(appointment);
      setFeedbackDialogOpen(true);
    } else {
      Swal.fire("You can only give feedback for past appointments.");
    }
  };

  const handleCancelClick = async (appointment) => {
    try {
      await axios.post(
        `http://localhost:8081/api/v1/cancelAppointment/${appointment.id}`
      );

      setApps((prevApps) => prevApps.filter((app) => app.id !== appointment.id));

      Swal.fire("Appointment cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      Swal.fire("Failed to cancel appointment. Please try again.");
    }
  };

  const handleInfoIconClick = (event) => {
    setInfoPopupOpen(event.currentTarget);
  };

  const handleInfoPopupClose = () => {
    setInfoPopupOpen(null);
  };

  const handleFeedbackDialogClose = () => {
    setSelectedAppointment(null);
    setFeedback("");
    setRating(0);
    setFeedbackDialogOpen(false);
  };

  const submitFeedback = async () => {
    const updateRating = await axios.post(
      "http://localhost:8081/api/v1/updateRating",
      {
        email: selectedAppointment.doctorEmail,
        rating,
      }
    );

    const updateAppointmentWithFeedback = await axios.post(
      "http://localhost:8081/api/v1/updateFeedback",
      {
        id: selectedAppointment.id,
        feedback,
      }
    );

    setFeedbackDialogOpen(false);
  };

  const sortedApps = apps.sort((a, b) => dayjs(a.slot).valueOf() - dayjs(b.slot).valueOf());
  const currentTime = dayjs();
  const upcomingApps = sortedApps.filter((app) => dayjs(app.slot).isAfter(currentTime));
  const pastApps = sortedApps.filter((app) => dayjs(app.slot).isBefore(currentTime));

  // Helper text or headline message about doctor's lunch and dinner times
  const lunchTimeMessage = "Please note: The doctor's lunchtime is from 12:00 PM to 1:00 PM, and dinner time is from 7:00 PM to 8:00 PM.";

  return (
    <>
      {/* Header Section */}
      <Box sx={styles.header}>
        <Box>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h2">Your Health Dashboard</Typography>
        </Box>
        <Box>
          <Fab
            size="medium"
            color="secondary"
            aria-label="profile"
            onClick={handleMenuClick}
            sx={{ marginLeft: 'auto' }}
          >
            <AccountCircleIcon />
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
      {/* Book New Appointment Section */}
      <Box sx={styles.contentBox}>
        <Fab
          variant="extended"
          onClick={() => navigate("/selectDoctor")}
          sx={{ ...styles.fabButton, marginLeft: 'auto' }}
        >
          <CalendarMonth sx={{ mr: 1 }} />
          Book New Appointment
        </Fab>
      </Box>

      {/* Content Section */}
      <Box sx={styles.contentBox}>
        {/* Upcoming Appointments Section */}
        <Box sx={{ width: '48%' }}>
          <Typography variant="h4" sx={styles.pageTitle}>
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
            flexDirection={"row"}
            flexWrap={"wrap"}
          >
            {upcomingApps.map((app, index) => (
              <AppointmentCard
                key={app.appointmentId}
                center={app.medicalCenter}
                reason={app.reason}
                docPhone={app.doctorPhone}
                docName={app.doctorName}
                feedback={app.feedback}
                startTime={dayjs(app.slot).format('DD MMM YYYY HH:mm')}
                onFeedbackClick={() => handleFeedbackClick(app)}
                onCancelClick={() => handleCancelClick(app)}
                isUpcoming={true}
              />
            ))}
          </Box>
        </Box>

        {/* Past Appointments Section */}
        <Box sx={{ width: '48%' }}>
          <Typography variant="h4" sx={styles.pageTitle}>
            Past Appointments
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            flexWrap={"wrap"}
          >
            {pastApps.map((app, index) => (
              <AppointmentCard
                key={app.appointmentId}
                center={app.medicalCenter}
                reason={app.reason}
                docPhone={app.doctorPhone}
                docName={app.doctorName}
                feedback={app.feedback}
                onFeedbackClick={() => handleFeedbackClick(app)}
                startTime={dayjs(app.slot).format('DD MMM YYYY HH:mm')}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Info Popup */}
      <Popover
        open={Boolean(infoPopupOpen)}
        anchorEl={infoPopupOpen}
        onClose={handleInfoPopupClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{lunchTimeMessage}</Typography>
      </Popover>

      {/* Feedback Dialog */}
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
    </>
  );
}

function AppointmentCard({
  center,
  startTime,
  docName,
  feedback,
  reason,
  onFeedbackClick,
  onCancelClick,
  isUpcoming,
}) {
  const isFeedbackGiven = !!feedback;

  const handleFeedbackClick = () => {
    if (!isFeedbackGiven) {
      onFeedbackClick();
    } else {
      Swal.fire("Feedback is already provided!!");
    }
  };

  return (
    <Box sx={styles.appointmentCard}>
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
    </Box>
  );
}

export default UserHome;