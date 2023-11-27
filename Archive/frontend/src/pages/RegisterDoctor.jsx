import {
  Button,
  Container,
  Avatar,
  Grid,
  Link,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Box } from "@mui/system";
import { LockOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import axios from "axios";

function RegisterDoctor() {
  const handleSubmit = () => {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("");
  const [name, setName] = useState("");
  const [center, setCenter] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleRegister = async (e) => {
    const data = {
      email,
      name,
      department: dept,
      center,
      availableStartTime: startTime,
      availableEndTime: endTime,
      password,
    };
    console.log(data);
    const out = await axios.post(
      "http://localhost:8081/api/v1/createdoctor",
      data
    );
    console.log(out);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create New Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              onChange={(e) => setName(e.target.value)}
              label="User name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => setDept(e.target.value)}
              name="department"
              label="Department"
              type="text"
              id="department"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => setCenter(e.target.value)}
              name="center"
              label="Medical Center"
              type="text"
              id="center"
            />
            <FormControlLabel
              label="Available Start Time"
              control={
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
              }
            />
            <FormControlLabel
              label="Available End Time"
              control={
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
              }
            />
            <Button
              fullWidth
              onClick={handleRegister}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create New Doctor Account
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already Have an account ? Login !"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default RegisterDoctor;
