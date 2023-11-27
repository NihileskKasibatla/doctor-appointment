import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import DoctorDetails from "./pages/DoctorDetails";
import DoctorHome from "./pages/DoctorHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterDoctor from "./pages/RegisterDoctor";
import SelectDoctor from "./pages/SelectDoctor";
import UserHome from "./pages/UserHome";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
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
