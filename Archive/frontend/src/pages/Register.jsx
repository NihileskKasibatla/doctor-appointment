import {
  Button,
  Container,
  Avatar,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { LockOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const handleSubmit = () => {};
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorUserName, setErrorUserName] = useState(null);
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(null);
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  function isValidUserName(userName) {
    return /^[A-Za-z]+$/.test(userName);
  }
  function isValidPhoneNumber(phoneNumber) {
    return /^[0-9\b]+$/.test(phoneNumber);
  }
  const handleEmailChange = (event) => {
    if (!isValidEmail(event.target.value)) 
    { 
      setErrorEmail('Email is invalid'); 
    } 
    else 
    { 
      setErrorEmail(null); 
    } 
    setEmail(event.target.value);
  }

  const handleUserNameChange = (event) => {
    if (!isValidUserName(event.target.value)) 
    { 
      setErrorUserName('User Name is invalid'); 
    } 
    else 
    { 
      setErrorUserName(null); 
    } 
    setName(event.target.value);
  }

  const handlePhoneNumberChange = (event) => {
    if (!isValidPhoneNumber(event.target.value)) 
    { 
      setErrorPhoneNumber('Phone Number is invalid'); 
    } 
    else 
    { 
      setErrorPhoneNumber(null); 
    } 
    setPhone(event.target.value);
  }

  const handleRegister = async (e) => {
    const data = {
      userEmail: email,
      userName: name,
      userPassword: password,
      userAddress: "",
      userPhoneNumber: phone,
    };
    const out = await axios.post("http://localhost:8081/api/v1/adduser", data);
    navigate("/");
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
            {errorEmail && <h5 style = {{color:'red'}}>{errorEmail}</h5>}
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
            />
             {errorUserName && <h5 style = {{color:'red'}}>{errorUserName}</h5>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              onChange={handleUserNameChange}
              label="User Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            {errorPhoneNumber && <h5 style = {{color:'red'}}>{errorPhoneNumber}</h5>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              onChange={handlePhoneNumberChange}
              label="Phone Number"
              name="phone"
              autoComplete="phone"
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              onClick={handleRegister}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create New Account
            </Button>
            <div>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already Have an account ? Login !"}
                </Link>
              </Grid>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Register;
