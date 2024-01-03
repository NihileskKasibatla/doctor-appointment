import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import DoctorDetails from "./DoctorDetails";
import DoctorHome from "./DoctorHome";
import Login from "./Login";
import Register from "./Register";
import RegisterDoctor from "./RegisterDoctor";
import SelectDoctor from "./SelectDoctor";
import UserHome from "./UserHome";
import Home from "./Home/Home";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerDoctor" element={<RegisterDoctor />} />
          <Route path="/selectDoctor" element={<SelectDoctor />} />

          <Route path="/userDash" element={<UserHome />} />
          <Route path="/doctorDash" element={<DoctorHome />} />
          <Route path="/doctorDetails/:id" element={<DoctorDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
