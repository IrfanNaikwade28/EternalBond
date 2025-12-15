import { Outlet } from "react-router-dom";
//import LandingNavbar from "./LandingNavbar";   // This is your Landing navbar
//import Footer from "./Footer";
import { Navbar } from "react-bootstrap";
import Navbar1 from "./Navbar1";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <>
      <Navbar1 />
      <Outlet />
       <Footer/>
    </>
  );
}
