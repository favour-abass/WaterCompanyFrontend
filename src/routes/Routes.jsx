import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import LandingPage from "../pages/public/LandingPage";
import VerifyWaterPage from "../pages/public/VerifyWaterPage";
import ReportWaterPage from "../pages/public/ReportWaterPage";
import AboutPage from "../pages/public/AboutPage";

const Routes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify" element={<VerifyWaterPage />} />
      <Route path="/report" element={<ReportWaterPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Route>
  </Routes>
);

export default Routes;
