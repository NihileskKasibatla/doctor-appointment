import {
  Button,
  Container,
  Avatar,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Checkbox,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { LockOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState();
  const [role, setRole] = useState("doctor");
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const data = {
      userEmail: email,
      userPass: password,
    };
    console.log(data);
    const out = await axios.post(
      role === "doctor"
        ? "http://localhost:8081/api/v1/logindoctor"
        : "http://localhost:8081/api/v1/login",
      data
    );
    if (out.data.email || out.data.userEmail) {
      localStorage.setItem("userData", JSON.stringify(out.data));
      if (role === "doctor") {
        navigate("/doctorDash");
      } else {
        navigate("/userDash");
      }
    } else {
      Swal.fire("Login Failed, Please check your password / email");
    }
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <select onChange={(e) => setRole(e.target.value)} value={role}>
              <option value="doctor">Doctor</option>
              <option value="user">Patient</option>
            </select>
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              onClick={handleSubmit}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Login;
