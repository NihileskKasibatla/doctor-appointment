import React, { useState } from "react";
import axios from "axios";
import {
    Button,
    Container,
    Avatar,
    Grid,
    Link,
    TextField,
    Typography,
    FormControlLabel,
    Snackbar,
    Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box } from "@mui/system";
import { LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function RegisterDoctor() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dept, setDept] = useState("");
    const [name, setName] = useState("");
    const [center, setCenter] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorUserName, setErrorUserName] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidUserName = (userName) => /^[A-Za-z]+$/.test(userName);

    const handleEmailChange = (event) => {
        const inputEmail = event.target.value;
        setEmail(inputEmail);
        setErrorEmail(isValidEmail(inputEmail) ? null : "Email is invalid");
    };

    const handleUserNameChange = (event) => {
        const inputUserName = event.target.value;
        setName(inputUserName);
        setErrorUserName(isValidUserName(inputUserName) ? null : "User Name is invalid");
    };

    const handleRegister = async () => {
        const data = {
            email,
            name,
            department: dept,
            center,
            availableStartTime: new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(new Date(startTime)),
            availableEndTime: new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(new Date(endTime)),
            password,
        };

        console.log("Sending request with data:", data);

        try {
            const response = await axios.post("http://localhost:8081/api/v1/createdoctor", data);
            console.log("Response from server:", response.data);

            // Show success message
            setSuccessMessage("Doctor details added successfully");
        } catch (error) {
            console.error("Error creating doctor:", error);
        }
        navigate("/");
    };

    const handleCloseSuccessMessage = () => {
        setSuccessMessage(null);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Grid container justifyContent="center" alignItems="center" height="100vh">
                <Grid item>
                    <Box
                        sx={{
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
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleRegister();
                            }}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                onChange={handleEmailChange}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={Boolean(errorEmail)}
                                helperText={errorEmail}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                onChange={handleUserNameChange}
                                label="User name"
                                name="name"
                                autoComplete="name"
                                error={Boolean(errorUserName)}
                                helperText={errorUserName}
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
                                            onChange={(newValue) => setStartTime(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                            ampm={false}
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
                                            onChange={(newValue) => setEndTime(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                            ampm={false}
                                        />
                                    </LocalizationProvider>
                                }
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Create New Doctor Account
                            </Button>
                            <Link href="/" variant="body2">
                                {"Already Have an account? Login!"}
                            </Link>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={6000}
                onClose={handleCloseSuccessMessage}
            >
                <Alert onClose={handleCloseSuccessMessage} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default RegisterDoctor;
