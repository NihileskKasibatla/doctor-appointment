import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import doctorLogo from '../assets/Doctor-PNG-1.png'
import patientLogo from '../assets/patient-2.png'

import './Login.css';
import AppContext from '../store/store';

const Home = () => {
  const {accountType, setAccountType} = useContext(AppContext);
  const [logo, setLogo] = useState(doctorLogo);

  useEffect(() => {
    setAccountType(accountType);
  }, [accountType]);

  const handleChange = (event, userVal) => {
    if (userVal === 0) {
      setLogo(doctorLogo);
    }
    else {
      setLogo(patientLogo);
    }
    setAccountType(userVal);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (<div className='login'>
    <form id="login-form">
      <img className='doctor-logo' src={logo} alt='Doctor Logo' />
      <Tabs
        value={accountType}
        onChange={handleChange}
        aria-label="secondary tabs example"
        className='login-tabs'
        variant="fullWidth"
      >
        <Tab label="Doctor"  {...a11yProps(0)} />
        <Tab label="Patient" {...a11yProps(1)} />
      </Tabs>
      <label type="text" htmlFor="username">Username</label>
      <input type="text" placeholder="Email or Phone" id="username" />
      <label htmlFor="password">Password</label>
      <input type="password" placeholder="Password" id="password" />
      <button className='sign-in-btn'>Sign In</button>
      <Link className='sign-up'  to='/register'>
        {"Don't have an account? Sign Up"}
      </Link>
    </form>
  </div>);
}

export default Home;