import { useState } from 'react';
import {
  Link,
} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import './Login.css';
import doctorLogo from '../../assets/Doctor-PNG-1.png'
import patientLogo from '../../assets/patient-2.png'

const Home = () => {
  const [userType, setuserType] = useState(0);
  const [logo, setLogo] = useState(doctorLogo);

  const handleChange = (event, newValue) => {
    setuserType(newValue);
    if (newValue === 0) setLogo(doctorLogo);
    else setLogo(patientLogo);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (<div className='Login'>

    <form>
      <img className='doctor-logo' src={logo} alt='Doctor Logo' />
      <Tabs
        value={userType}
        onChange={handleChange}
        aria-label="secondary tabs example"
        className='login-tabs'
        variant="fullWidth"
      >
        <Tab label="Doctor"  {...a11yProps(0)} />
        <Tab label="Patient" {...a11yProps(1)} />
      </Tabs>
      <label type="text" for="username">Username</label>
      <input type="text" placeholder="Email or Phone" id="username" />
      <label for="password">Password</label>
      <input type="password" placeholder="Password" id="password" />
      <button className='sign-in-btn'>Sign In</button>
      <Link className='sign-up' href="/registerDoctor" variant="body2">
        {"Don't have an account? Sign Up"}
      </Link>
    </form>
  </div>);
}

export default Home;