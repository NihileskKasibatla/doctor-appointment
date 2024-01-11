import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Avatar,
    TextField,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Snackbar,
    Alert,
} from "@mui/material";
import Stack from "@mui/system/Stack";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { useRef, useContext } from "react";
import AppContext from "../store/store";

const Register = () => {
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 1 * 60 * 60 * 1000));

    const [errorEmail, setErrorEmail] = useState(false);
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
    const [errorDepartment, setErrorDepartment] = useState(false);
    const [errorMedicalCenter, setErrorMedicalCenter] = useState(false);

    const userNameRef = useRef();
    const emailAddressRef = useRef();
    const phoneRef = useRef();
    const departmentRef = useRef();
    const medicalCenterRef = useRef();
    const passwordRef = useRef("");

    const [inputType, setInputType] = useState("password");
    const { accountType, setAccountType } = useContext(AppContext);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loggedInRole = localStorage.getItem("role");

    useEffect(() => {
        if (loggedInRole === "doctor") setAccountType(0);
        else setAccountType(1);
        if (isLoggedIn) {
            if (loggedInRole === "doctor") navigate("/doctorDashboard");
            else navigate("/userDashboard");
        }
    }, [isLoggedIn, loggedInRole]);

    const isValidPhoneNumber = (phoneNumber) => {
        return /^[0-9]{10}$/g.test(phoneNumber);
    };

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const isValidUserName = (userName) => {
        return /^[A-Za-z].{4,}$/.test(userName);
    };

    const isValidPassword = (password) => {
        return /(.|\s)*\S(.|\s)*/.test(password);
    };

    const isValidDepartment = (department) => {
        return /[A-Za-z0-9'\.\-\s\,]/.test(department);
    };

    const isValidMedicalCenter = (medicalCenter) => {
        return /[A-Za-z0-9'\.\-\s\,]/.test(medicalCenter);
    };

    const handleDepartmentChange = (event) => {
        if (!isValidDepartment(event.target.value)) {
            setErrorDepartment(true);
        } else {
            setErrorDepartment(false);
        }
    };

    const handlePhoneNumberChange = (event) => {
        if (!isValidPhoneNumber(event.target.value)) {
            setErrorPhoneNumber(true);
        } else {
            setErrorPhoneNumber(false);
        }
    };

    const handleMedicalCenterChange = (event) => {
        if (!isValidMedicalCenter(event.target.value)) {
            setErrorMedicalCenter(true);
        } else {
            setErrorMedicalCenter(false);
        }
    };

    const handleEmailChange = (event) => {
        if (!isValidEmail(event.target.value)) {
            setErrorEmail(true);
        } else {
            setErrorEmail(false);
        }
    };

    const handleUserNameChange = (event) => {
        if (!isValidUserName(event.target.value)) {
            setErrorUserName(true);
        } else {
            setErrorUserName(false);
        }
    };

    const handlePasswordChange = (event) => {
        if (!isValidPassword(event.target.value)) {
            setErrorPassword(true);
        } else {
            setErrorPassword(false);
        }
    };

    const validateAllFields = () => {
        const userNameVal = userNameRef.current.value;
        const emailAddressVal = emailAddressRef.current.value;
        const phoneVal = phoneRef?.current?.value;
        const passwordVal = passwordRef.current.value;
        const departmentVal = departmentRef?.current?.value;
        const medicalCenterVal = medicalCenterRef?.current?.value;
        let validationFail = true;

        if (!emailAddressVal) setErrorEmail(true);
        if (!userNameVal) setErrorUserName(true);
        if (!passwordVal) setErrorPassword(true);

        if (accountType === 0) {
            //Validations for register doctor
            if (!departmentVal) setErrorDepartment(true);
            if (!medicalCenterVal) setErrorMedicalCenter(true);

            if (
                !userNameVal ||
                !emailAddressVal ||
                !passwordVal ||
                !departmentVal ||
                !medicalCenterVal
            ) {
                setShowErrorMessage(true);
                validationFail = true;
            } else if (
                errorEmail ||
                errorPassword ||
                errorUserName ||
                errorDepartment ||
                errorMedicalCenter
            ) {
                setShowErrorMessage(true);
                validationFail = true;
            } else {
                setShowErrorMessage(false);
                validationFail = false;
            }
        } else {
            //Validations for register patient
            if (!phoneVal) {
                setErrorPhoneNumber(true);
                validationFail = true;
            }
            if (!userNameVal || !emailAddressVal || !phoneVal || !passwordVal) {
                setShowErrorMessage(true);
                validationFail = true;
            } else if (errorEmail || errorPassword || errorPhoneNumber || errorUserName) {
                setShowErrorMessage(true);
                validationFail = true;
            } else {
                setShowErrorMessage(false);
                validationFail = false;
            }
        }
        return validationFail;
    };

    const createDoctor = async () => {
        const userNameVal = userNameRef.current.value;
        const emailAddressVal = emailAddressRef.current.value;
        // const phoneVal = phoneRef?.current?.value;
        const passwordVal = passwordRef.current.value;
        const departmentVal = departmentRef?.current?.value;
        const medicalCenterVal = medicalCenterRef?.current?.value;

        const data = {
            email: emailAddressVal,
            password: passwordVal,
            name: userNameVal,
            department: departmentVal,
            center: medicalCenterVal,
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
        };
        try {
            const response = await axios.post("http://localhost:8081/api/v1/createdoctor", data);
            console.log("Response from server:", response.data);

            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => navigate("/"), 5000);
        } catch (error) {
            console.error("Error creating doctor:", error);
        }
    };

    const createUser = async () => {
        const userNameVal = userNameRef.current.value;
        const emailAddressVal = emailAddressRef.current.value;
        const phoneVal = phoneRef?.current?.value;
        const passwordVal = passwordRef.current.value;
        const data = {
            userEmail: emailAddressVal,
            userName: userNameVal,
            userPassword: passwordVal,
            userAddress: "",
            userPhoneNumber: phoneVal,
        };

        try {
            const response = await axios.post("http://localhost:8081/api/v1/adduser", data);
            console.log("Response from server:", response.data);

            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => navigate("/"), 5000);
        } catch (error) {
            console.error("Error creating doctor:", error);
        }
    };

    const handleCreateAccount = () => {
        const isValidationFailed = validateAllFields();

        if (isValidationFailed) console.log("Fail");
        else {
            if (accountType === 0) createDoctor();
            else createUser();
        }
    };

    const showPassword = (_e) => {
        const passwordElType = passwordRef?.current?.attributes?.type?.value || "";
        if (passwordElType === "password") {
            setInputType("text");
        } else {
            setInputType("password");
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setShowSuccessMessage(false);
    };

    return (
        <div className={`register-container${accountType === 0 ? ` doctor` : ""}`}>
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar open={showSuccessMessage} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                        Your account has been successfully created! You will be redirected to home
                        screen in few seconds!
                    </Alert>
                </Snackbar>
            </Stack>

            <div className="register">
                <form id="register-form">
                    <div className="form-elements">
                        <div className="avatar">
                            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                                <LockOutlined />
                            </Avatar>
                            <Typography component="h1" variant="h6">
                                Create New {accountType === 0 ? "Doctor" : "Patient"} Account
                            </Typography>
                        </div>

                        <FormGroup>
                            {errorEmail && (
                                <label style={{ color: "red" }} htmlFor="emailaddress">
                                    Email Address is invalid
                                </label>
                            )}
                            {!errorEmail && (
                                <label type="text" htmlFor="emailaddress">
                                    Email Address
                                </label>
                            )}
                            <input
                                type="text"
                                ref={emailAddressRef}
                                onChange={handleEmailChange}
                                placeholder="Enter your Email Address"
                                id="emailaddress"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            {errorUserName && (
                                <label style={{ color: "red" }} htmlFor="username">
                                    Username is invalid.{" "}
                                    <span style={{ color: "#FAAF00", fontSize: "12px" }}>
                                        Minimum 5 characters required.
                                    </span>
                                </label>
                            )}
                            {!errorUserName && (
                                <label type="text" htmlFor="username">
                                    Username
                                </label>
                            )}
                            <input
                                type="text"
                                ref={userNameRef}
                                onChange={handleUserNameChange}
                                placeholder="Enter your username. Only alphabets allowed"
                                id="username"
                                required
                            />
                        </FormGroup>

                        {accountType === 1 && (
                            <FormGroup>
                                {errorPhoneNumber && (
                                    <label style={{ color: "red" }} htmlFor="phonenumber">
                                        Phone Number is invalid
                                    </label>
                                )}
                                {!errorPhoneNumber && (
                                    <label htmlFor="phonenumber">Phone Number</label>
                                )}
                                <input
                                    type="text"
                                    ref={phoneRef}
                                    onChange={handlePhoneNumberChange}
                                    placeholder="Enter your 10 digit phone number. Only numbers allowed"
                                    id="phonenumber"
                                    required
                                />
                            </FormGroup>
                        )}

                        <FormGroup>
                            {errorPassword && (
                                <label style={{ color: "red" }} htmlFor="password">
                                    Password is invalid
                                </label>
                            )}
                            {!errorPassword && (
                                <label type="text" htmlFor="password">
                                    Password
                                </label>
                            )}
                            <input
                                type={inputType}
                                onChange={handlePasswordChange}
                                ref={passwordRef}
                                placeholder="Please enter your password"
                                id="password"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox onClick={showPassword} />}
                                label="Show Password"
                            />
                        </FormGroup>

                        {accountType === 0 && (
                            <FormGroup>
                                {errorDepartment && (
                                    <label style={{ color: "red" }} htmlFor="department">
                                        Department is invalid
                                    </label>
                                )}
                                {!errorDepartment && (
                                    <label type="text" htmlFor="department">
                                        Department
                                    </label>
                                )}
                                <input
                                    type="text"
                                    ref={departmentRef}
                                    onChange={handleDepartmentChange}
                                    placeholder="Please enter your Department"
                                    id="department"
                                    required
                                />
                            </FormGroup>
                        )}

                        {accountType === 0 && (
                            <FormGroup>
                                {errorMedicalCenter && (
                                    <label style={{ color: "red" }} htmlFor="medicalcenter">
                                        Medical Center is invalid
                                    </label>
                                )}
                                {!errorMedicalCenter && (
                                    <label type="text" htmlFor="medicalcenter">
                                        Medical Center
                                    </label>
                                )}
                                <input
                                    type="text"
                                    ref={medicalCenterRef}
                                    onChange={handleMedicalCenterChange}
                                    placeholder="Please enter your medical center"
                                    id="medicalcenter"
                                />
                            </FormGroup>
                        )}

                        {accountType === 0 && (
                            <FormGroup>
                                <FormControlLabel
                                    label="Available Start Time"
                                    labelPlacement="top"
                                    className="available-start-time"
                                    control={
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                value={startTime}
                                                onChange={(newValue) => setStartTime(newValue)}
                                                renderInput={(params) => <TextField {...params} />}
                                                ampm={false}
                                            />
                                        </LocalizationProvider>
                                    }
                                />
                            </FormGroup>
                        )}

                        {accountType === 0 && (
                            <FormGroup>
                                <FormControlLabel
                                    label="Available End Time"
                                    labelPlacement="top"
                                    className="available-time"
                                    control={
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                value={endTime}
                                                onChange={(newValue) => setEndTime(newValue)}
                                                renderInput={(params) => <TextField {...params} />}
                                                ampm={false}
                                            />
                                        </LocalizationProvider>
                                    }
                                />
                            </FormGroup>
                        )}

                        {showErrorMessage && (
                            <label style={{ color: "red" }}>Please correct your errors</label>
                        )}
                        <button
                            type="button"
                            onClick={handleCreateAccount}
                            className="register-btn"
                        >
                            Create New {accountType === 0 ? "Doctor" : "Patient"} Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
