import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { FormGroup } from "@mui/material";

import doctorLogo from "../assets/Doctor-PNG-1.png";
import patientLogo from "../assets/patient-2.png";

import "./Login.css";
import AppContext from "../store/store";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
    const { accountType, setAccountType } = useContext(AppContext);
    const [role, setUserRole] = useState("");
    const [logo, setLogo] = useState(doctorLogo);
    const [errorEmailAddress, setErrorEmailAddress] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loggedInRole = localStorage.getItem("role");

    const emailAddressRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();

    const isValidEmailAddress = (inputVal) => {
        return /\S+@\S+\.\S+/.test(inputVal);
    };

    const isValidPassword = (password) => {
        return /(.|\s)*\S(.|\s)*/.test(password); //Doesn't allow password to start with only space. It is valid if a space is followed by any character
    };

    useEffect(() => {
        if (!isLoggedIn) {
            setAccountType(accountType);
            setUserRole(accountType === 0 ? "doctor" : "patient");
        } else {
            if (loggedInRole === "doctor") navigate("/doctorDashboard");
            else navigate("/userDashboard");
        }
    }, [isLoggedIn, accountType, loggedInRole]);

    const handleChange = (event, userVal) => {
        if (userVal === 0) {
            setLogo(doctorLogo);
        } else {
            setLogo(patientLogo);
        }
        setAccountType(userVal);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    };

    const handleUserNameChange = (event) => {
        if (!isValidEmailAddress(event.target.value)) {
            setErrorEmailAddress(true);
        } else {
            setErrorEmailAddress(false);
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
        const emailAddressVal = emailAddressRef.current.value;
        const passwordVal = passwordRef.current.value;
        let validationFail = true;

        if (!emailAddressVal) setErrorEmailAddress(true);
        if (!passwordVal) setErrorPassword(true);

        if (!emailAddressVal || !passwordVal) {
            validationFail = true;
        } else validationFail = false;

        return validationFail;
    };

    const signIn = async () => {
        const emailAddressVal = emailAddressRef.current.value;
        const passwordVal = passwordRef.current.value;

        const data = {
            userEmail: emailAddressVal,
            userPass: passwordVal,
        };
        const response = await axios.post(
            role === "doctor"
                ? "http://localhost:8081/api/v1/logindoctor"
                : "http://localhost:8081/api/v1/login",
            data,
        );
        if (response.data.email || response.data.userEmail) {
            localStorage.setItem("userData", JSON.stringify(response.data));
            const loggedInUserName =
                role === "doctor" ? response?.data?.name : response?.data?.userName;
            localStorage.setItem("username", loggedInUserName);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", role);
            if (role === "doctor") {
                navigate("/doctorDashboard");
            } else {
                navigate("/userDashboard");
            }
        } else {
            Swal.fire("Login Failed\nPlease check your email address password combination");
        }
    };

    const handleSignIn = () => {
        const isValidationFailed = validateAllFields();

        if (isValidationFailed) console.log("Failed");
        else {
            signIn();
        }
    };

    return (
        <div className="login">
            <form id="login-form">
                <img className="doctor-logo" src={logo} alt="Doctor Logo" />
                <Tabs
                    value={accountType}
                    onChange={handleChange}
                    aria-label="secondary tabs example"
                    className="login-tabs"
                    variant="fullWidth"
                >
                    <Tab label="Doctor" {...a11yProps(0)} />
                    <Tab label="Patient" {...a11yProps(1)} />
                </Tabs>

                <FormGroup>
                    {errorEmailAddress && (
                        <label style={{ color: "red" }} htmlFor="emailaddress">
                            Email Address is invalid
                        </label>
                    )}
                    {!errorEmailAddress && (
                        <label type="text" htmlFor="emailaddress">
                            Email Address
                        </label>
                    )}
                    <input
                        type="text"
                        ref={emailAddressRef}
                        placeholder="Email or Phone"
                        onChange={handleUserNameChange}
                        id="emailaddress"
                    />
                </FormGroup>

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
                        type="password"
                        ref={passwordRef}
                        placeholder="Password"
                        onChange={handlePasswordChange}
                        id="password"
                    />
                </FormGroup>

                <button type="button" onClick={handleSignIn} className="sign-in-btn">
                    Sign In as {accountType === 0 ? "Doctor" : "Patient"}
                </button>
                <Link className="sign-up" to="/register">
                    {"Don't have an account? Sign Up"}
                </Link>
            </form>
        </div>
    );
};

export default Login;
