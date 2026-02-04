import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import LandingPage from "./pages/public/LandingPage";
import VerifyWater from "./pages/public/VerifyWater";
import ReportWaterPage from "./pages/public/ReportWaterPage";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard" ;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<VerifyWater />} />
        <Route path="/verify/water" element={<VerifyWater />} />
        <Route path="/report" element={<ReportWaterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
