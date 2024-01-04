import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import DoctorDetails from "./DoctorDetails";
import DoctorHome from "./DoctorHome";
import RegisterOld from "./Register";
import LoginOld from "./Login";


import Login from "./Login";
import Register from "./Register/Register";

import RegisterDoctor from "./RegisterDoctor";
import SelectDoctor from "./SelectDoctor";
import UserHome from "./UserHome";
import Home from "./Home/Home";

import AppContext from "./store/store";

import { useState } from 'react';


const App = () => {
  const [accountType, setAccountType] = useState(1);

  return (
    <AppContext.Provider value={{accountType, setAccountType}}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registerDoctor" element={<RegisterDoctor />} />
            <Route path="/loginOld" element={<LoginOld />} />
            <Route path="/registerOld" element={<RegisterOld />} />
            <Route path="/registerDoctorOld" element={<RegisterDoctor />} />
            <Route path="/selectDoctor" element={<SelectDoctor />} />
            <Route path="/userDash" element={<UserHome />} />
            <Route path="/doctorDash" element={<DoctorHome />} />
            <Route path="/doctorDetails/:id" element={<DoctorDetails />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>

  );
}

export default App;
