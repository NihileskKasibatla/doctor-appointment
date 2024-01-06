import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import DoctorDetails from "./DoctorDetails";

import SelectDoctor from "./SelectDoctor";
import UserHome from "./UserHome";

import Header from "./Header/Header";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import DoctorDashboard from "./DoctorDashboard/DoctorDashboard";
import UserDashboard from "./UserDashboard/UserDashboard";

import AppContext from "./store/store";
import { useState } from "react";

const App = () => {
    const [accountType, setAccountType] = useState(0);

    return (
        <AppContext.Provider value={{ accountType, setAccountType }}>
            <div className="app">
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/doctorDashboard" element={<DoctorDashboard />} />
                        <Route path="/userDashboard" element={<UserDashboard />} />

                        <Route path="/selectDoctor" element={<SelectDoctor />} />
                        <Route path="/userDash" element={<UserHome />} />
                        <Route path="/doctorDetails/:id" element={<DoctorDetails />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AppContext.Provider>
    );
};

export default App;
