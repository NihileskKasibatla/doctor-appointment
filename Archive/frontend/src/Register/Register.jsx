import React, { useEffect, useState } from "react";
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
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';


import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box } from "@mui/system";
import { LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import './Register.css';
import { useRef, useContext } from "react";
import AppContext from "../store/store";

const RegisterDoctor = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [disableCreateAccount, setDisableCreateAccount] = useState(false);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorUserName, setErrorUserName] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

  const [successMessage, setSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const navigate = useNavigate();

  const [inputType, setInputType] = useState("password");
  const passwordRef = useRef('');
  const { accountType } = useContext(AppContext);

  const isValidPhoneNumber = (phoneNumber) => {
    return /^[0-9\b]+$/.test(phoneNumber);
  }

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const isValidUserName = (userName) => {
    return /^[A-Za-z]+$/.test(userName);
  }

  const isValidPassword = (password) => {
    return /(.|\s)*\S(.|\s)*/.test(password);
  }

  const handlePhoneNumberChange = (event) => {
    if (!isValidPhoneNumber(event.target.value)) {
      setErrorPhoneNumber(true);

    }
    else {
      setErrorPhoneNumber(false);

    }
    setPhone(event.target.value);
  }

  const handleEmailChange = (event) => {
    if (!isValidEmail(event.target.value)) {
      setErrorEmail(true);
    }
    else {
      setErrorEmail(false);
    }
    setEmail(event.target.value);
  }

  const handleUserNameChange = (event) => {
    if (!isValidUserName(event.target.value)) {
      setErrorUserName(true);

    }
    else {
      setErrorUserName(false);
    }
    setName(event.target.value);
  }

  const handlePasswordChange = (event) => {
    if (!isValidPassword(event.target.value)) {
      setErrorPassword(true);

    }
    else {
      setErrorPassword(false);

    }
    setName(event.target.value);
  }

  const handleCreateAccount = () => {
    if (!errorEmail && !errorPassword && !errorPhoneNumber && !errorUserName) {
      setShowErrorMessage(true);
      console.log('a');
    }
  };

  // useEffect(() => {
  //   console.log({ errorEmail, errorPassword, errorPhoneNumber, errorUserName });
  //   if (!isFirstTimePageLoad && (errorEmail || errorPassword || errorPhoneNumber || errorUserName)) {
  //     setDisableCreateAccount(true);
  //   } else setDisableCreateAccount(false);
  // }, [email, password, phone, name])


  // const handleRegister = async () => {
  //   const data = {
  //     email,
  //     name,
  //     department: dept,
  //     center,
  //     availableStartTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(startTime)),
  //     availableEndTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(endTime)),
  //     password,
  //   };

  //   console.log("Sending request with data:", data);

  //   try {
  //     const response = await axios.post("http://localhost:8081/api/v1/createdoctor", data);
  //     console.log("Response from server:", response.data);

  //     // Show success message
  //     setSuccessMessage('Doctor details added successfully');
  //   } catch (error) {
  //     console.error("Error creating doctor:", error);
  //   }
  //   navigate("/");
  // };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const showPassword = (e) => {
    const passwordElType = passwordRef?.current?.attributes?.type?.value || '';
    if (passwordElType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  }

  return (<div className={`register-container${accountType === 0 ? ` doctor` : ''}`}>
    <div className='register'>
      <form id="register-form">
        <div className="form-elements">

          <div className="avatar">
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h6">
              Create New {accountType === 0 ? 'Doctor' : 'Patient'} Account
            </Typography>
          </div>

          <FormGroup>
            {errorEmail && <label style={{ color: 'red' }} htmlFor="emailaddress">Email Address is invalid</label>}
            {!errorEmail && <label type="text" htmlFor="emailaddress">Email Address</label>}
            <input type="text" onChange={handleEmailChange} placeholder="Please enter your Email Address" id="emailaddress" required />
          </FormGroup>

          <FormGroup>
            {errorUserName && <label style={{ color: 'red' }} htmlFor="username">Username is invalid</label>}
            {!errorUserName && <label type="text" htmlFor="username">Username</label>}
            <input type="text" onChange={handleUserNameChange} placeholder="Please enter your username. Only alphabets allowed" id="username" required />
          </FormGroup>

          {accountType === 1 && <FormGroup>
            {errorPhoneNumber && <label style={{ color: 'red' }} htmlFor="phonenumber">Phone Number is invalid</label>}
            {!errorPhoneNumber && <label htmlFor="phonenumber">Phone Number</label>}
            <input type="text" onChange={handlePhoneNumberChange} placeholder="Please enter your phone number. Only numbers allowed" id="phonenumber" required />
          </FormGroup>}

          <FormGroup>
            {errorPassword && <label style={{ color: 'red' }} htmlFor="password">Password is invalid</label>}
            {!errorPassword && <label type="text" htmlFor="password">Password</label>}
            <input type={inputType} onChange={handlePasswordChange} ref={passwordRef} placeholder="Please enter your password" id="password" required />
          </FormGroup>

          <FormGroup>
            <FormControlLabel control={<Checkbox onClick={showPassword} />} label="Show Password" />
          </FormGroup>

          {accountType === 0 && <FormGroup>
            <label type="text" htmlFor="department">Department</label>
            <input type="text" placeholder="Please enter your Department" id="department" required />
          </FormGroup>}

          {accountType === 0 && <FormGroup>
            <label type="text" htmlFor="center">Medical Center</label>
            <input type="text" placeholder="Please enter your medical center" id="center" />
          </FormGroup>}

          {accountType === 0 && <FormGroup>
            <FormControlLabel
              label="Available Start Time"
              labelPlacement="top"
              className="available-start-time"
              control={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={startTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                    ampm={false}
                  />
                </LocalizationProvider>
              }
            />
          </FormGroup>}

          {accountType === 0 && <FormGroup>
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
          </FormGroup>}

          {showErrorMessage && <label style={{ color: 'red' }} >Please enter your information</label>}
          <button type="button" onClick={handleCreateAccount} className='register-btn' disabled={disableCreateAccount}>Create New {accountType === 0 ? 'Doctor' : 'Patient'} Account</button>

        </div>
      </form>
    </div>
  </div>)
}


export default RegisterDoctor;
