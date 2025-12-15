import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./Components/Layout";
import Dashboard from "./Pages/Dashboard";
import Master from "./Pages/Master";
import Login from "./Pages/Login";

import AddUserDetails from "./Pages/AddUserDetails";
import ShortRegistration from "./Pages/ShortRegistration";
import Demo from "./Pages/Demo";
import ExtendViewCount from "./Pages/ExtendViewCount";
import ActiveUsers from "./Pages/ActiveUsers";
import DeactiveUsers from "./Pages/DeactiveUsers";
import ExpiryPlanUsers from "./Pages/ExpiryPlanUsers";
import ProfileViews from "./Pages/ProfileViews";
import RenewPlanUsers from "./Pages/RenewPlanUsers";
import AddSuccessStory from "./Pages/AddSuccessStory";
import AddTestomonial from "./Pages/AddTestomonial";
import AddAbout from "./Pages/AddAbout";
import BioData from "./Pages/BioData";
import Bio from "./Pages/Bio";
// import Layout from "./layout/Layout";

function App() {
  // Track logged-in user
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={user ? <Layout/> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="Master" element={<Master />} />
        <Route path="Demo" element={<Demo/>}/>
        <Route path="AddUserDetails" element={<AddUserDetails/>} />
        <Route path="ShortRegistration" element={<ShortRegistration/>} />
        <Route path="ExtendViewCount" element={<ExtendViewCount/>} />
        <Route path="ActiveUsers" element={<ActiveUsers/>} />
        <Route path="DeactiveUsers" element={<DeactiveUsers/>} />
        <Route path="ExpiryPlanUsers" element={<ExpiryPlanUsers/>} />
        <Route path="ProfileViews" element={<ProfileViews/>} />
        <Route path="RenewPlanUsers" element={<RenewPlanUsers/>} />
        <Route path="SuccessStory" element={<AddSuccessStory/>} />
        <Route path="BioData" element={<BioData/>} />
        <Route path="Bio" element={<Bio/>} />
        <Route path="Testomonial" element={<AddTestomonial/>} />
        <Route path="About" element={<AddAbout/>} />
      </Route>

      {/* Login Route */}
      <Route path="/login" element={<Login setUser={setUser} />} />
    </Routes>
  );
}

export default App;
