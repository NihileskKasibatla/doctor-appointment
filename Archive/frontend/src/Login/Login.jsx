import { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FormGroup } from '@mui/material';

import doctorLogo from '../assets/Doctor-PNG-1.png';
import patientLogo from '../assets/patient-2.png';

import './Login.css';
import AppContext from '../store/store';

const Home = () => {
    const { accountType, setAccountType } = useContext(AppContext);
    const [logo, setLogo] = useState(doctorLogo);
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const userNameRef = useRef();
    const passwordRef = useRef();

    const isValidUserName = (inputVal) => {
        const isValid = /^[A-Za-z]+$/.test(inputVal) || /\S+@\S+\.\S+/.test(inputVal);
        return isValid;
    };

    const isValidPassword = (password) => {
        return /(.|\s)*\S(.|\s)*/.test(password);
    };

    useEffect(() => {
        setAccountType(accountType);
    }, [accountType]);

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
            'aria-controls': `simple-tabpanel-${index}`,
        };
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
        const passwordVal = passwordRef.current.value;
        let validationFail = true;

        console.log({ userNameVal, passwordVal });

        if (!userNameVal) setErrorUserName(true);
        if (!passwordVal) setErrorPassword(true);

        if (!userNameVal || !passwordVal) {
            validationFail = true;
        } else validationFail = false;

        return validationFail;
    };

    const handleSignIn = () => {
        const isValidationFailed = validateAllFields();

        if (isValidationFailed) console.log('Fail');
        else console.log('Success');
    };

    return (
        <div className='login'>
            <form id='login-form'>
                <img className='doctor-logo' src={logo} alt='Doctor Logo' />
                <Tabs
                    value={accountType}
                    onChange={handleChange}
                    aria-label='secondary tabs example'
                    className='login-tabs'
                    variant='fullWidth'
                >
                    <Tab label='Doctor' {...a11yProps(0)} />
                    <Tab label='Patient' {...a11yProps(1)} />
                </Tabs>

                <FormGroup>
                    {errorUserName && (
                        <label style={{ color: 'red' }} htmlFor='username'>
                            Username is invalid
                        </label>
                    )}
                    {!errorUserName && (
                        <label type='text' htmlFor='username'>
                            Username
                        </label>
                    )}
                    <input
                        type='text'
                        ref={userNameRef}
                        placeholder='Email or Phone'
                        onChange={handleUserNameChange}
                        id='username'
                    />
                </FormGroup>

                <FormGroup>
                    {errorPassword && (
                        <label style={{ color: 'red' }} htmlFor='password'>
                            Password is invalid
                        </label>
                    )}
                    {!errorPassword && (
                        <label type='text' htmlFor='password'>
                            Password
                        </label>
                    )}
                    <input
                        type='password'
                        ref={passwordRef}
                        placeholder='Password'
                        onChange={handlePasswordChange}
                        id='password'
                    />
                </FormGroup>

                <button type='button' onClick={handleSignIn} className='sign-in-btn'>
                    Sign In as {accountType === 0 ? 'Doctor' : 'Patient'}
                </button>
                <Link className='sign-up' to='/register'>
                    {"Don't have an account? Sign Up"}
                </Link>
            </form>
        </div>
    );
};

export default Home;
