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

  const handleRegister = async (e) => {
    const data = {
      userEmail: email,
      userName: name,
      userPassword: password,
      userAddress: "",
      userPhoneNumber: phone,
    };
    console.log(data);
    const out = await axios.post("http://localhost:8081/api/v1/adduser", data);
    console.log(out);
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
              id="username"
              onChange={(e) => setName(e.target.value)}
              label="User Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              onChange={(e) => setPhone(e.target.value)}
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
              <br/>
              <Grid item>
                <Link href="/registerDoctor" variant="body2">
                  {"Register as Doctor !"}
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
