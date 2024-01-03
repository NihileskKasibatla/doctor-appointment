
import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Checkbox,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import { LocalHospital, Person } from "@mui/icons-material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const styles = {
  container: {
    background: "#f5f5f5",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    background: "#1976D2",
    padding: "16px",
    borderRadius: "8px 8px 0 0",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  form: {
    background: "white",
    padding: "16px",
    borderRadius: "0 0 8px 8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    m: 1,
    bgcolor: "secondary.main",
  },
  iconText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

function Login() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("doctor");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleEmailChange = (event) => {
    if (!isValidEmail(event.target.value)) {
      setError("Email is invalid");
    } else {
      setError(null);
    }
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    const data = {
      userEmail: email,
      userPass: password,
    };
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
    <Container sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h4">Dr. App</Typography>
      </Box>
      <Box sx={styles.form}>
        <Stack direction="row" spacing={2} mb={2}>
          <IconButton
            color={role === "doctor" ? "primary" : "default"}
            onClick={() => setRole("doctor")}
          >
            <Box sx={styles.iconText}>
              <LocalHospital />
              <Typography variant="caption">Doctor</Typography>
            </Box>
          </IconButton>
          <IconButton
            color={role === "user" ? "primary" : "default"}
            onClick={() => setRole("user")}
          >
            <Box sx={styles.iconText}>
              <Person />
              <Typography variant="caption">Patient</Typography>
            </Box>
          </IconButton>
        </Stack>
        {error && <h5 style={{ color: "red" }}>{error}</h5>}
        <TextField
          margin="normal"
          required
          fullWidth
          onChange={handleEmailChange}
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
        {role === "doctor" ? (
          <Grid container>
            <Grid item>
              <Link href="/registerDoctor" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default Login;

