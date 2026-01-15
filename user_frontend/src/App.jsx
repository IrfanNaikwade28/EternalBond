import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./Components/Layout";
import ScrollToTop from "./Components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProfileUpdate from "./pages/ProfileUpdate";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
//import MatrimonyNavbar from "./pages/MatrimonyNavbar";
import Landing from "./pages/Landing";
import PublicLayout from "./pages/PublicLayout";
import WishList from "./pages/WishList";


function App() {
  // Track logged-in user
   const [user, setUser] = useState(() => {
   
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <>
    <ScrollToTop behavior="smooth" />
    <Routes>
       <Route element={<PublicLayout />}>
       <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} /> 
</Route>
      
       <Route
        path="/app"
        element={user ? <Layout /> : <Navigate to="/" replace />}
      >
       <Route index element={<Dashboard />} />
      <Route path="profile"  element={<Profile />} />
      <Route path="profileupdate"  element={<ProfileUpdate />} />
      <Route path="changepassword"  element={<ChangePassword />} />
        <Route path="wishList"  element={<WishList />} />
       {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
